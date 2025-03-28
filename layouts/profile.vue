<script setup>
const route = useRoute();
const error = useError();
const isLoading = useState('isLoading', () => true);
const isErrorPage = computed(() => {
  return error.value !== null || route.path.includes('error');
});
</script>
<template>
  <div
    :class="!isLoading ? 'my-28' : ''"
    class="mx-auto flex w-screen max-w-6xl gap-9"
  >
    <ProfileSidebar v-if="!isLoading" />
    <slot />
  </div>
</template>

<style scoped></style>
