<!-- layouts/backoffice.vue -->
<template>
  <div class="backoffice-layout">
    <SideBar />
    <!-- Sidebar component for backoffice -->
    <slot />
    <!-- Renders content of each backoffice page -->
  </div>
</template>

<script setup>
import SideBar from '~/components/SideBar.vue';
</script>

<style scoped>
.backoffice-layout {
  display: flex;
}
</style>
