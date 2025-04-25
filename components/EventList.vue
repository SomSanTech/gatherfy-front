<script setup lang="ts">
import type { Event } from '~/models/event';
const props = defineProps<{
  events?: Event[];
  isVertical?: boolean;
  isShowFilter?: boolean;
}>();
import EventListCard from './EventListCard.vue';
</script>

<template>
  <div
    :class="isShowFilter ? 'grid-cols-4' : 'grid-cols-2 lg:grid-cols-5'"
    class="grid h-fit flex-wrap gap-2 duration-300 lg:gap-3"
  >
    <div v-for="event in events" class="h-full shrink-0 rounded-md">
      <NuxtLink
        v-if="event?.slug"
        :to="{ name: 'event-id', params: { id: event?.slug } }"
      >
        <EventListCard :is-list="true" :event-detail="event" />
      </NuxtLink>
    </div>
  </div>
</template>
