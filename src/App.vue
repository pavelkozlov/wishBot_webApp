<script setup>
import {onMounted, ref, watch} from 'vue'

const name = ref('')
const description = ref('')
const price = ref('')
const currency = ref('EUR')
const link = ref('')
const image = ref('')
const previewUrl = ref('')
const fileInput = ref(null)

const error = ref('')

watch(name, (value) => {
  if (value.trim()) {
    error.value = ''
  }
})

function setCurrency(value) {
  currency.value = value
}

function handleImageUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()

  reader.onload = () => {
    image.value = reader.result
    previewUrl.value = reader.result
  }

  reader.readAsDataURL(file)
}


onMounted(() => {
  if (window.Telegram?.WebApp) {
    Telegram.WebApp.ready()
    Telegram.WebApp.MainButton.setText("Отправить")
    Telegram.WebApp.MainButton.onClick(sendToTelegram)
    Telegram.WebApp.MainButton.show()
  }
})

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
    image: image.value,
  }

  Telegram.WebApp.sendData(JSON.stringify(message))
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

    <input v-model="link" placeholder="Ссылка (необязательно)" />

    <div class="image-upload">
      <button class="upload-btn" @click="$refs.fileInput.click()">Загрузить изображение</button>
      <span class="file-note">Только JPG или PNG</span>
      <input
          ref="fileInput"
          type="file"
          @change="handleImageUpload"
          accept="image/jpeg,image/png"
          style="display: none"
      />
    </div>

    <img v-if="previewUrl" :src="previewUrl" alt="Превью" class="preview" />
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

.image-upload {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.upload-btn {
  padding: 0.5rem 1rem;
  background: #007aff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 0.3rem;
}

.upload-btn:hover {
  background: #005bbb;
}

.file-note {
  font-size: 0.85rem;
  color: #666;
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
