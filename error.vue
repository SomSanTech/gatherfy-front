<script setup lang="ts">
const route = useRoute();
const router = useRouter();
console.log('Route  to:', route.fullPath);

const error = useError();
const pathUrl = computed(() => route.fullPath);

const goBack = () => {
  if (pathUrl.value.includes('backoffice')) {
    router.push('/backoffice');
  } else {
    router.push('/');
  }
};
</script>

<template>
  <NuxtLayout>
    <div
      :class="`${pathUrl.includes('backoffice') ? 'ml-96' : ''} flex h-screen items-center justify-center`"
    >
      <div class="space-y-3">
        <h1 class="text-[200px] font-bold">So Sorry!</h1>
        <p class="error-text pl-4 text-3xl">
          The page you are looking for cannot be found
        </p>
        <p class="pl-4 text-3xl">Go home bitch</p>
        <button
          @click="goBack"
          class="my-6 ml-4 rounded-md bg-burgundy px-4 py-1 text-xl text-white"
        >
          BACK TO HOME
        </button>
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped></style>
