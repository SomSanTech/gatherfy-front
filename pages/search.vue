<script setup>
const route = useRoute();
const searchTerm = route.query.k;
const eventSearch = ref();
const searchEvent = async () => {
  const { data, error } = await useFetch(
    `http://localhost:8080/api/events/search?keyword=${searchTerm}`
  );

  if (error.value) {
    console.error('Error fetching events:', error.value);
    return;
  }

  eventSearch.value = data.value;
};
onMounted(() => {
  searchEvent();
});

watchEffect(() => {
  if (searchTerm) {
    searchEvent();
  }
});
</script>

<template>
  <div class="py-24">
    <div class="w-full overflow-x-auto">
      <h1 class="text-[40px] font-semibold">
        {{ eventSearch?.length }} Events for "{{ searchTerm }}"
      </h1>
      <div class="flex w-full justify-end">
        <button>Hide filter</button>
        <button>Sort by</button>
      </div>
      <div class="flex h-full w-full flex-row gap-4">
        <div v-for="event in eventSearch" class="h-full shrink-0 rounded-md">
          <NuxtLink
            v-if="event?.slug"
            :to="{ name: 'event-id', params: { id: event?.slug } }"
          >
            <div class="flex flex-col">
              <img
                :src="event?.image"
                alt=""
                class="h-[222px] w-[353px] rounded-t-2xl"
              />
              <div
                class="w-full rounded-b-2xl bg-beige/70 p-3 backdrop-blur-sm"
              >
                <p>{{ event?.start_date }}</p>
                <p>{{ event?.name }}</p>
                <p>At {{ event?.location }}</p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
