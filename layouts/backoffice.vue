<!-- layouts/backoffice.vue -->
<template>
  <div class="backoffice-layout">
    <SideBar />
    <slot />
  </div>
</template>

<script setup>
import SideBar from '~/components/backoffice/SideBar.vue';
</script>

<style scoped>
.backoffice-layout {
  display: flex;
}
</style>
