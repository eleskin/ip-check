<template>
  <header class="AppHeader">
    <div class="container AppHeader__container">
      <div class="AppHeader__logo">
        <router-link to="/">IP-PN.COM</router-link>
      </div>
      <div class="AppHeader__search">
        <el-dropdown ref="dropdown1">
          <el-input
            v-model="searchValue"
            placeholder="Type something"
            :prefix-icon="Search"
            @focus="handleFocusSearch"
          />
          <template #dropdown v-if="isValidIp">
            <el-dropdown-menu style="width: 300px">
              <el-dropdown-item
                ><router-link :to="`/${suggestedIp}`">{{
                  suggestedIp
                }}</router-link></el-dropdown-item
              >
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
import { Search } from '@element-plus/icons-vue'
import { ref, watch } from 'vue'
import axios from 'axios'
import debounce from '@/utils/debounce'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const searchValue = ref<string>(String(route.query.ip ?? ''))
const dropdown1 = ref()
const isValidIp = ref(false)

const showClick = () => {
  if (!dropdown1.value) return
  dropdown1.value.handleOpen()
}

const suggestedIp = ref('')

const handleFocusSearch = () => {
  if (!/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/.test(searchValue.value)) {
    return
  }

  showClick()
}

watch(
  () => route.query.ip,
  (value) => (searchValue.value = String(value ?? ''))
)

watch(
  () => searchValue.value,
  (value: string) => {
    if (!/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/.test(value)) {
      isValidIp.value = false
      return
    }

    const path = route.fullPath.split('?')[0]

    router.push(`${path}?ip=${value}`)

    const debouncedHandle = debounce(async () => {
      const result = await axios.get(`http://ip-api.com/json/${value}`)

      suggestedIp.value = value
      console.log(result.data.query)

      isValidIp.value = true
      showClick()
    }, 1000)

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
  flex-direction: row;
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
  color: #0e2e3b;
  font-weight: 600;
}

.AppHeader__search input {
  width: 460px;
  font-size: 16px;
  padding: 12px 0;
  height: auto;
}

.AppHeader__search span::before {
  opacity: 0;
}
</style>
