<script setup lang="ts">
import Nav from './components/Nav.vue';

const route = useRoute();
const isBackoffice = ref(route.fullPath.includes('backoffice'));
const isSignUpPage = ref(route.fullPath.includes('signup'));
</script>
<template>
  <div class="relative mx-auto w-full">
    <Nav
      v-if="!isBackoffice && !isSignUpPage"
      class="fixed top-0 z-40 w-full"
    />
    <Login />
    <div>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
</template>
