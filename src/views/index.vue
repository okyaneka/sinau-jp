<script setup lang="ts">
useTitle(title('Play'))

onMounted(() => {
  // startQuiz()
})
</script>

<template>
  <section class="p-2">
    <n-space class="w-full" vertical align="center" :size="16">
      <sn-play />
    </n-space>
  </section>
</template>
