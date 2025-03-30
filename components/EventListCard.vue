<script setup lang="ts">
import type { Event } from '~/models/event';

const props = defineProps<{
  eventDetail: Event;
  isVertical?: boolean;
}>();
</script>

<template>
  <div
    :class="`event-card shrink-0 drop-shadow-md duration-300 ${isVertical ? 'w-[150px] lg:w-[260px]' : 'w-[186px] hover:scale-105 hover:drop-shadow-2xl lg:w-[275px]'}`"
  >
    <div class="relative">
      <BtnComp
        v-if="new Date(eventDetail?.end_date).getTime() < new Date().getTime()"
        text="Event Ended"
        :is-bold="false"
        size="small"
        color="red"
        class="absolute left-2 top-2 z-10"
      />
      <img
        :src="eventDetail?.image"
        alt=""
        :class="`event-card-img w-full rounded-t-lg ${isVertical ? 'h-[190px] lg:h-[340px]' : 'h-[120px] lg:h-[165px]'} object-cover`"
        loading="lazy"
      />
      <div class="absolute bottom-2 left-2 flex gap-1">
        <div v-for="tag in eventDetail?.tags">
          <NuxtLink :to="{ name: 'events', query: { tag: tag.tag_title } }">
            <BtnComp
              :text="tag.tag_title"
              :is-bold="false"
              size="mini"
              class=""
            />
          </NuxtLink>
        </div>
      </div>
    </div>

    <div
      :class="`w-full rounded-b-lg bg-light-grey ${isVertical ? 'h-[70px] lg:h-[100px]' : 'h-[70px] lg:h-[98px]'} p-2 lg:p-3`"
    >
      <p v-if="eventDetail?.start_date" class="event-card-date b4">
        {{ useFormatDateTime(new Date(eventDetail?.start_date), 'date') }}
      </p>
      <p class="event-card-name b3 line-clamp-[2] font-semibold">
        {{ eventDetail?.name }}
      </p>
      <p class="event-card-location b4 line-clamp-1">
        At {{ eventDetail?.location }}
      </p>
    </div>
  </div>
</template>
