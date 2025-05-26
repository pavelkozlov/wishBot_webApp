<script setup>
import { onMounted, ref, watch } from 'vue'

const name = ref('')
const description = ref('')
const price = ref('')
const currency = ref('EUR')
const link = ref('')
const image = ref('')
const previewUrl = ref('')
const fileInput = ref(null)
const error = ref('')
const imageError = ref('')

watch(name, (value) => {
  if (value.trim()) error.value = ''
})

function setCurrency(value) {
  currency.value = value
}

function handleImageUpload(event) {
  const file = event.target.files[0]
  if (!file) return

  const maxSizeKB = 3000 * 1024 // ~3 MB
  if (file.size > maxSizeKB) {
    imageError.value = 'Файл слишком большой. До 3KB.'
    return
  }

  imageError.value = ''
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
  Telegram.WebApp.close()
}
</script>

<template>
  <div class="container">
    <h1>Новое желание</h1>

    <input v-model="name" placeholder="Название *" />
    <div v-if="error" class="error">{{ error }}</div>

    <input v-model="description" placeholder="Описание" />
    <input v-model="price" type="number" placeholder="Цена" />

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
      <span class="file-note">JPG или PNG, до 3MB</span>
      <div v-if="imageError" class="error">{{ imageError }}</div>
      <input
          ref="fileInput"
          type="file"
          accept="image/jpeg,image/png"
          @change="handleImageUpload"
          style="display: none"
      />
    </div>

    <img v-if="previewUrl" :src="previewUrl" class="preview" alt="Превью" />
  </div>
</template>

<style scoped>
.container {
  max-width: 480px;
  margin: 0 auto;
  padding: 16px;
  font-family: system-ui, sans-serif;
  font-size: 16px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 1.4rem;
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
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
  margin-bottom: 12px;
}

.currency-button {
  flex: 1;
  padding: 10px;
  text-align: center;
  margin: 0 4px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #f3f3f3;
  cursor: pointer;
  transition: 0.2s;
}

.currency-button.active {
  background: #007aff;
  color: #fff;
  font-weight: bold;
  border-color: #007aff;
}

.image-upload {
  margin-top: 12px;
  margin-bottom: 12px;
}

.upload-btn {
  display: inline-block;
  padding: 10px 16px;
  font-size: 1rem;
  background: #007aff;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.upload-btn:hover {
  background: #005bbb;
}

.file-note {
  display: block;
  margin-top: 4px;
  font-size: 0.85rem;
  color: #666;
}

.preview {
  width: 100%;
  max-height: 200px;
  object-fit: contain;
  margin-top: 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
}
</style>
