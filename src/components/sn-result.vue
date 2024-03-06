<script lang="ts" setup>
import { formattedTimer } from '~/global/helper'
import type { QuestionResults } from '~/models/question'

defineProps<{
  data?: QuestionResults
}>()

const emit = defineEmits<{
  (e: 'click:try'): void
}>()

function handleClickTry() {
  emit('click:try')
}
</script>

<template>
  <n-card class="w-96 max-w-full">
    <n-space v-if="data" vertical :size="16">
      <div class="text-center text-3xl">Result</div>
      <div class="text-center">Time: {{ formattedTimer(data.time) }}</div>

      <n-table>
        <n-thead>
          <n-tr>
            <n-th>Word</n-th>
            <n-th class="text-right">Total Attempt</n-th>
          </n-tr>
        </n-thead>
        <n-tbody>
          <n-tr v-for="answer in data.answers">
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
</template>
