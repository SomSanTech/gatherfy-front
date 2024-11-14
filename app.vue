<script setup lang="ts">
import Nav from './components/Nav.vue';

const route = useRoute();
const isBackoffice = ref(route.fullPath.includes('backoffice'));
</script>
<template>
  <div class="mx-auto w-full">
    <Nav v-if="!isBackoffice" class="fixed top-0 z-40 w-full" />
    <div>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
</template>
