<script setup lang="ts">
import Nav from './components/Nav.vue';

const loginPopup = useLoginPopup();
const route = useRoute();
const role = useRole();
const isBackoffice = ref(route.fullPath.includes('backoffice'));
const isSignUpPage = ref(route.fullPath.includes('signup'));
const isSessionTimeOuts = useState('isSessionTimeOut');
const handleSessionExpire = useAuth().handleSessionExpire;
</script>
<template>
  <div class="relative mx-auto w-full">
    <div
      :class="loginPopup ? 'absolute top-0 z-50 h-full w-full bg-black/20' : ''"
    ></div>
    <Nav
      v-if="!isBackoffice && !isSignUpPage && role !== 'Organization'"
      class="fixed top-0 z-40 w-full"
    />
    <Login />
    <div
      class="absolute right-1/2 top-0 z-40 rounded-lg bg-white p-5"
      v-if="isSessionTimeOuts"
    >
      <p>Session expired pls sign in mai ja</p>
      <button @click="handleSessionExpire">OK</button>
    </div>
    <div>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
</template>
