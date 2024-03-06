<template>
  <header class="AppHeader">
    <div class="AppHeader__logo">
      <router-link to="/">IP-PN.COM</router-link>
    </div>
    <div class="AppHeader__search">
      <el-input
        v-model="searchValue"
        style="width: 240px"
        placeholder="Type something"
        :prefix-icon="Search"
      />
    </div>
    <div class="AppHeader__menu">
      <ul>
        <li>
          <router-link to="">Documentation</router-link>
        </li>
        <li>
          <router-link to="">Contacts</router-link>
        </li>
        <li>
          <router-link to="">Log in</router-link>
        </li>
      </ul>
    </div> 
  </header>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';
import { ref } from 'vue'

const searchValue = ref('');
</script>

<style>
  .AppHeader {
    width: 100%;
  }
</style>