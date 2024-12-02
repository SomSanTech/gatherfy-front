<script setup lang="ts">
import type { Event } from '~/models/event';
const props = defineProps<{
  eventDetail?: Event;
}>();
</script>

<template>
  <div
    class="explore-card flex h-[150px] w-fit gap-3 rounded-lg bg-light-grey p-4 drop-shadow-lg lg:h-[200px] lg:w-full lg:justify-between"
  >
    <div class="flex flex-col justify-between">
      <div>
        <p class="explore-card-time b4 text-zinc-400">
          {{ useFormatDateTime(props?.eventDetail?.start_date, 'time') }}
        </p>
        <p
          class="explore-card-name b2 line-clamp-[2] w-[200px] pb-1 font-semibold lg:w-[390px]"
        >
          {{ props.eventDetail?.name }}
        </p>
        <p class="explore-card-owner b3 text-zinc-400">
          By {{ props.eventDetail?.owner }}
        </p>
        <p
          class="explore-card-location b3 line-clamp-1 w-[200px] text-zinc-400 lg:w-[390px]"
        >
          At {{ props.eventDetail?.location }}
        </p>
      </div>
      <div class="flex gap-2">
        <div v-for="tag in eventDetail?.tags">
          <NuxtLink :to="{ name: 'events', query: { tag: tag } }">
            <button
              class="b4 rounded-md border px-5 py-1 text-black-1 duration-200 hover:border-dark-grey/60"
            >
              {{ tag }}
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
  </div>
</template>
