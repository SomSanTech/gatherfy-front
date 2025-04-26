<script setup lang="ts">
import type { Event } from '~/models/event';
const route = useRoute();
const props = defineProps<{
  eventDetail: Event;
  isVertical?: boolean;
  isFav?: boolean;
  isSquare?: boolean;
  isList?: boolean;
}>();

const emits = defineEmits(['handleFav']);

const handleFav = (id) => {
  emits('handleFav', id);
};

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
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
    :class="`${isSquare ? 'aspect-square w-full' : isList ? 'h-[290px] w-full lg:h-[330px]' : 'h-[300px] w-[190px] lg:h-[400px] lg:w-[260px]'}`"
    class="relative flex flex-shrink-0 items-end gap-4 rounded-xl duration-200 hover:scale-105"
  >
    <div
      v-if="eventDetail?.start_date"
      class="absolute left-3 top-3 flex w-10 flex-col items-center justify-center"
    >
      <div
        class="b4 w-full rounded-t-md bg-dark text-center !text-[10px] text-light-grey"
      >
        {{ monthNames[new Date(eventDetail?.start_date).getMonth()] }}
      </div>
      <div class="b4 w-full rounded-b-md bg-white py-1 text-center text-sm">
        {{ new Date(eventDetail?.start_date).getDate() }}
      </div>
    </div>
    <!-- <button
      v-if="route.fullPath === '/favorite'"
      @click="handleFav(eventDetail.eventId)"
      class="absolute right-3 top-3 rounded-md bg-white p-2"
    >
      <FavFill v-if="isFav" class="text-xl text-burgundy" />
      <FavOutline v-else class="fill-dark text-xl text-dark" /> 
    </button> -->
    <div class="mask-gradient rounded-b-xl bg-dark"></div>

    <div class="absolute z-40 p-2 text-white lg:p-4">
      <h2
        class="t3 line-clamp-2 text-2xl font-bold leading-5 lg:leading-normal"
      >
        {{ eventDetail?.name }}
      </h2>
      <p v-if="eventDetail.owner" class="b4">By {{ eventDetail?.owner }}</p>
      <p v-if="eventDetail.location" class="b4 line-clamp-2">
        At {{ eventDetail?.location }}
      </p>
      <div class="pb- absolute -top-5 flex flex-wrap gap-1 lg:-top-3">
        <NuxtLink
          v-for="tag in eventDetail?.tags"
          :key="tag.tag_title"
          :to="{ name: 'events', query: { tag: tag.tag_title } }"
        >
          <button
            class="b4 rounded-sm bg-white px-1 !text-[10px] text-dark drop-shadow-sm"
          >
            {{ tag.tag_title }}
          </button>
        </NuxtLink>
      </div>
    </div>
    <img
      :src="eventDetail?.image"
      alt=""
      class="h-full w-full rounded-xl object-cover"
    />
  </div>
</template>
