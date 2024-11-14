<script setup lang="ts">
import FilterEvent from '~/components/FilterEvent.vue';
import EventList from '~/components/EventList.vue';
import ExploreBar from '~/components/ExploreBar.vue';

const route = useRoute();
const searchTerm = ref(route.query.k);
const eventSearch = ref();
const formattedDate = ref();
const selectedTags = ref(new Set());
const selectedStatus = ref(new Set());
const tags = ref([]);
const showFilter = ref(true);
const sortFilter = ref('');

const handleDateUpdate = (newDate: Date) => {
  formattedDate.value = newDate.toISOString().slice(0, 10);
};
const toggleSetItem = <T,>(set: Set<T>, item: T) => {
  set.has(item) ? set.delete(item) : set.add(item);
};
const selectTag = (tag: string) => {
  toggleSetItem(selectedTags.value, tag);
};
const selectStatus = (status: string) => {
  toggleSetItem(selectedStatus.value, status);
};
const buildFilterUrl = () => {
  const tags =
    [...selectedTags.value].length > 0
      ? [...selectedTags.value].map((tag) => `tags=${tag}`).join('&')
      : '';
  const status =
    [...selectedStatus.value].length > 0
      ? [...selectedStatus.value].map((stat) => `status=${stat}`).join('&')
      : '';
  const date = formattedDate.value ? `date=${formattedDate.value}` : '';
  const sort = sortFilter.value ? `sort=${sortFilter.value}` : '';

  return [tags, status, date, sort].filter(Boolean).join('&');
};
const filterAndSearchEvents = async () => {
  let url;
  if (searchTerm.value) {
    url = `v1/events?keyword=${searchTerm.value}&${buildFilterUrl()}`;
  } else {
    url = `v1/events?${buildFilterUrl()}`;
  }
  eventSearch.value = await useFetchData(url);
};
const handleShowFilter = () => {
  showFilter.value = !showFilter.value;
};
const handleSortFilter = (sortByOption: any) => {
  sortFilter.value = sortByOption;
};
onMounted(async () => {
  tags.value = await useFetchData('v1/tags');
  eventSearch.value = await useFetchData(
    `v1/events?keyword=${searchTerm.value}`
  );
});
watch(
  () => route.query.k,
  (newValue) => {
    searchTerm.value = newValue;
  }
);
watch(
  [
    () => searchTerm.value,
    () => Array.from(selectedTags.value),
    () => Array.from(selectedStatus.value),
    () => formattedDate.value,
    () => sortFilter.value,
  ],
  () => filterAndSearchEvents(),
  { immediate: true }
);
</script>

<template>
  <div class="py-24">
    <div class="mx-auto w-full max-w-6xl">
      <h1 class="t1 font-semibold">
        {{ eventSearch?.length }} Events for "{{ searchTerm }}"
      </h1>
      <ExploreBar
        class="my-4"
        :is-show-sort="true"
        @handleShowFilter="handleShowFilter"
        @sort-changed="handleSortFilter"
      />
      <div class="flex gap-3">
        <FilterEvent
          v-if="showFilter"
          @selectTag="selectTag"
          @selectStatus="selectStatus"
          @update-date="handleDateUpdate"
          :selectedTags="[...selectedTags]"
          :selectedStatus="[...selectedStatus]"
        />
        <EventList
          :events="eventSearch"
          :class="{ 'w-full': !showFilter, 'w-[calc(100%-200px)]': showFilter }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
