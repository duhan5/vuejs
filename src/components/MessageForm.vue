<!-- src/components/MessageForm.vue -->
<template>
    <form @submit.prevent="send">
      <input v-model="newMessage" placeholder="Mesaj yaz..." />
      <button type="submit">Gönder</button>
    </form>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import axios from '../axios'

  
  const emit = defineEmits(['send-message'])
  const newMessage = ref('')
  
  function send() {
    if (newMessage.value.trim() !== '') {
      emit('send-message', newMessage.value)
      newMessage.value = ''
    }
  }
  </script>
  
  <style scoped>
  form {
    display: flex;
    gap: 10px;
  }
  input {
    flex: 1;
    padding: 8px;
  }
  </style>
  