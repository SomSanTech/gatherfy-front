<script setup lang="ts">
import EventList from '~/components/EventList.vue';
import { DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
const route = useRoute();
const searchTerm = route.query.k;
const eventSearch = ref();
const searchEvent = async () => {
  const fetchedSearchData = await useSearchEvent(searchTerm);

  eventSearch.value = fetchedSearchData;
};
const date = ref(new Date());
const tagData = [
  { tag: 'Technology', color: '#FF5733' },
  { tag: 'Music', color: '#33FF57' },
  { tag: 'Art', color: '#3357FF' },
  { tag: 'Sports1', color: '#FF33A1' },
  { tag: 'Sports2', color: '#FF33A1' },
  { tag: 'Sports3', color: '#FF33A1' },
  { tag: 'Sports4', color: '#FF33A1' },
  { tag: 'Sports5', color: '#FF33A1' },
  { tag: 'Sports6', color: '#FF33A1' },
];

const selectTag = ref([]);

const dateToday = new Date();
console.log(dateToday);

const statusData = ['Soon', 'Available', 'Unavailable'];
const selectStauts = ref([]);
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
      <div class="flex items-center justify-between rounded-lg border p-2">
        <div class="flex gap-3">
          <button class="rounded-md bg-zinc-200 p-4">Today event</button>
          <button class="p-4">Upcomig event</button>
          <button class="p-4">All event</button>
        </div>
        <div class="flex gap-3">
          <button>Hide filter</button>
          <button>Sort by</button>
        </div>
      </div>
      <div class="grid grid-cols-4 gap-5 py-4">
        <div class="col-span-1 rounded-md border">
          <div v-for="tagChoice in tagData">
            <input
              type="checkbox"
              name=""
              id=""
              :value="tagChoice?.tag"
              v-model="selectTag"
            />
            <label for="checkbox">{{ tagChoice?.tag }}</label>
          </div>
          {{ selectTag }}
          <div>
            <p>Status</p>
            <div v-for="status in statusData">
              <input
                type="checkbox"
                name=""
                id=""
                :value="status"
                v-model="selectStauts"
              />
              <label for="checkbox">{{ status }}</label>
            </div>
            {{ selectStauts }}
          </div>
          <div>
            <p>date</p>
            <DatePicker v-model="date" mode="date" />
            {{ date }}
          </div>
        </div>
        <EventList :events="eventSearch" class="col-span-3" />
      </div>
    </div>
  </div>
</template>
