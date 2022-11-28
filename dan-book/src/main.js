import { createApp } from 'vue'
import App from './App.vue'
import { router } from '@/router'
import { setupStore } from '@/store'

import 'amfe-flexible'
import 'normalize.css'
import '@/assets/css/global.scss'

const app = createApp(App)
app.use(router)
setupStore(app)

app.mount('#app')
