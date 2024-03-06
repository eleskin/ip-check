<template>
  <header class="AppHeader">
    <div class="container AppHeader__container">
      <div class="AppHeader__logo">
        <router-link to="/">IP-PN.COM</router-link>
      </div>
      <div class="AppHeader__search">
        <el-dropdown ref="dropdown1" trigger="contextmenu">
          <el-input
            v-model="searchValue"
            style="width: 240px"
            placeholder="Type something"
            :prefix-icon="Search"
            @focus="handleFocusSearch"
          />
          <template #dropdown>
            <el-dropdown-menu style="width: 300px">
              <el-dropdown-item><router-link :to="`/${suggestedIp}`">{{ suggestedIp }}</router-link></el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
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
import { ref, watch } from 'vue'
import axios from 'axios';
import debounce from '@/utils/debounce';

const searchValue = ref('');
const dropdown1 = ref();

const showClick = () => {
  if (!dropdown1.value) return
  dropdown1.value.handleOpen()
}

const suggestedIp = ref('');

const handleFocusSearch = () => {
  if (!/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/.test(searchValue.value)) {
    return;
  }

  showClick();
};

watch(
  () => searchValue.value,
  (value) => {
    if (!/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/.test(value)) {
      return;
    }

    const debouncedHandle = debounce(async () => {
      const result = await axios.get(`http://ip-api.com/json/${value}`);

      suggestedIp.value = value;
      showClick()
      console.log(result.data.query);
    }, 1000);

    debouncedHandle()
  }
)
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