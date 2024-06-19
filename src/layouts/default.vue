<template>
  <n-layout>
    <n-layout-content class="bg-gray-50">
      <router-view v-slot="{ Component, route }">
        <main class="mx-auto">
          <!-- <transition> -->
          <component :is="Component" :key="route.path" />
          <!-- </transition> -->
        </main>
      </router-view>
    </n-layout-content>
  </n-layout>
</template>
