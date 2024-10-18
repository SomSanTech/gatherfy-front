<script setup lang="ts">
import * as d3 from 'd3';
import ArrowIcon from '~/components/icons/ArrowIcon.vue';
import Calendar from '~/components/icons/Calendar.vue';
import Location from '~/components/icons/Location.vue';
import Clock from '~/components/icons/Clock.vue';
import Organisation from '~/components/icons/Organisation.vue';
import EventExploreDateCard from '~/components/EventExploreDateCard.vue';
import EventListCard from '~/components/EventListCard.vue';
import { DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import type { Event } from '~/models/event';

const today = ref(new Date());
const tagData = [
  { tag: 'Technology', color: '#FF5733' },
  { tag: 'Music', color: '#33FF57' },
  { tag: 'Art', color: '#3357FF' },
  { tag: 'Sports', color: '#FF33A1' },
];

const eventData = ref<Event[]>([]);

const fetchData = async () => {
  const fetchedData = await useFetchEvent();
  eventData.value = fetchedData || [];
};

const handleReccomEvent = (type: string) => {
  if (type === 'next' && reccommentIndex.value !== eventData.value.length) {
    reccommentIndex.value += 1;
  }
  if (type === 'prev' && reccommentIndex.value !== 0) {
    reccommentIndex.value -= 1;
  }
};

const reccommentIndex = ref(0);

const sampleEventIndex = ref(0);
function formatDate(date: Date): string {
  const dayOfWeek = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
  }).format(date);
  const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(
    date
  );
  const day = new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(date);

  return `${month} ${day} ${dayOfWeek}`;
}

const maxDate = new Date();
maxDate.setMonth(maxDate.getMonth() + 2);

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};
type GroupedEvents = {
  [date: string]: Event[]; // each key (date) maps to an array of Event
};
const filterExploreDate = computed<GroupedEvents>(() => {
  const filteredData = eventData.value.filter((item) => {
    const itemDate = new Date(item.start_date).getTime();
    return (
      itemDate >= today.value.getTime() &&
      itemDate <= addDays(today.value, 3).getTime()
    );
  });

  // If no data for today and the next 3 days, find the next available date
  if (filteredData.length === 0) {
    const nextAvailableDate = eventData.value.find(
      (item) => new Date(item.start_date).getTime() > today.value.getTime()
    );
    // Return an empty object if no events are found
    return nextAvailableDate
      ? { [nextAvailableDate.start_date]: [nextAvailableDate] }
      : {};
  }

  // Group filtered data by start_date
  const groupDateData = d3.group(filteredData, (d) => d.start_date);
  const groupedEvents: GroupedEvents = {};

  // Sort the grouped keys (dates) and populate groupedEvents
  Array.from(groupDateData.entries())
    .sort(
      ([dateA], [dateB]) =>
        new Date(dateA).getTime() - new Date(dateB).getTime()
    )
    .forEach(([date, events]) => {
      groupedEvents[date] = events as Event[]; // Type assertion to ensure TypeScript understands the type
    });

  return groupedEvents;
});
watch([today], ([newToday]) => {
  console.log('Today changed to:', newToday);

  // ตัวอย่างการเรียกใช้ฟังก์ชันกรองข้อมูลใหม่
  filterExploreDate.value; // ถ้า filterExploreDate เป็น computed
});

onMounted(() => {
  fetchData();
  const intervalId = setInterval(() => {
    sampleEventIndex.value =
      (sampleEventIndex.value + 1) % eventData?.value?.length;
  }, 5000);

  onUnmounted(() => {
    clearInterval(intervalId);
  });
});
</script>

