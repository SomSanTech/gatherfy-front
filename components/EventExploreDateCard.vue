<script setup lang="ts">
import type { Event } from '~/models/event';
const props = defineProps<{
  eventDetail?: Event;
}>();
</script>

<template>
  <div
    class="group relative max-w-lg overflow-hidden rounded-xl shadow-lg duration-700 lg:min-w-[520px]"
  >
    <!-- Background Image -->
    <div class="group relative duration-700">
      <img :src="props?.eventDetail?.image" class="h-64 w-full object-cover" />

      <!-- Blurred Overlay -->
      <div class="mask-gradient bg-black/50"></div>

      <div class="absolute bottom-4 left-4 z-50 text-white">
        <h2 class="t3 text-2xl font-bold">{{ props.eventDetail?.name }}</h2>
        <!-- <p class="b4"> {{ useFormatDateTime(props?.eventDetail?.start_date, 'time') }}</p> -->
        <p class="b4">By {{ props.eventDetail?.owner }}</p>
        <p class="b4">At {{ props.eventDetail?.location }}</p>
        <div class="flex gap-2 pt-2">
          <div v-for="tag in eventDetail?.tags" class="">
            <NuxtLink :to="{ name: 'events', query: { tag: tag.tag_title } }">
              <button
                class="b4 rounded-md bg-white/80 px-3 py-1 text-black shadow-md backdrop-blur-md hover:bg-white"
              >
                {{ tag.tag_title }}
              </button>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- <div
    class="explore-card flex h-[150px] w-fit gap-3 rounded-lg bg-light-grey p-4 drop-shadow-lg lg:h-[200px] lg:w-full lg:justify-between"
  >
    <div class="flex flex-col justify-between">
      <div>
        <p class="explore-card-time b4 text-zinc-400">
          {{ useFormatDateTime(props?.eventDetail?.start_date, 'time') }}
        </p>
        <p
          class="explore-card-name b2 line-clamp-[2] w-[140px] pb-1 font-semibold lg:w-[390px]"
        >
          {{ props.eventDetail?.name }}
        </p>
        <p class="explore-card-owner b3 text-zinc-400">
          By {{ props.eventDetail?.owner }}
        </p>
        <p
          class="explore-card-location b3 line-clamp-1 w-[140px] text-zinc-400 lg:w-[390px]"
        >
          At {{ props.eventDetail?.location }}
        </p>
      </div>
      <div class="flex gap-2">
        <div v-for="tag in eventDetail?.tags">
          <NuxtLink :to="{ name: 'events', query: { tag: tag.tag_title } }">
            <button
              class="b4 rounded-md border px-5 py-1 text-black-1 duration-200 hover:border-dark-grey/60"
            >
              {{ tag.tag_title }}
            </button>
          </NuxtLink>
        </div>
      </div>
    </div>
    <div class="w-[120px] rounded-md">
      <img
        :src="props?.eventDetail?.image"
        alt=""
        class="explore-card-img h-full w-full rounded-md object-cover"
      />
    </div>
  </div> -->
</template>
