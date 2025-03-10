<!-- layouts/backoffice.vue -->
<template>
  <div class="mx-auto my-28 flex w-screen max-w-6xl gap-9">
    <ProfileSidebar />
    <slot />
  </div>
</template>

<script setup>
const route = useRoute();
const error = useError();

const isErrorPage = computed(() => {
  return error.value !== null || route.path.includes('error');
});
</script>

<style scoped></style>
