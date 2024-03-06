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
import AppTable from '@/components/AppTable.vue';

const isVisibleTextArea = ref(true);

const ipList = ref([]);

const textareaValue = ref('');

const handleFormSubmit = async () => {
	const filteredIpList = textareaValue.value.split('\n').filter((ip) => {
		if (!/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/.test(ip)) {
			alert(`Некорректный IP: ${ip}`);
			return;
		}

		return ip;
	});
	
	const result = await axios.all(filteredIpList.map((ip) => axios.get(`http://ip-api.com/json/${ip}`)));

	ipList.value = result;

	isVisibleTextArea.value = false;
};
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
	}
</style>