<script setup lang="ts">
import type { Event } from '~/models/event';

const props = defineProps<{
  eventDetail?: Event;
  isVertical?: boolean;
}>();
</script>

<template>
  <div
    :class="`shrink-0 rounded-md ${isVertical ? 'w-[272px]' : 'w-[353px]'} `"
  >
    <img
      :src="eventDetail?.image"
      alt=""
      :class="`w-full rounded-t-2xl ${isVertical ? 'h-[400px]' : 'h-[222px]'} object-cover`"
    />
    <div class="w-full rounded-b-2xl bg-[#FBE569] p-4">
      <p v-if="eventDetail?.start_date" class="text-sm">
        {{ useFormatDate(eventDetail?.start_date) }}
      </p>
      <p class="text-lg font-semibold">{{ eventDetail?.name }}</p>
      <p class="text-sm">At {{ eventDetail?.location }}</p>
    </div>
  </div>
</template>
