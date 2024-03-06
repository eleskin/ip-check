<template>
  <div class="App">
    <app-header></app-header>
    <router-view></router-view>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/components/AppHeader.vue';

// defineComponent({
//   components: {
//     AppHeader,
//   }
// });
</script>

<style>
  .App {
    display: grid;
    grid-template-rows: auto 1fr;
    height: 100vh;
    width: 100%;
  }
</style>