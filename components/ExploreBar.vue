<script setup lang="ts">
import Filter from './icons/Filter.vue';
import Arrow from './icons/Arrow.vue';
const emit = defineEmits([
  'sort-changed',
  'handleShowFilter',
  'handleSelectTime',
]);
const props = defineProps<{
  isShowSort: Boolean;
  selectedEventTime?: string;
  showFilter?: boolean;
  isShowPastEventBtn?: boolean;
}>();

const selectedEventTimeStyle = {
  active: 'text-light-grey font-semibold bg-burgundy',
  notActive: 'text-black',
};

const selectTime = (timeSelected: string) => {
  emit('handleSelectTime', timeSelected);
};

interface SortOption {
  name: string;
  urlSend: string;
}
const selectedSortBy = ref('');
const selectSortOption = (sortOption: SortOption) => {
  selectedSortBy.value = sortOption.name;
  emit('sort-changed', sortOption.urlSend);
  isShowSortBy.value = !isShowSortBy.value;
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
];
</script>

<template>
  <div
    class="flex items-center justify-between rounded-xl border border-dark p-1 px-3 lg:p-2 lg:pr-4"
  >
    <div
      :class="`flex gap-2 ${isShowSort ? 'pointer-events-none opacity-0' : ''}`"
    >
      <button
        @click="selectTime('today')"
        :class="`btn b3 rounded-md px-2 py-2 lg:px-4 ${selectedEventTime === 'today' ? selectedEventTimeStyle?.active : 'duration-200 hover:bg-zinc-200'}`"
      >
        Today event
      </button>
      <button
        @click="selectTime('upcome')"
        :class="`btn b3 rounded-md px-2 py-2 lg:px-4 ${selectedEventTime === 'upcome' ? selectedEventTimeStyle?.active : 'duration-200 hover:bg-zinc-200'}`"
      >
        Upcoming event
      </button>
      <button
        v-if="isShowPastEventBtn"
        @click="selectTime('past')"
        :class="`btn b3 rounded-md px-2 py-2 lg:px-4 ${selectedEventTime === 'past' ? selectedEventTimeStyle?.active : 'duration-200 hover:bg-zinc-200'}`"
      >
        Past event
      </button>
    </div>
    <div v-if="!isShowSort && !isShowPastEventBtn">
      <NuxtLink to="/events">
        <button
          :class="`btn b3 flex items-center gap-1 rounded-md px-2 py-2 duration-500 hover:translate-x-2 lg:px-4`"
        >
          See all events<Arrow class="b4 rotate-180" />
        </button>
      </NuxtLink>
    </div>
    <div class="b2 flex gap-4" v-show="isShowSort">
      <button
        @click="$emit('handleShowFilter')"
        class="btn flex items-center gap-1"
      >
        {{ showFilter ? 'Hide' : 'Show' }} filter <Filter class="text-black" />
      </button>
      <div class="relative">
        <button
          @click="isShowSortBy = !isShowSortBy"
          class="btn flex items-center gap-1"
        >
          Sort By<Arrow
            :class="`${isShowSortBy ? 'rotate-90' : '-rotate-90'} text-sm duration-200`"
          />
        </button>
        <div
          :class="`sort-div ${isShowSortBy ? 'h-[125px] opacity-100 lg:h-[190px]' : 'pointer-events-none h-0 opacity-0'} absolute -right-4 top-8 z-20 flex w-[110px] flex-col items-start gap-1 rounded-xl bg-[#fdfdfd] p-1 text-start shadow-xl duration-700 ease-in-out lg:top-12 lg:w-[150px] lg:p-3`"
        >
          <button
            v-for="sortOption in sortByData"
            @click="selectSortOption(sortOption)"
            :class="`btn w-full rounded-md px-2 py-1 text-start font-semibold lg:px-4 ${selectedSortBy === sortOption.name ? selectedEventTimeStyle?.active : 'duration-200 hover:bg-zinc-200'}`"
          >
            {{ sortOption.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
