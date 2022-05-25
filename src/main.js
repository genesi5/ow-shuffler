import { createApp } from 'vue'

import app from './App.vue'
import i18n from './i18n'

createApp(app)
  .use(i18n)
  .mount('#app')