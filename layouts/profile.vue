<script setup>
const route = useRoute();
const error = useError();
const isLoading = useState('isLoading');
const isErrorPage = computed(() => {
  return error.value !== null || route.path.includes('error');
});
</script>
<template>
  <div
    :class="!isLoading ? 'my-28' : ''"
    class="mx-auto flex w-screen gap-9 lg:max-w-6xl"
  >
    <ProfileSidebar v-if="!isLoading" />
    <slot />
  </div>
</template>

<style scoped></style>
