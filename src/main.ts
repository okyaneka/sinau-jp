import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { registerSW } from 'virtual:pwa-register'

import './style.css'

import App from './App.vue'
import router from './router'
import naive from 'naive-ui'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(naive)

app.mount('#app')

const updateSW = registerSW({
  onNeedRefresh() {
    console.log('need refresh')
  },
  onOfflineReady() {}
})
