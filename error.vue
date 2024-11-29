<script setup lang="ts"></script>

<template>
  <NuxtLayout>
    <div class="flex h-screen items-center justify-center">
      <div class="space-y-3">
        <h1 class="text-[200px] font-semibold">F*ck U</h1>
        <p class="pl-4 text-3xl">It looks like something broke.</p>
        <p class="pl-4 text-3xl">Go home bitch</p>
        <NuxtLink to="/">
          <button
            class="my-6 ml-4 rounded-md bg-burgundy px-4 py-1 text-xl text-white"
          >
            Home
          </button>
        </NuxtLink>
      </div>
      <img src="/public/404.jpg" alt="" />
    </div>
  </NuxtLayout>
</template>

<style scoped></style>
