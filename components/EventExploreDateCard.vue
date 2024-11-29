<script setup lang="ts">
import type { Event } from '~/models/event';
const props = defineProps<{
  eventDetail?: Event;
}>();
</script>

<template>
  <div
    class="flex h-[200px] w-full justify-between gap-3 rounded-lg bg-light-grey p-4 drop-shadow-lg"
  >
    <div class="flex flex-col justify-between">
      <div>
        <p class="b3 text-zinc-400">11:00 AM</p>
        <p class="b2 line-clamp-[2] w-[390px] font-semibold">
          {{ props.eventDetail?.name }}
        </p>
        <p class="b3 text-zinc-400">By {{ props.eventDetail?.owner }}</p>
        <p class="b3 text-zinc-400">By {{ props.eventDetail?.start_date }}</p>
        <p class="b3 line-clamp-1 w-[390px] text-zinc-400">
          At {{ props.eventDetail?.location }}
        </p>
      </div>
      <div class="flex gap-2 pt-3">
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
        class="h-full w-full rounded-md object-cover"
      />
    </div>
  </div>
</template>
