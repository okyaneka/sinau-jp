<script lang="ts" setup>
import type { Question, QuestionAnswers, QuestionChar, QuestionResults } from '~/models/question'
import { formattedTimer } from '~/global/helper'

const emit = defineEmits<{
  (e: 'abort'): void
}>()

const answer = ref('')
const answers = ref<QuestionAnswers[]>([])
const correct = ref(false)
const gaku = ref(3)
const onsetsu = ref(10)
const questions = ref<Question[]>()
const results = ref<QuestionResults>()
const selectedQuestion = ref(0)
const showFeedback = ref(false)
const isStart = ref(false)
const isReview = ref(false)
const showHint = ref(false)
const show = ref<boolean[]>([])
const time = ref(0)
const timer = ref()
const type = ref<QuestionChar['type']>('hiragana')

const question = computed(() =>
  questions.value ? questions.value[selectedQuestion.value] : undefined
)

function startQuiz() {
  isReview.value = false
  answers.value = []
  selectedQuestion.value = 0
  questions.value = questionGenerate(type.value, onsetsu.value, gaku.value)
  isStart.value = true
  startTimer()
}

function startTimer() {
  stopTimer()
  time.value = 0
  timer.value = setInterval(() => {
    time.value++
  }, 1e3)
}

function stopTimer() {
  clearInterval(timer.value)
  timer.value = undefined
}

function submitAnswer() {
  if (answer.value.trim() == '') return
  correct.value = setAnswer()
  if (correct.value) {
    if (selectedQuestion.value == onsetsu.value - 1) {
      stopTimer()
      results.value = {
        time: time.value,
        answers: answers.value
      }
      answers.value = []
      isReview.value = true
    } else selectedQuestion.value++
  }
  answer.value = ''
  showFeedback.value = true
  setTimeout(() => {
    showFeedback.value = false
  }, 1e3)
}

function setAnswer() {
  const correct = question.value?.roman.toLowerCase() == answer.value.toLowerCase()
  if (!question.value) return false

  if (answers.value[selectedQuestion.value] == undefined) {
    answers.value[selectedQuestion.value] = {
      question: question.value,
      answers: [{ answer: answer.value, correct }]
    }
  } else answers.value[selectedQuestion.value].answers.push({ answer: answer.value, correct })

  if (answers.value[selectedQuestion.value].answers.length >= 3 && !correct) showHint.value = true
  else showHint.value = false
  return correct
}

function handleClickAbort() {
  emit('abort')
  stopTimer()
  answer.value = ''
  isStart.value = false
  showHint.value = false
  isReview.value = false
}
</script>

<template>
  <n-card class="w-96 max-w-full">
    <n-space v-if="isReview && results" vertical :size="16">
      <div class="text-center text-3xl">Result</div>
      <div class="text-center">Time: {{ formattedTimer(results.time) }}</div>

      <n-table>
        <n-thead>
          <n-tr>
            <n-th>Word</n-th>
            <n-th class="text-right">Total Attempt</n-th>
          </n-tr>
        </n-thead>
        <n-tbody>
          <n-tr v-for="(answer, index) in results.answers">
            <n-td>
              <div class="text-xl font-medium">{{ answer.question.jp }}</div>
              <div class="text-xs">{{ answer.question.roman }}</div>
            </n-td>
            <n-td class="text-right">
              <div class="inline-flex items-center gap-2">
                <span> {{ answer.answers.length }}x </span>

                <n-button circle @click="show[index] = !show[index]">
                  <template #icon>
                    <n-icon>
                      <i-ri-eye-line v-if="!show[index]" />
                      <i-ri-eye-off-line v-else />
                    </n-icon>
                  </template>
                </n-button>
              </div>
              <div class="text-xs" v-if="show[index]">
                {{ answer.answers.map((v) => v.answer.toUpperCase()).join(', ') }}
              </div>
            </n-td>
          </n-tr>
        </n-tbody>
      </n-table>

      <n-space justify="center">
        <n-button-group>
          <n-button secondary type="primary" @click="handleClickAbort">Back</n-button>
          <n-button type="primary" @click="startQuiz">Try Again</n-button>
        </n-button-group>
      </n-space>
    </n-space>
    <n-space v-else-if="!isStart" vertical align="center" :size="16">
      <n-radio-group v-model:value="type">
        <n-radio-button :class="{ 'bg-primary text-white': type == 'hiragana' }" value="hiragana">
          HIRAGANA
        </n-radio-button>
        <n-radio-button :class="{ 'bg-primary text-white': type == 'katakana' }" value="katakana">
          KATAKANA
        </n-radio-button>
      </n-radio-group>
      <div class="flex gap-4">
        <n-form-item label="Onsetsu" :show-feedback="false">
          <n-input-number
            class="w-full"
            v-model:value="onsetsu"
            :show-button="false"
            placeholder=""
          />
        </n-form-item>
        <n-form-item label="Gaku" :show-feedback="false">
          <n-input-number class="w-full" v-model:value="gaku" :show-button="false" placeholder="" />
        </n-form-item>
      </div>
      <n-button type="primary" @click="startQuiz">START</n-button>
    </n-space>
    <n-space v-else vertical :size="16" align="center">
      <div class="text-center">{{ formattedTimer(time) }}</div>
      <div v-if="showFeedback" class="text-center">
        <n-icon size="40" :class="correct ? 'text-green-500' : 'text-red-500'">
          <i-ri-checkbox-circle-fill v-if="correct" />
          <i-ri-close-circle-fill v-else />
        </n-icon>
      </div>
      <div v-if="showHint" class="text-center">{{ question?.roman }}</div>
      <div class="text-6xl font-medium text-center">{{ question?.jp }}</div>
      <n-input
        class="text-center"
        v-model:value="answer"
        @keydown.enter="submitAnswer"
        placeholder=""
      />

      <n-button-group>
        <n-popconfirm
          @positive-click="handleClickAbort"
          :show-icon="false"
          positive-text="Yes"
          negative-text="No"
        >
          <template #trigger>
            <n-button secondary type="primary">ABORT</n-button>
          </template>
          Are you sure?
        </n-popconfirm>
        <n-button type="primary" @click="startQuiz">RESTART</n-button>
        <n-button type="success" @click="submitAnswer">SUBMIT</n-button>
      </n-button-group>
    </n-space>
  </n-card>
</template>
