<script setup lang="ts"></script>

<template>
  <NuxtLayout>
    <div class="flex h-screen items-center justify-center">
      <div class="space-y-3">
        <h1 class="text-[200px] font-bold">So Sorry!</h1>
        <p class="error-text pl-4 text-3xl">
          The page you are looking for cannot be found
        </p>
        <p class="pl-4 text-3xl">Go home bitch</p>
        <NuxtLink to="/">
          <button
            class="my-6 ml-4 rounded-md bg-burgundy px-4 py-1 text-xl text-white"
          >
            BACK TO HOME
          </button>
        </NuxtLink>
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped></style>
