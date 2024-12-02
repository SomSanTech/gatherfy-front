<script setup lang="ts">
const route = useRoute();
const router = useRouter();

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
        <p class="error-text pb-4 pl-4 font-['Poppins'] text-2xl">
          The page you are looking for cannot be found
        </p>
        <button
          @click="goBack"
          class="ml-4 mt-10 animate-bounce rounded-md bg-burgundy px-4 py-1 font-['Poppins'] text-xl text-white"
        >
          BACK TO HOME
        </button>
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped></style>
