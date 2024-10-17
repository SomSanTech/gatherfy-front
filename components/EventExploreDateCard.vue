<script setup lang="ts">
import type { Event } from '~/models/event';
const props = defineProps<{
  eventDetail?: Event;
}>();
</script>

<template>
  <div
    class="flex h-[200px] w-full justify-between gap-3 rounded-lg bg-[#F1F1F1] p-4"
  >
    <div>
      <div>
        <p class="text-sm text-zinc-400">11:00 AM</p>
        <p class="max-w-[350px] font-semibold">
          {{ props.eventDetail?.name }}
        </p>
        <p class="text-sm text-zinc-400">
          By {{ props.eventDetail?.organizer }}
        </p>
        <p class="text-sm text-zinc-400">
          At {{ props.eventDetail?.location }}
        </p>
      </div>
      <div class="pt-3">
        <button class="rounded-md bg-black px-5 py-1 text-sm text-white">
          Concert
        </button>
      </div>
    </div>
    <div class="rounded-md bg-zinc-200">
      <img
        :src="props?.eventDetail?.image"
        alt=""
        class="h-full w-auto rounded-md object-cover"
      />
    </div>
  </div>
</template>
