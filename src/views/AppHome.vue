<template>
  <div class="AppHome">
    <div v-if="isVisibleTextArea" class="container AppHome__container">
      <form class="AppHome__form" @submit.prevent="handleFormSubmit">
        <textarea v-model="textareaValue" placeholder="Введите IP адреса"></textarea>
        <el-button native-type="submit" type="primary">Отправить</el-button>
      </form>
    </div>
    <app-table v-if="!isVisibleTextArea" v-model="ipList" v-model:hidden="isVisibleTextArea"></app-table>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import axios from 'axios'
import AppTable from '@/components/AppTable.vue'

const isVisibleTextArea = ref(true)

const ipList = ref<string[]>([])

const textareaValue = ref('')

const handleFormSubmit = async () => {
  if (!textareaValue.value.trim()) return

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

  const getInfo = async () => {
    for (let ip of filteredIpList) {
      try {
        const response = await axios.get(`http://ip-api.com/json/${ip}`)

        ipList.value = [...ipList.value, response.data]
      } catch (error) {
        console.error('Error making request:', error)
      }
      await new Promise(resolve => setTimeout(resolve, 100));
      textareaValue.value = '';
    }
  }

  await getInfo()
  if (filteredIpList.length) isVisibleTextArea.value = false
}
</script>

<style>
.AppHome {
	padding: 80px 0 20px 0;
}

.AppHome__form {
	align-items: flex-start;
	display: flex;
	flex-direction: column;
	grid-row-gap: 20px;
}

.AppHome__form textarea {
	font-size: 16px;
	height: 112px;
	max-width: 620px;
	padding: 12px;
	resize: none;
	width: 100%;
}

.AppHome__form textarea {
	border: 1px solid #dadada;
	border-radius: 4px;
}

.AppHome__form textarea::placeholder {
	color: #8a8a8a;
}

.AppHome__form button {
	background-color: #f2f0f0;
	border: none;
	border-radius: 4px;
	color: #2c2c2c;
	font-size: 16px;
	height: auto;
	padding: 12px 20px;
	width: auto;
}

.AppHome__form button:hover {
	background-color: #f2f0f0;
	color: #2c2c2c;
}
</style>
