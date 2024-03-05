<script setup lang="ts">
import type { Question, QuestionAnswer, QuestionChar } from '@/models/question'

useTitle(title('Play'))

const questions = ref<Question[]>()
const selectedQuestion = ref(0)
const answer = ref('')
const correct = ref(false)
const showFeedback = ref(false)
const type = ref<QuestionChar['type']>('hiragana')
const start = ref(false)
const review = ref(false)
const onsetsu = ref(10)
const gaku = ref(3)
const timer = ref()
const seconds = ref(0)
const answers = ref<QuestionAnswer[]>([])
const results = ref<{ time: number; answers: QuestionAnswer[] }>()

const question = computed(() =>
  questions.value ? questions.value[selectedQuestion.value] : undefined
)

function formattedTimer(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toFixed()
    .toString()
    .padStart(2, '0')
  const s = (seconds % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function startQuiz() {
  selectedQuestion.value = 0
  questions.value = questionGenerate(type.value, onsetsu.value, gaku.value)
  start.value = true
  startTimer()
}

function startTimer() {
  stopTimer()
  seconds.value = 0
  timer.value = setInterval(() => {
    seconds.value++
  }, 1e3)
}

function stopTimer() {
  clearInterval(timer.value)
  timer.value = undefined
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

function handleOnEnter() {
  correct.value = question.value?.roman.toLowerCase() == answer.value.toLowerCase()
  setAnswer(correct.value)
  if (correct.value) {
    if (selectedQuestion.value == onsetsu.value - 1) {
      stopTimer()
      results.value = {
        time: seconds.value,
        answers: answers.value
      }
      answers.value = []
      review.value = true
    } else selectedQuestion.value++
  }
  answer.value = ''
  showFeedback.value = true
  setTimeout(() => {
    showFeedback.value = false
  }, 1e3)
}

function handleClickTry() {
  start.value = false
  review.value = false
}

onMounted(() => {
  // startQuiz()
})
</script>

<template>
  <main class="h-screen flex items-center">
    <n-space class="w-full" vertical align="center" :size="16">
      <n-card class="w-96">
        <n-space v-if="!start" vertical align="center" :size="16">
          <n-radio-group v-model:value="type">
            <n-radio-button
              :class="{ 'bg-primary text-white': type == 'hiragana' }"
              value="hiragana"
            >
              HIRAGANA
            </n-radio-button>
            <n-radio-button
              :class="{ 'bg-primary text-white': type == 'katakana' }"
              value="katakana"
            >
              KATAKANA
            </n-radio-button>
          </n-radio-group>
          <div class="flex gap-4">
            <n-form-item label="Onsetsu" :show-feedback="false">
              <n-input-number class="w-full" v-model:value="onsetsu" :show-button="false" />
            </n-form-item>
            <n-form-item label="Gaku" :show-feedback="false">
              <n-input-number class="w-full" v-model:value="gaku" :show-button="false" />
            </n-form-item>
          </div>
          <n-button type="primary" @click="startQuiz">START</n-button>
        </n-space>
        <n-space v-else-if="!review" vertical :size="16" align="center">
          <div class="text-center">{{ formattedTimer(seconds) }}</div>
          <div class="text-6xl font-medium text-center">{{ question?.jp }}</div>
          <!-- <div class="text-center">{{ question?.roman }}</div> -->
          <n-input v-model:value="answer" @keydown.enter="handleOnEnter" placeholder="" />
          <div v-if="showFeedback" class="text-center">
            <n-icon size="40" :class="correct ? 'text-green-500' : 'text-red-500'">
              <i-ri-checkbox-circle-fill v-if="correct" />
              <i-ri-close-circle-fill v-else />
            </n-icon>
          </div>
        </n-space>
        <n-space v-else-if="results" vertical :size="16">
          <div class="text-center text-3xl">Result</div>
          <div class="text-center">Time: {{ formattedTimer(results.time) }}</div>

          <n-table>
            <n-thead>
              <n-tr>
                <n-th>Question</n-th>
                <n-th class="text-right">Total Attempt</n-th>
              </n-tr>
            </n-thead>
            <n-tbody>
              <n-tr v-for="answer in results.answers">
                <n-td>
                  <div class="text-xl font-medium">{{ answer.question.jp }}</div>
                  <div class="text-xs">{{ answer.question.roman }}</div>
                </n-td>
                <n-td class="text-right"> {{ answer.answers.length }}x </n-td>
              </n-tr>
            </n-tbody>
          </n-table>

          <n-space justify="center">
            <n-button type="primary" @click="handleClickTry">Try again</n-button>
          </n-space>
        </n-space>
      </n-card>
    </n-space>
  </main>
</template>
