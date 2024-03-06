<script lang="ts" setup>
import type { Question, QuestionAnswers, QuestionChar, QuestionResults } from '~/models/question'
import { formattedTimer } from '~/global/helper'

const emit = defineEmits<{
  (e: 'finish', value: QuestionResults): void
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
const start = ref(false)
const time = ref(0)
const timer = ref()
const type = ref<QuestionChar['type']>('hiragana')

const question = computed(() =>
  questions.value ? questions.value[selectedQuestion.value] : undefined
)

function startQuiz() {
  selectedQuestion.value = 0
  questions.value = questionGenerate(type.value, onsetsu.value, gaku.value)
  start.value = true
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

function handleOnEnter() {
  correct.value = question.value?.roman.toLowerCase() == answer.value.toLowerCase()
  setAnswer(correct.value)
  if (correct.value) {
    if (selectedQuestion.value == onsetsu.value - 1) {
      stopTimer()
      results.value = {
        time: time.value,
        answers: answers.value
      }
      answers.value = []
      emit('finish', results.value)
    } else selectedQuestion.value++
  }
  answer.value = ''
  showFeedback.value = true
  setTimeout(() => {
    showFeedback.value = false
  }, 1e3)
}

function setAnswer(correct: boolean) {
  if (!question.value) return
  if (answers.value[selectedQuestion.value] == undefined) {
    answers.value[selectedQuestion.value] = {
      question: question.value,
      answers: [{ answer: answer.value, correct }]
    }
  } else answers.value[selectedQuestion.value].answers.push({ answer: answer.value, correct })
}

function handleClickAbort() {
  emit('abort')
  stopTimer()
  start.value = false
}
</script>

<template>
  <n-card class="w-96 max-w-full mt-56">
    <n-space v-if="!start" vertical align="center" :size="16">
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
      <div class="text-6xl font-medium text-center">{{ question?.jp }}</div>
      <!-- <div class="text-center">{{ question?.roman }}</div> -->
      <n-input
        class="text-center"
        v-model:value="answer"
        @keydown.enter="handleOnEnter"
        placeholder=""
      />
      <div v-if="showFeedback" class="text-center">
        <n-icon size="40" :class="correct ? 'text-green-500' : 'text-red-500'">
          <i-ri-checkbox-circle-fill v-if="correct" />
          <i-ri-close-circle-fill v-else />
        </n-icon>
      </div>
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
      </n-button-group>
    </n-space>
  </n-card>
</template>
