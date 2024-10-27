<script setup lang="ts">
import Check from '~/components/icons/Check.vue';
import Arrow from '~/components/icons/Arrow.vue';
import { DatePicker } from 'v-calendar';
import 'v-calendar/style.css';

const props = defineProps<{
  selectedTags?: any;
  selectedStatus?: any;
}>();
const emit = defineEmits(['update-date', 'selectTag', 'selectStatus']);

interface Tag {
  tag_id: Number;
  tag_title: string;
  tag_code: string;
}

const date = ref(new Date());
const statusData = ['Soon', 'Available', 'Unavailable'];
const tags = ref<Tag[]>([]);
const filterShowOrNot = ref({
  tag: true,
  status: true,
  date: true,
});

const updateDate = (newDate: Date) => {
  date.value = newDate;
  emit('update-date', newDate);
};

onMounted(async () => {
  tags.value = await useFetchData('v1/tags');
});
</script>

<template>
  <div
    class="flex h-fit w-fit flex-col gap-4 divide-y-[1px] divide-grey rounded-xl border border-black-1 p-4"
  >
    <div class="flex w-full flex-col gap-[9px]">
      <button
        v-for="tagChoice in tags"
        :class="`${selectedTags?.includes(tagChoice?.tag_title) ? 'bg-burgundy pl-2 text-light-grey' : ''} b2 flex items-center rounded-md py-[5px] pl-4`"
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

    <div class="w-full pt-4">
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
    </div>

    <div :class="`w-[254px] pt-4 ${filterShowOrNot.date ? '' : ''} `">
      <button
        @click="filterShowOrNot.date = !filterShowOrNot.date"
        class="flex h-fit w-full items-center justify-between"
      >
        <p class="b1">Date</p>
        <Arrow
          :class="`${filterShowOrNot.date ? 'rotate-90' : '-rotate-90'} `"
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
