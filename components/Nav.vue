<script setup lang="ts">
import SearchIcon from './icons/Search.vue';

const router = useRouter();
const searchKw = ref('');
const handleSearch = () => {
  if (searchKw.value.length > 0) {
    router.push({
      path: '/events',
      query: { k: encodeURIComponent(searchKw.value) },
    });
  } else {
    router.push({
      path: '/events',
    });
  }
};
</script>

<template>
  <div class="w-screen bg-white/20 py-4 backdrop-blur-sm lg:py-6">
    <div
      class="mx-auto flex items-center justify-between px-5 lg:max-w-6xl lg:px-0"
    >
      <NuxtLink to="/">
        <button class="go-home-btn oooh-baby-regular text-xl lg:text-4xl">
          Gatherfy
        </button>
      </NuxtLink>

      <div class="flex gap-5">
        <div
          class="b3 flex rounded-2xl border border-grey px-2 lg:px-4 lg:py-2"
        >
          <input
            type="text"
            name=""
            id=""
            placeholder="search.."
            v-model="searchKw"
            class="bg-white/0 focus:outline-none"
            @keyup.enter="handleSearch"
          />
          <button @click="handleSearch()" class="search-btn">
            <SearchIcon class="h-3 w-3 text-black" />
          </button>
        </div>
        <BtnComp text="Sign in" color="red" />
      </div>
    </div>
  </div>
</template>
