<script setup lang="ts">
import type { Event } from '~/models/event';

const props = defineProps<{
  eventDetail: Event;
  isVertical?: boolean;
}>();
</script>

<template>
  <!-- <div
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
  </div> -->
  <div
    class="relative flex h-[420px] w-[260px] flex-shrink-0 items-end gap-4 rounded-xl duration-200 hover:scale-105"
  >
    <!-- ซ้าย -->
    <div
      class="absolute bottom-0 left-0 z-10 flex h-1/4 flex-col justify-center rounded-b-xl bg-zinc-200/80 p-3 backdrop-blur-md"
    >
      <div class="pb- absolute -top-7 flex flex-wrap gap-1">
        <NuxtLink
          v-for="tag in eventDetail?.tags"
          :key="tag.tag_title"
          :to="{ name: 'events', query: { tag: tag.tag_title } }"
        >
          <button
            class="b4 rounded-sm bg-white px-1 !text-[10px] drop-shadow-sm"
          >
            {{ tag.tag_title }}
          </button>
        </NuxtLink>
      </div>
      <p v-if="eventDetail?.start_date" class="event-card-date b4">
        {{ useFormatDateTime(new Date(eventDetail?.start_date), 'date') }}
      </p>
      <h1 class="event-name b3 line-clamp-[2] font-semibold">
        {{ eventDetail?.name }}
      </h1>
      <p class="event-card-location b4 line-clamp-1">
        At {{ eventDetail?.location }}
      </p>
      <!-- <div class="b3 mt-4 flex gap-2">
        <BtnComp color="black" :is-bold="false" text="Join now" />
      </div> -->
    </div>

    <!-- รูป -->
    <img
      :src="eventDetail?.image"
      alt=""
      class="h-full w-full rounded-xl object-cover"
    />
  </div>
</template>
