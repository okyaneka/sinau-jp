<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

withDefaults(
  defineProps<{
    to: RouteLocationRaw
    title: string
  }>(),
  { title: '' }
)
</script>

<template>
  <n-card class="fixed top-0 z-50" content-class="px-4 h-14 py-0 flex-none flex items-center">
    <RouterLink :to="to" class="absolute">
      <n-button circle :bordered="false">
        <template #icon>
          <i-ri-arrow-left-line />
        </template>
      </n-button>
    </RouterLink>
    <div class="flex-1 text-center font-semibold">{{ title }}</div>
  </n-card>
  <div class="mb-16"></div>
</template>
