<template>
  <n-space class="h-screen" vertical justify="center" align="center">
    <n-result status="error" title="404 Not Found" description="Halaman tidak ditemukan" />
    <router-link to="/">
      <n-button type="primary">
        HOME
        <template #icon>
          <n-icon><i-ri-home-4-fill /></n-icon>
        </template>
      </n-button>
    </router-link>
  </n-space>
</template>
