<!-- src/components/MessageItem.vue -->
<template>
    <div class="message">
      <strong>{{ message.username }}:</strong> {{ message.text }}
    </div>
  </template>
  
  <script setup>
  import axios from '../axios'

  defineProps({
    message: {
      type: Object,
      required: true
    }
  })
  </script>
  
  <style scoped>
  .message {
    margin-bottom: 8px;
  }
  </style>
  