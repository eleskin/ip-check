<template>
	<div class="AppHome">
		<div class="container AppHome__container">
			<form @submit.prevent="handleFormSubmit" class="AppHome__form">
				<textarea placeholder="Введите IP адреса"></textarea>
				<el-button type="primary" native-type="submit">Отправить</el-button>
			</form>
		</div>
	</div>
</template>

<script setup lang="ts">
const handleFormSubmit = () => {
	console.log('Click')
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