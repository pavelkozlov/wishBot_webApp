<script setup>
import { ref, watch } from 'vue'

const name = ref('')
const description = ref('')
const price = ref('')
const currency = ref('EUR')
const link = ref('')
const error = ref('')

// Убираем ошибку при вводе в поле "Название"
watch(name, (value) => {
  if (value.trim()) {
    error.value = ''
  }
})

function setCurrency(value) {
  currency.value = value
}

function sendToTelegram() {
  if (!name.value.trim()) {
    error.value = 'Название обязательно'
    return
  }

  const message = {
    name: name.value.trim(),
    description: description.value.trim(),
    price: parseInt(price.value, 10) || 0,
    currency: currency.value,
    link: link.value.trim(),
  }

  console.log('Отправка:', message)

  if (window.Telegram && Telegram.WebApp) {
    Telegram.WebApp.ready()
    Telegram.WebApp.sendData(JSON.stringify(message))
    Telegram.WebApp.close() // Закрываем WebApp после отправки
  } else {
    console.warn('Telegram API недоступен')
  }
}
</script>

<template>
  <div class="container">
    <h1>Новое желание</h1>

    <input v-model="name" placeholder="Название *" />
    <div v-if="error" class="error">{{ error }}</div>

    <input v-model="description" placeholder="Описание" />
    <input v-model="price" placeholder="Цена" type="number" />

    <div class="currency-selector">
      <span
          v-for="curr in ['EUR', 'USD', 'RUB']"
          :key="curr"
          :class="['currency-button', { active: currency === curr }]"
          @click="setCurrency(curr)"
      >
        {{ curr }}
      </span>
    </div>

    <input v-model="link" placeholder="Ссылка" />

    <button @click="sendToTelegram">Сохранить</button>
  </div>
</template>

<style scoped>
.container {
  max-width: 500px;
  margin: 0 auto;
  padding: 1rem;
  font-family: system-ui, sans-serif;
}

h1 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
}

input {
  width: 100%;
  margin-bottom: 0.75rem;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-sizing: border-box;
}

.error {
  color: red;
  font-size: 0.9rem;
  margin: -0.5rem 0 0.75rem;
}

.currency-selector {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.currency-button {
  flex: 1;
  text-align: center;
  margin: 0 0.25rem;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #f0f0f0;
  cursor: pointer;
  user-select: none;
}

.currency-button.active {
  background: #007aff;
  color: white;
  font-weight: bold;
  border-color: #007aff;
}

button {
  width: 100%;
  padding: 0.75rem;
  background: #007aff;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
}

button:hover {
  background: #005bbb;
}
</style>
