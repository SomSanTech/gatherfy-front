<script setup>
import EventListCard from '~/components/EventListCard.vue';

const route = useRoute();
const searchTerm = route.query.k;
const eventSearch = ref();
const searchEvent = async () => {
  const fetchedSearchData = await useSearchEvent(searchTerm);

  eventSearch.value = fetchedSearchData;
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
            <EventListCard :event-detail="event" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
