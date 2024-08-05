<script setup lang="ts">
import type { Question, QuestionAnswers, QuestionChar, QuestionResults } from '~/models/question'
import data from '~/data/chars.json'

const type = ref<QuestionChar['type']>('hiragana')

const chars = computed(() => {
  const q = questionChars.filter((v) => v.type == type.value).slice(0, -4)
  const p: (QuestionChar | null)[][] = []
  const row = 5
  while (q.length) {
    const start = 0
    if (q[start].roman == 'YA' || q[start].roman == 'WA')
      p.push([q.splice(start, 1)[0], null, q.splice(start, 1)[0], null, q.splice(start, 1)[0]])
    else p.push(q.splice(start, row))
  }
  return p
})
const p = ref(['K', 'S', 'T', 'N', 'H', 'M', 'Y', 'R', 'W', 'N'])
</script>

<template>
  <sj-top-nav-back to="/" title="GUIDE" />

  <section class="p-2">
    <n-space class="w-full" vertical align="center">
      <n-card class="w-96 max-w-full">
        <n-space class="mb-4" justify="center">
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
        </n-space>

        <n-table :single-line="false" class="text-center">
          <!-- <n-table single-column single-line bordered class="w-full text-center"> -->
          <tbody>
            <tr v-for="group in chars">
              <td class="cursor-pointer hover:bg-primary hover:bg-opacity-5" v-for="i in group">
                <template v-if="i != null">
                  <div class="text-xl font-semibold">{{ i.jp }}</div>
                  <div class="text-sm">{{ i.roman }}</div>
                </template>
              </td>
            </tr>
          </tbody>
        </n-table>
      </n-card>
    </n-space>
  </section>
</template>
