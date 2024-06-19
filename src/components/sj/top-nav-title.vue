<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import { config } from '~/global/config'

defineProps<{
  to: RouteLocationRaw
}>()
</script>

<template>
  <n-card class="fixed top-0 z-50" content-class="px-4 h-14 py-0 flex-none flex items-center">
    <div class="flex-1 text-center font-semibold">{{ config.title }}</div>
  </n-card>
  <div class="mb-15"></div>
</template>
