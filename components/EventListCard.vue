<script setup lang="ts">
import type { Event } from '~/models/event';

const props = defineProps<{
  eventDetail?: Event;
  isVertical?: boolean;
}>();
</script>

<template>
  <div
    :class="`shrink-0 rounded-md drop-shadow-md ${isVertical ? 'w-[170px]' : 'h-[370px] w-[370px]'} `"
  >
    <img
      :src="eventDetail?.image"
      alt=""
      :class="`w-full rounded-t-lg ${isVertical ? 'h-[240px]' : 'h-[235px]'} object-cover`"
    />
    <div
      :class="`w-full rounded-b-2xl bg-zinc-200 p-4 ${isVertical ? 'h-[135px]' : 'h-[135px]'}`"
    >
      <p v-if="eventDetail?.start_date" class="text-sm">
        {{ useFormatDate(eventDetail?.start_date) }}
      </p>
      <p class="text-lg font-semibold">{{ eventDetail?.name }}</p>
      <p class="text-sm">At {{ eventDetail?.location }}</p>
    </div>
  </div>
</template>
