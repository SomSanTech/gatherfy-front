<script setup lang="ts">
import type { Event } from '~/models/event';

const props = defineProps<{
  eventDetail?: Event;
  isVertical?: boolean;
}>();
</script>

<template>
  <div
    :class="`shrink-0 drop-shadow-md ${isVertical ? 'w-[260px]' : 'w-[275px]'}`"
  >
    <div class="relative">
      <img
        :src="eventDetail?.image"
        alt=""
        :class="`w-full rounded-t-lg ${isVertical ? 'h-[340px]' : 'h-[165px]'} object-cover`"
        loading="lazy"
      />
      <div class="absolute bottom-2 left-2 flex gap-1">
        <div v-for="tag in eventDetail?.tags">
          <NuxtLink :to="{ name: 'events', query: { tag: tag } }">
            <button class="b4 rounded-sm bg-light-grey px-2 drop-shadow-md">
              {{ tag }}
            </button>
          </NuxtLink>
        </div>
      </div>
    </div>

    <div
      :class="`w-full rounded-b-lg bg-light-grey ${isVertical ? 'h-[100px]' : 'h-[98px]'} p-3`"
    >
      <p v-if="eventDetail?.start_date" class="b4">
        {{ useFormatDateTime(new Date(eventDetail?.start_date), 'date') }}
      </p>
      <p class="b3 line-clamp-[2] font-semibold">{{ eventDetail?.name }}</p>
      <p class="b4 line-clamp-1">At {{ eventDetail?.location }}</p>
    </div>
  </div>
</template>
