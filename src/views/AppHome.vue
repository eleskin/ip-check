<template>
	<div class="AppHome">
		<div class="container AppHome__container">
			<form @submit.prevent="handleFormSubmit" class="AppHome__form">
				<textarea v-model="textareaValue" placeholder="Введите IP адреса"></textarea>
				<el-button type="primary" native-type="submit">Отправить</el-button>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const textareaValue = ref('');

const handleFormSubmit = async () => {
	const ipList = textareaValue.value.split('\n');
	
	const result = await axios.all(ipList.map((ip) => axios.get(`http://ip-api.com/json/${ip}`)));

	console.log(result);
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