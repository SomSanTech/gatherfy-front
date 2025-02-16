<script setup lang="ts">
import Check from '~/components/icons/Check.vue';
import Arrow from '~/components/icons/Arrow.vue';
import Cancle from './icons/Cancle.vue';
import { DatePicker } from 'v-calendar';
import 'v-calendar/style.css';

const props = defineProps<{
  selectedTags?: any;
  selectedStatus?: any;
  tags: any;
  isMobile?: boolean;
  showFilter?: boolean;
}>();
const emit = defineEmits([
  'update-date',
  'selectTag',
  'selectStatus',
  'handleShowFilter',
]);

interface Tag {
  tag_id: Number;
  tag_title: string;
  tag_code: string;
}

const date = ref();
const statusData = ['Soon', 'Available', 'Unavailable'];
const filterShowOrNot = ref({
  tag: true,
  status: true,
  date: true,
});

const updateDate = (newDate: Date) => {
  date.value = newDate;
  emit('update-date', newDate);
};
</script>

<template>
  <div
    class="hidden h-fit w-fit flex-col gap-4 divide-y-[1px] divide-grey rounded-xl border border-black-1 bg-white p-4 lg:flex"
  >
    <div class="flex w-full flex-col gap-[9px]">
      <p class="b1">Tags</p>
      <button
        v-for="tagChoice in tags"
        :class="`${selectedTags?.includes(tagChoice?.tag_title) ? 'bg-burgundy pl-2 text-light-grey hover:bg-dark-grey/60' : 'hover:bg-zinc-200'} b2 flex items-center rounded-md py-[5px] pl-4 duration-300`"
        @click="$emit('selectTag', tagChoice?.tag_title)"
      >
        <Check
          v-if="selectedTags?.includes(tagChoice?.tag_title)"
          class="fill-light-grey text-3xl"
        />
        <p>
          {{ tagChoice?.tag_title }}
        </p>
      </button>
    </div>

    <!-- <div class="w-full pt-4">
      <button
        @click="filterShowOrNot.status = !filterShowOrNot.status"
        class="flex w-full items-center justify-between"
      >
        <p class="b1">Status</p>
        <Arrow
          :class="`${filterShowOrNot.status ? 'rotate-90' : '-rotate-90'} `"
        />
      </button>
      <div class="flex flex-col gap-[9px] pt-4" v-if="filterShowOrNot?.status">
        <button
          v-for="status in statusData"
          :class="`${selectedStatus?.includes(status) ? 'bg-burgundy pl-2 text-light-grey' : ''} b2 flex items-center rounded-md py-[5px] pl-4`"
          @click="$emit('selectStatus', status)"
        >
          <Check
            v-if="selectedStatus?.includes(status)"
            class="fill-light-grey text-3xl"
          />
          <p>
            {{ status }}
          </p>
        </button>
      </div>
    </div> -->

    <div
      :class="`w-[254px] pt-4 ${filterShowOrNot.date ? '' : ''} duration-1000`"
    >
      <button
        @click="filterShowOrNot.date = !filterShowOrNot.date"
        class="flex h-fit w-full items-center justify-between"
      >
        <p class="b1">Date</p>
        <Arrow
          :class="`${filterShowOrNot.date ? 'rotate-90' : '-rotate-90'} duration-300`"
        />
      </button>
      <div :class="`w-[254px] pt-4`" v-if="filterShowOrNot?.date">
        <DatePicker
          v-model="date"
          mode="date"
          class=""
          @update:model-value="updateDate"
        />
      </div>
    </div>
  </div>
  <div
    :class="`fixed -left-0 top-0 z-40 flex h-screen w-screen flex-col gap-4 bg-white p-4 px-8 pt-20 lg:hidden`"
  >
    <button @click="$emit('handleShowFilter')">
      <Cancle class="t2 absolute right-7 top-7" />
    </button>
    <div class="flex w-full flex-col gap-[9px]">
      <p class="b1">Tags</p>
      <button
        v-for="tagChoice in tags"
        :class="`${selectedTags?.includes(tagChoice?.tag_title) ? 'bg-burgundy pl-2 text-light-grey hover:bg-dark-grey/60' : 'hover:bg-zinc-200'} b2 flex items-center rounded-md py-[5px] pl-4 duration-300`"
        @click="$emit('selectTag', tagChoice?.tag_title)"
      >
        <Check
          v-if="selectedTags?.includes(tagChoice?.tag_title)"
          class="fill-light-grey text-3xl"
        />
        <p>
          {{ tagChoice?.tag_title }}
        </p>
      </button>
    </div>

    <div
      :class="`w-[254px] pt-4 ${filterShowOrNot.date ? '' : ''} duration-1000`"
    >
      <button
        @click="filterShowOrNot.date = !filterShowOrNot.date"
        class="flex h-fit w-full items-center justify-between"
      >
        <p class="b1">Date</p>
        <Arrow
          :class="`${filterShowOrNot.date ? 'rotate-90' : '-rotate-90'} duration-300`"
        />
      </button>
      <div :class="`w-[254px] pt-4`" v-if="filterShowOrNot?.date">
        <DatePicker
          v-model="date"
          mode="date"
          class=""
          @update:model-value="updateDate"
        />
      </div>
    </div>
  </div>
</template>
