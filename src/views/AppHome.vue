<template>
  <div class="AppHome">
    <div class="container AppHome__container" v-if="isVisibleTextArea">
      <form @submit.prevent="handleFormSubmit" class="AppHome__form">
        <textarea v-model="textareaValue" placeholder="Введите IP адреса"></textarea>
        <el-button type="primary" native-type="submit">Отправить</el-button>
      </form>
    </div>
    <app-table v-if="!isVisibleTextArea" v-model="ipList"></app-table>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import AppTable from '@/components/AppTable.vue'
import { ConcurrencyManager } from 'axios-concurrency'

const api = axios.create({
  baseURL: 'http://ip-api.com'
})

const MAX_CONCURRENT_REQUESTS = 10

const manager = ConcurrencyManager(api, MAX_CONCURRENT_REQUESTS)

const isVisibleTextArea = ref(true)

const ipList = ref([])

const textareaValue = ref('')

const handleFormSubmit = async () => {
  if (!textareaValue.value.trim()) return
  console.log(textareaValue.value.trim())

  const filteredIpList = textareaValue.value
    .trim()
    .split('\n')
    .filter((ip) => {
      if (!/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/.test(ip)) {
        alert(`Некорректный IP: ${ip}`)
        return
      }

      return ip
    })

  let timeout = 0
  const getInfo = () => {
    Promise.all(filteredIpList.map((ip) => api.get(`/json/${ip}`)))
      .then((responses) => {
        ipList.value = responses.map((item) => item.data)
      })
      .catch((error) => {
        if (error.response.status === 429) {
          timeout += 10000
          setTimeout(getInfo, timeout)
        }
      })
  }

  getInfo()
  if (filteredIpList.length) isVisibleTextArea.value = false
}
</script>

<style>
.AppHome {
  padding: 80px 0 20px 0;
}

.AppHome__form {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  grid-row-gap: 20px;
}

.AppHome__form textarea {
  max-width: 620px;
  width: 100%;
  height: 112px;
  resize: none;
  padding: 12px;
  font-size: 16px;
}

.AppHome__form textarea {
  border-radius: 4px;
  border: 1px solid #dadada;
}

.AppHome__form textarea::placeholder {
  color: #8a8a8a;
}

.AppHome__form button {
  background-color: #f2f0f0;
  color: #2c2c2c;
  font-size: 16px;
  padding: 12px 20px;
  height: auto;
  width: auto;
  border: none;
  border-radius: 4px;
}

.AppHome__form button:hover {
  background-color: #f2f0f0;
  color: #2c2c2c;
}
</style>
