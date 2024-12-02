<script setup lang="ts">
import type { Event } from '~/models/event';
const props = defineProps<{
  events?: Event[];
  isVertical?: boolean;
}>();
import EventListCard from './EventListCard.vue';
</script>

<template>
  <div class="flex h-fit flex-wrap gap-2 lg:gap-3">
    <div v-for="event in events" class="h-full shrink-0 rounded-md">
      <NuxtLink
        v-if="event?.slug"
        :to="{ name: 'event-id', params: { id: event?.slug } }"
      >
        <EventListCard :event-detail="event" />
      </NuxtLink>
    </div>
  </div>
</template>
