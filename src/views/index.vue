<script setup lang="ts">
import type { Question, QuestionAnswer, QuestionChar, QuestionResults } from '~/models/question'

useTitle(title('Play'))

const results = ref<QuestionResults>()
const showReview = ref(false)

function handleClickTry() {
  showReview.value = false
}

function handleFinish(e: QuestionResults) {
  console.log(results)
  results.value = e
  showReview.value = true
}

function handleAbort() {}

onMounted(() => {
  // startQuiz()
})
</script>

<template>
  <section class="p-2">
    <n-space class="w-full" vertical align="center" :size="16">
      <sn-result v-if="showReview" :data="results" @click:try="handleClickTry" />
      <sn-play v-else @finish="handleFinish" @abort="handleAbort" />
    </n-space>
  </section>
</template>
