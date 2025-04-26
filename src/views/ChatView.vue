<template>
    <div class="chat-page">
      <!-- Chat ekranı yatay 2 sütun: sol kullanıcılar, sağ mesajlar -->
      <div class="chat-content">
  
        <!-- Kullanıcılar (Solda) -->
        <div class="users-list">
          <h3>
            Katılımcılar
            <span class="online-count">🟢 {{ onlineCount }} Online</span>
          </h3>
          <ul>
            <li v-for="user in users" :key="user.id">
              {{ user.username }}
              <span v-if="isOnline(user)" class="online">(Online)</span>
              <span v-else class="offline">(Offline)</span>
            </li>
          </ul>
        </div>
  
        <!-- Mesajlar (Sağda) -->
        <div class="chat-messages">
          <div
            v-for="message in messages"
            :key="message.id"
            class="chat-message"
          >
            <strong>{{ message.username }}:</strong> {{ message.text }}
          </div>
        </div>
      </div>
  
      <!-- Mesaj yazma + çıkış -->
      <div class="chat-input">
        <input v-model="newMessage" placeholder="Mesaj yaz..." @keyup.enter="sendMessage" />
        <button @click="sendMessage">Gönder</button>
        <button @click="logout" class="logout-btn">Çıkış Yap</button>
      </div>
    </div>
  </template>
  
  <script setup>
  
  import { ref, onMounted, computed } from 'vue'
  import axios from 'axios'
  import { useRouter } from 'vue-router'
  
  const API = 'http://localhost:3000'
  
  const messages = ref([])
  const users = ref([])
  const newMessage = ref('')
  const router = useRouter()
  
  const username = localStorage.getItem('username')
  const user_id = localStorage.getItem('user_id')
  
  // ONLINE SAYISI
  const onlineCount = computed(() => {
    return users.value.filter(user => isOnline(user)).length
  })
  
  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API}/messages`)
      messages.value = res.data
    } catch (err) {
      console.error('Mesajlar alınamadı:', err)
    }
  }
  
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/users`)
      users.value = res.data
    } catch (err) {
      console.error('Kullanıcılar alınamadı:', err)
    }
  }
  
  const sendMessage = async () => {
    if (!newMessage.value.trim()) return
    try {
      await axios.post(`${API}/messages`, {
        user_id,
        text: newMessage.value
      })
      newMessage.value = ''
      fetchMessages()
    } catch (err) {
      console.error('Mesaj gönderilemedi:', err)
    }
  }
  
  onMounted(() => {
    fetchMessages()
    fetchUsers()
    markOnline()
  
    setInterval(() => {
      fetchMessages()
      fetchUsers()
    }, 3000)
  })
  
  const isOnline = (user) => {
    if (!user.last_active) return false
    const lastActive = new Date(user.last_active)
    const now = new Date()
    const diff = (now - lastActive) / 1000
    return diff < 300 // 5 dakika
  }
  
  const markOnline = async () => {
    try {
      await axios.post(`${API}/online`, { user_id })
    } catch (err) {
      console.error('Online güncellenemedi:', err)
    }
  }
  
  const markOffline = async () => {
    try {
      await axios.post(`${API}/offline`, { user_id })
    } catch (err) {
      console.error('Offline güncellenemedi:', err)
    }
  }
  
  const logout = async () => {
    await markOffline()
    localStorage.removeItem('user_id')
    localStorage.removeItem('username')
    router.push('/')
  }
  </script>
  
  <style scoped>
  .chat-page {
    max-width: 900px;
    margin: 30px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
  }
  
  .chat-content {
    display: flex;
    gap: 20px;
  }
  
  .users-list {
    flex: 1;
    border: 1px solid #aaa;
    padding: 10px;
    border-radius: 5px;
    max-height: 400px;
    overflow-y: auto;
  }
  
  .users-list ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .users-list li {
    margin-bottom: 8px;
  }
  
  .online {
    color: green;
    font-weight: bold;
    margin-left: 8px;
  }
  
  .offline {
    color: red;
    font-weight: bold;
    margin-left: 8px;
  }
  
  .online-count {
    float: right;
    font-size: 0.9rem;
    color: green;
  }
  
  .chat-messages {
    flex: 2;
    height: 400px;
    overflow-y: auto;
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
  }
  
  .chat-message {
    margin-bottom: 10px;
  }
  
  .chat-input {
    margin-top: 20px;
    display: flex;
    gap: 10px;
  }
  
  .chat-input input {
    flex: 1;
    padding: 8px;
  }
  
  .chat-input button {
    padding: 8px 12px;
  }
  </style>
  