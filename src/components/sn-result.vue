<script lang="ts" setup>
import { formattedTimer } from '~/global/helper'
import type { QuestionResults } from '~/models/question'

defineProps<{
  data?: QuestionResults
}>()

const emit = defineEmits<{
  (e: 'click:try'): void
}>()

const show = ref<boolean[]>([])

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
          <n-tr v-for="(answer, index) in data.answers">
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
        <n-button type="primary" @click="handleClickTry">Try again</n-button>
      </n-space>
    </n-space>
  </n-card>
</template>
