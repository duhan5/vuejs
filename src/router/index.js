import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ChatView from '../views/ChatView.vue' // 👈 Chat ekranını da import et

// import Login from '../views/Login.vue' ← artık gerek yok

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/chat', name: 'Chat', component: ChatView }, // 👈 Chat route'u ekledik


  // { path: '/login', name: 'Login', component: Login }, ← bunu kaldırdık
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const user = localStorage.getItem('user_id')

  // Eğer kullanıcı yoksa ve /chat sayfasına gitmeye çalışıyorsa ➔ anasayfaya gönder
  if (to.path === '/chat' && !user) {
    return next('/')
  }

  next() // Her şey doğruysa devam et
})

export default router
