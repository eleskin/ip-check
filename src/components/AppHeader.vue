<template>
  <header class="AppHeader">
    <div class="container AppHeader__container">
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
      <ul class="AppHeader__menu">
        <li class="AppHeader__item">
          <router-link to="">Documentation</router-link>
        </li>
        <li class="AppHeader__item">
          <router-link to="">Contacts</router-link>
        </li>
        <li class="AppHeader__item AppHeader__item--bold">
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
    padding: 24px 0;
    background-color: #f2f0f0;
  }
  
  .AppHeader__container {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .AppHeader__logo a {
    font-weight: 600;
    font-size: 24px;
    color: #0e2e3b;
    text-decoration: none;
  }

  .AppHeader__menu {
    display: flex;
    font-display: row;
    justify-content: flex-end;
    align-items: center;
    padding: 0;
    margin: 0;
    list-style: none;
    grid-column-gap: 32px;
  }

.AppHeader__item a {
  color: #494949;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
}

.AppHeader__item--bold a {
  color: #0E2E3B;
  font-weight: 600;
}
</style>