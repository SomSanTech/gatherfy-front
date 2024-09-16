<script setup lang="ts">
const props = defineProps<{
  eventDetail?: Event;
}>();

interface Event {
  id: number;
  event_title: string;
  event_detail: string;
  event_start_date: string;
  event_end_date: string;
  event_access_start_date: string;
  event_access_close_date: string;
  location: string;
  type: string[];
  image: string;
}
</script>

<template>
  <div class="flex w-full justify-between gap-3 rounded-lg bg-zinc-100 p-4">
    <div>
      <div>
        <p class="text-sm text-zinc-400">11:00 AM</p>
        <p class="max-w-[350px] font-semibold">
          {{ props.eventDetail?.event_title }}
        </p>
        <p class="text-sm text-zinc-400">By Somsan</p>
        <p class="text-sm text-zinc-400">At KMUTT</p>
      </div>
      <div class="pt-3">
        <button class="rounded-md bg-zinc-300 px-2 text-sm">Concert</button>
      </div>
    </div>
    <div class="se h-[100px] w-[100px] rounded-md bg-zinc-200">
      <img src="https://picsum.photos/100/100" alt="" class="rounded-md" />
    </div>
  </div>
</template>
