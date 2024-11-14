<script setup lang="ts">
import Filter from './icons/Filter.vue';
import Arrow from './icons/Arrow.vue';
const emit = defineEmits(['sort-changed', 'handleShowFilter']);
const props = defineProps<{
  isShowSort: Boolean;
}>();

const selectedEventTime = ref('today');
const selectedEventTimeStyle = {
  active: 'text-light-grey font-semibold bg-burgundy',
  notActive: 'text-black',
};

interface SortOption {
  name: string;
  urlSend: string;
}
const selectedSortBy = ref('');
const selectSortOption = (sortOption: SortOption) => {
  selectedSortBy.value = sortOption.name;
  emit('sort-changed', sortOption.urlSend);
};

const isShowSortBy = ref(false);
const sortByData = [
  {
    name: 'Newest first',
    urlSend: 'date_desc',
  },
  {
    name: 'Oldest first',
    urlSend: 'date_asc',
  },
  {
    name: 'A-Z',
    urlSend: 'name_asc',
  },
  {
    name: 'Z-A',
    urlSend: 'name_desc',
  },
  {
    name: 'Status',
    urlSend: '',
  },
];
</script>

<template>
  <div
    class="flex items-center justify-between rounded-xl border border-black-1 p-2 pr-4"
  >
    <div class="flex gap-2">
      <button
        @click="selectedEventTime = 'today'"
        :class="`rounded-md px-4 py-2 ${selectedEventTime === 'today' ? selectedEventTimeStyle?.active : 'duration-200 hover:bg-zinc-200'}`"
      >
        Today event
      </button>
      <button
        @click="selectedEventTime = 'upcome'"
        :class="`rounded-md px-4 py-2 ${selectedEventTime === 'upcome' ? selectedEventTimeStyle?.active : 'duration-200 hover:bg-zinc-200'}`"
      >
        Upcoming event
      </button>
      <button
        @click="selectedEventTime = 'all'"
        :class="`rounded-md px-4 py-2 ${selectedEventTime === 'all' ? selectedEventTimeStyle?.active : 'duration-200 hover:bg-zinc-200'}`"
      >
        All event
      </button>
    </div>
    <div class="flex gap-4" v-show="isShowSort">
      <button
        @click="$emit('handleShowFilter')"
        class="flex items-center gap-1"
      >
        Hide filter <Filter class="text-black" />
      </button>
      <div class="relative">
        <button
          @click="isShowSortBy = !isShowSortBy"
          class="flex items-center gap-1"
        >
          Sort By<Arrow
            :class="`${isShowSortBy ? 'rotate-90' : '-rotate-90'} text-sm duration-200`"
          />
        </button>
        <div
          v-if="isShowSortBy"
          class="absolute -right-4 top-12 z-20 flex w-[150px] flex-col items-start gap-1 rounded-xl bg-[#fdfdfd] p-3 text-start shadow-xl"
        >
          <button
            v-for="sortOption in sortByData"
            @click="selectSortOption(sortOption)"
            :class="`w-full rounded-md px-4 py-1 text-start font-semibold ${selectedSortBy === sortOption.name ? selectedEventTimeStyle?.active : 'duration-200 hover:bg-zinc-200'}`"
          >
            {{ sortOption.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
