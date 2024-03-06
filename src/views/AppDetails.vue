<template>
  <div class="AppDetails">
    <div class="container AppDetails__container">
       <div v-for="(detail, index) of details" :key="index">
        <el-card style="max-width: 480px">
          <template #header>
            <div class="card-header">
              <span>{{ detail[0].charAt(0).toUpperCase() + detail[0].slice(1) }}</span>
            </div>
          </template>
          <p>{{ detail[1] }}</p>
        </el-card>
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
.AppDetails {
  padding: 80px 0 20px 0;
}

.AppDetails__container {
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(4, 1fr);
}

.AppDetails__container {

}
</style>