<template>
  <div class="mx-auto my-24 max-w-4xl">
    <!-- Header Event Banner -->
    <div class="relative">
      <div
        class="absolute left-3 top-1/2 z-40 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white"
        @click="sampleEventIndex -= 1"
      >
        <ArrowIcon class="" />
      </div>
      <NuxtLink
        :to="{
          name: 'event-id',
          params: { id: eventData[sampleEventIndex]?.slug || 1 },
        }"
      >
        <div class="relative h-[500px] w-full rounded-2xl">
          <div class="relative">
            <img
              :src="eventData[sampleEventIndex]?.image"
              alt=""
              class="h-[500px] w-full rounded-2xl object-cover"
            />
            <div class="absolute inset-0 rounded-2xl bg-black opacity-20"></div>
          </div>
          <div class="bg-blak/20 absolute bottom-3 left-3 rounded-lg px-4 py-4">
            <h1 class="shw text-4xl text-white">
              {{ eventData[sampleEventIndex]?.name }}
            </h1>
            <div class="mt-4 flex gap-2 text-sm">
              <button class="mt-2 rounded-2xl bg-white px-4 py-2">
                View more
              </button>
              <button
                class="mt-2 rounded-2xl bg-white/20 px-4 py-2 text-white backdrop-blur-sm"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </NuxtLink>
      <div
        class="absolute right-3 top-1/2 z-40 -translate-y-1/2 rounded-full bg-black/50 p-3 text-white"
      >
        <ArrowIcon class="rotate-180" />
      </div>
    </div>

    <!-- Recommend Event section -->
    <div class="w-full py-7">
      <h1 class="t1">Reccomment Event</h1>
      <div class="relative flex w-full items-center justify-between gap-3 py-5">
        <button
          class="left-0 h-fit rounded-full"
          @click="handleReccomEvent('prev')"
        >
          <ArrowIcon class="text-2xl text-black" />
        </button>
        <div class="flex w-full flex-col gap-3">
          <div class="flex gap-3">
            <div class="h-[250px] w-full rounded-2xl bg-[#FBE569] p-7">
              <h3 class="text-xl font-semibold">
                {{ eventData[reccommentIndex]?.name }}
              </h3>
              <p>
                {{ eventData[reccommentIndex]?.detail }}
              </p>
              <button class="my-3 bg-beige px-4 py-2">Read more</button>
            </div>
            <div class="h-[250px] w-full">
              <img
                :src="eventData[reccommentIndex]?.image"
                alt=""
                class="h-full w-full rounded-2xl object-cover"
              />
            </div>
          </div>
          <div class="grid grid-cols-6 gap-3">
            <div
              class="col-span-4 grid h-[150px] w-full grid-cols-3 place-content-center rounded-2xl bg-black p-7 text-white"
            >
              <div class="flex flex-col gap-1">
                <Calendar />
                <div>
                  <p class="font-semibold">When</p>

                  <p v-if="eventData[reccommentIndex]" class="text-sm">
                    {{ useFormatDate(eventData[reccommentIndex]?.start_date) }}
                    -
                    {{ useFormatDate(eventData[reccommentIndex]?.end_date) }}
                  </p>
                </div>
              </div>
              <div class="flex flex-col gap-1">
                <Location />
                <div>
                  <p class="font-semibold">Where</p>
                  <p class="text-sm">
                    {{ eventData[reccommentIndex]?.location }}
                  </p>
                </div>
              </div>
              <div class="flex flex-col gap-1">
                <Organisation />
                <div>
                  <p class="font-semibold">Who</p>
                  <p class="text-sm">SomSan Tech</p>
                </div>
              </div>
            </div>
            <NuxtLink
              :to="{
                name: 'event-id',
                params: { id: eventData[reccommentIndex]?.slug || 0 },
              }"
              class="col-span-2"
            >
              <button
                class="h-[150px] w-full rounded-2xl bg-[#8BD0FC] font-semibold"
              >
                Get<br />Ticket<br />Now
              </button>
            </NuxtLink>
          </div>
        </div>
        <button
          class="right-0 h-fit rounded-full"
          @click="handleReccomEvent('next')"
        >
          <ArrowIcon class="rotate-180 text-2xl text-black" />
        </button>
      </div>
    </div>
    <!-- Event List section -->
    <div class="w-full py-7">
      <div class="flex divide-x-[2px] rounded-full bg-beige px-4 py-4">
        <button class="px-4 font-bold">Today event</button>
        <button class="px-4">Upcoming event</button>
        <button class="px-4">All event</button>
      </div>
      <h1 class="t1 py-4">Today, 5 Jan</h1>
      <div class="w-full overflow-x-auto">
        <div class="flex h-full w-full gap-3">
          <div v-for="event in eventData">
            <NuxtLink :to="{ name: 'event-id', params: { id: event?.slug } }">
              <EventListCard :eventDetail="event" :isVertical="true" />
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    <!-- Tags section -->
    <div class="py-7">
      <h1 class="t1 py-3">Tags</h1>
      <div class="flex flex-wrap gap-2">
        <div
          class="flex h-[60px] w-[160px] items-center gap-3 rounded-md bg-[#F1F1F1] p-3 shadow-sm"
          v-for="data in tagData"
          :key="data.tag"
        >
          <div
            :style="{ backgroundColor: data?.color }"
            class="h-full w-[5px] rounded"
          ></div>
          <span class="ml-2 font-semibold">{{ data.tag }}</span>
        </div>
      </div>
    </div>
    <!-- Explore Date section -->
    <div class="w-full py-7">
      <h1 class="t1 py-3">Explore by date</h1>
      <div class="flex w-full justify-between gap-10">
        <!-- Explore by Date -->
        <div class="flex w-full">
          <div class="w-full">
            <div
              class="flex w-full gap-4"
              v-for="(events, date) in filterExploreDate"
              :key="date"
            >
              <div class="flex flex-col">
                <div class="my-4 h-3 w-3 rounded-full bg-zinc-200"></div>
                <div class="h-full translate-x-1/2 border-l-[1px]"></div>
              </div>
              <div>
                <p class="w-full py-2 text-lg font-semibold">
                  {{ formatDate(new Date(date)) }}
                </p>
                <div class="flex w-full flex-col gap-3">
                  <div v-for="event in events" class="w-full">
                    <NuxtLink
                      v-if="event?.slug"
                      :to="{ name: 'event-id', params: { id: event?.slug } }"
                    >
                      <EventExploreDateCard
                        :eventDetail="event"
                        class="w-full"
                      />
                    </NuxtLink>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <DatePicker
            v-model="today"
            mode="date"
            :min-date="today"
            :max-date="maxDate"
          />
          <!-- {{ today }} -->
          <!-- {{ filterExploreDate }} -->
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.shw {
  text-shadow: 1px 1px 6px rgb(0 0 0 / 45%);
}
</style>
