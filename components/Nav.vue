<script setup lang="ts">
import SearchIcon from './icons/SearchIcon.vue';

const router = useRouter();
const searchKw = ref('');
const handleSearch = () => {
  router.push({ path: '/search', query: { k: searchKw.value } });
};
</script>

<template>
  <div
    class="mx-auto flex w-screen max-w-6xl items-center justify-between bg-white/20 py-6 backdrop-blur-sm"
  >
    <NuxtLink to="/">
      <button class="nanum text-3xl">Gatherfy</button>
    </NuxtLink>

    <div class="flex gap-5">
      <div class="flex rounded-2xl border px-4 py-2">
        <input
          type="text"
          name=""
          id=""
          placeholder="search.."
          v-model="searchKw"
          class="bg-white/0"
          @keyup.enter="handleSearch"
        />
        <button @click="handleSearch()">
          <SearchIcon class="h-3 w-3 text-black" />
        </button>
      </div>
      <button class="rounded-xl bg-black px-4 py-2 text-white">Sign Up</button>
    </div>
  </div>
</template>
