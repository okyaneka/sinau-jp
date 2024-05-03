<script setup lang="ts">
import type { GlobalThemeOverrides } from 'naive-ui'

const themeOverrides = computed<GlobalThemeOverrides>(() => ({
  common: {
    primaryColor: '#595ea6',
    primaryColorHover: '#6A6EAF',
    primaryColorPressed: '#6A6EAF',
    primaryColorSuppl: '#595ea6',

    fontFamily: '"Inter", sans-serif',
    fontFamilyMono: '"Nanum Gothic Coding", monospace',
    fontSizeHuge: '2rem',
    fontSizeLarge: '1.5rem',
    fontSizeMedium: '1rem',
    fontSizeMini: '.875rem',
    fontSizeSmall: '.625rem',
    fontSizeTiny: '.5rem',
    fontSize: '16px'
  },
  Space: {
    gapMedium: '16px',
    gapSmall: '8px',
    gapLarge: '24px'
  },
  Typography: {
    headerFontSize1: '2rem',
    headerFontSize2: '1.75rem',
    headerFontSize3: '1.5rem',
    headerFontSize4: '1.25rem',
    headerFontSize5: '1.125rem',
    headerFontSize6: '1rem',
    liFontSize: '1rem'
  }
}))
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-global-style />
    <router-view v-slot="{ Component, route }">
      <transition>
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
    <div class="text-center">
      <a href="https://github.com/okyaneka/sinau-jp" target="_blank">
        <n-button size="small" color="#24292e">
          View on Github
          <template #icon>
            <n-icon><i-ri-github-fill /></n-icon>
          </template>
        </n-button>
      </a>
    </div>
    <div></div>
  </n-config-provider>
</template>

<style lang="postcss">
body {
  @apply bg-gray-50 !important;
}

a {
  @apply text-primary no-underline;
}

a:hover {
  @apply underline;
}

ul {
  @apply list-disc list-outside;
}
</style>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Nanum+Gothic+Coding:wght@400;700&display=swap');
</style>
