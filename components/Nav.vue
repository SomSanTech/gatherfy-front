<script setup lang="ts">
import SearchIcon from './icons/Search.vue';

const router = useRouter();
const searchKw = ref('');
const handleSearch = () => {
  router.push({ path: '/search', query: { k: searchKw.value } });
};
</script>

<template>
  <div class="w-screen bg-white/20 py-6 backdrop-blur-sm">
    <div class="mx-auto flex max-w-6xl items-center justify-between">
      <NuxtLink to="/">
        <button class="oooh-baby-regular text-4xl">Gatherfy</button>
      </NuxtLink>

      <div class="flex gap-5">
        <div class="flex rounded-2xl border border-grey px-4 py-2">
          <input
            type="text"
            name=""
            id=""
            placeholder="search.."
            v-model="searchKw"
            class="bg-white/0 focus:outline-none"
            @keyup.enter="handleSearch"
          />
          <button @click="handleSearch()">
            <SearchIcon class="h-3 w-3 text-black" />
          </button>
        </div>
        <BtnComp text="Sign in" color="red" />
      </div>
    </div>
  </div>
</template>
