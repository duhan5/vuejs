import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Router'ı import ettik

createApp(App).use(router).mount('#app') // Router'ı projeye tanımladık
