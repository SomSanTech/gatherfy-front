<script setup lang="ts">
import Nav from './components/Nav.vue';
</script>
<template>
  <div class="mx-auto w-full">
    <Nav class="fixed top-0 z-40 w-full" />
    <div>
      <NuxtPage />
    </div>
  </div>
</template>
