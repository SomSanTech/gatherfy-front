<!-- layouts/backoffice.vue -->
<template>
  <div class="backoffice-layout">
    <SideBar />
    <slot />
  </div>
</template>

<script setup>
import SideBar from '~/components/backoffice/SideBar.vue';

const route = useRoute();
const error = useError();

const isErrorPage = computed(() => {
  return error.value !== null || route.path.includes('error');
});
</script>

<style scoped>
.backoffice-layout {
  display: flex;
}
</style>
