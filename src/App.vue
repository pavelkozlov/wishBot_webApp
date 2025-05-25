<script setup>
import { ref } from 'vue'

const inputValue = ref('')

function sendToTelegram() {
  const data = { data: inputValue.value }
  console.log('Отправка:', data)

  if (window.Telegram && Telegram.WebApp) {
    Telegram.WebApp.sendData(JSON.stringify(data))
  } else {
    console.warn('Telegram API недоступен')
  }
}
</script>

<template>
  <h1>Привет</h1>
  <input type="text" v-model="inputValue" placeholder="Введите текст" />
  <button @click="sendToTelegram">Отправить</button>
</template>

<style scoped>
input {
  padding: 0.5rem;
  margin-right: 0.5rem;
}
button {
  padding: 0.5rem 1rem;
  background: #007aff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
