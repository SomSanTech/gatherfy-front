<script setup lang="ts">
import type { Event } from '~/models/event';

const props = defineProps<{
  eventDetail?: Event;
  isVertical?: boolean;
}>();
</script>

<template>
  <div
    :class="`shrink-0 drop-shadow-md ${isVertical ? 'w-[180px]' : 'w-[275px]'}`"
  >
    <img
      :src="eventDetail?.image"
      alt=""
      :class="`w-full rounded-t-lg ${isVertical ? 'h-[245px]' : 'h-[185px]'} object-cover`"
    />
    <div
      :class="`w-full rounded-b-lg bg-light-grey p-2 ${isVertical ? 'h-[85px]' : 'h-[91px]'}`"
    >
      <p v-if="eventDetail?.start_date" class="b4">
        {{ useFormatDateTime(new Date(eventDetail?.start_date), 'date') }}
      </p>
      <p class="b3 line-clamp-[2] font-semibold">{{ eventDetail?.name }}</p>
      <p class="b4">At {{ eventDetail?.location }}</p>
    </div>
  </div>
</template>
