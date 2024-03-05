<script setup lang="ts">
import type { Question, QuestionChar } from '@/models/question'

useTitle(title('Play'))

const questions = ref<Question[]>()
const selectedQuestion = ref(0)
const answer = ref('')
const correct = ref(false)
const showFeedback = ref(false)
const type = ref<QuestionChar['type']>('hiragana')
const start = ref(false)
const onsetsu = ref(10)
const gaku = ref(3)

const question = computed(() =>
  questions.value ? questions.value[selectedQuestion.value] : undefined
)

function generateQuestion() {
  selectedQuestion.value = 0
  questions.value = questionGenerate(type.value, onsetsu.value, gaku.value)
  start.value = true
}

function handleOnEnter() {
  correct.value = question.value?.roman.toLowerCase() == answer.value.toLowerCase()
  if (correct.value) {
    if (selectedQuestion.value == 9) {
      start.value = false
    } else selectedQuestion.value++
  }
  answer.value = ''
  showFeedback.value = true
  setTimeout(() => {
    showFeedback.value = false
  }, 1e3)
}
</script>

<template>
  <main class="h-screen flex items-center">
    <n-space class="w-full" vertical align="center" :size="16">
      <n-card class="w-96">
        <div v-if="!start" class="flex flex-col gap-4" align="center" :size="16">
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
          <n-button type="primary" @click="generateQuestion">START</n-button>
        </div>
        <n-space v-else vertical :size="16" align="center">
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
      </n-card>
    </n-space>
  </main>
</template>
