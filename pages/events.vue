<script setup lang="ts">
import FilterEvent from '~/components/FilterEvent.vue';
import EventList from '~/components/EventList.vue';
import ExploreBar from '~/components/ExploreBar.vue';

const route = useRoute();
const searchTerm = ref(route.query.k);
const tagsTerm = ref(route.query.tag);
const eventSearch = ref();
const formattedDate = ref();
const selectedTags = ref(new Set());
const selectedStatus = ref(new Set());
const tags = ref([]);
const showFilter = ref();
const sortFilter = ref('');
const isLoading = ref(false);
const isInitializing = ref(true);

const handleDateUpdate = (newDate: Date) => {
  if (newDate) {
    formattedDate.value = newDate
      .toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' })
      .replaceAll('/', '-');
  } else {
    formattedDate.value = '';
    filterAndSearchEvents();
  }
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
  isLoading.value = true;
  try {
    let url;
    if (searchTerm.value) {
      url = `v1/events?keyword=${searchTerm.value}&${buildFilterUrl()}`;
    } else {
      url = `v1/events?${buildFilterUrl()}`;
    }
    eventSearch.value = (await useFetchData(url, 'GET')).data;
  } catch (error) {
    console.error('Error fetching events:', error);
  } finally {
    isLoading.value = false;
    isInitializing.value = false;
  }
};

const handleShowFilter = () => {
  showFilter.value = !showFilter.value;
};

const handleSortFilter = (sortByOption: any) => {
  sortFilter.value = sortByOption;
};
const viewportWidth = computed(() => window.innerWidth);

const isMobile = computed(() => viewportWidth.value <= 450);
onMounted(async () => {
  if (isMobile.value) {
    showFilter.value = false;
  } else {
    showFilter.value = true;
  }
  isLoading.value = true;
  try {
    tags.value = (await useFetchData('v1/tags', 'GET')).data;
    if (tagsTerm.value) {
      selectedTags.value.add(tagsTerm.value);

      await filterAndSearchEvents();
    } else if (searchTerm.value) {
      eventSearch.value = (
        await useFetchData(`v1/events?keyword=${searchTerm.value}`, 'GET')
      ).data;
    } else {
      eventSearch.value = (await useFetchData(`v1/events`, 'GET')).data;
    }
  } catch (error) {
    console.error('Error fetching events:', error);
  } finally {
    isLoading.value = false;
  }
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
    () => tagsTerm.value,
    () => Array.from(selectedTags.value),
    () => Array.from(selectedStatus.value),
    () => formattedDate.value,
    () => sortFilter.value,
  ],
  () => {
    if (!isInitializing.value || !tagsTerm.value) {
      filterAndSearchEvents();
    }
  },
  { immediate: true }
);
</script>

<template>
  <div class="py-24">
    <div class="mx-auto w-full px-5 lg:max-w-6xl lg:px-0">
      <h1 v-if="searchTerm" class="t1 font-semibold">
        {{ eventSearch?.length }} Events for "{{
          decodeURIComponent(searchTerm)
        }}"
      </h1>
      <h1 v-else-if="tagsTerm" class="t1 font-semibold">
        Events in tag "{{ decodeURIComponent(tagsTerm) }}"
      </h1>
      <h1 v-else class="t1 font-semibold">All events</h1>
      <ExploreBar
        class="my-4"
        :is-show-sort="true"
        :showFilter
        :isMobile
        @handleShowFilter="handleShowFilter"
        @sort-changed="handleSortFilter"
      />
      <div class="flex gap-3">
        <FilterEvent
          v-if="showFilter"
          :tags
          :isMobile
          @handleShowFilter="handleShowFilter"
          @selectTag="selectTag"
          @selectStatus="selectStatus"
          @update-date="handleDateUpdate"
          :selectedTags="[...selectedTags]"
          :selectedStatus="[...selectedStatus]"
        />
        <div v-if="isLoading" class="flex w-full items-center justify-center">
          <span class="loader"></span>
        </div>
        <h1
          v-else-if="eventSearch?.length === 0"
          class="no-event-search t3 mx-auto flex items-center justify-center font-semibold"
        >
          Can't Find Events You're Looking For
        </h1>
        <EventList
          v-else
          :events="eventSearch"
          :class="{ 'w-full': !showFilter, 'w-[calc(100%-200px)]': showFilter }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
