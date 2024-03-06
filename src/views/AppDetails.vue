<template>
  <div class="AppDetails">
    <div class="container AppDetails__container">
       <div v-for="(detail, index) of details" :key="index">
        {{ detail[0] }}: {{ detail[1] }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios';

const router = useRouter();
const route = useRoute();

const details = ref<[string, string][]>([]);

if (!/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/.test(String(route.params.query))) {
  router.push('/');
} else {
  axios.get(`http://ip-api.com/json/${String(route.params.query)}`)
  .then((response) => details.value = Object.entries(response.data));
}
</script>

<style>
</style>