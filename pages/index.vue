<script setup lang="ts">
import * as d3 from 'd3';
import Map from './Map.vue';
import ArrowIcon from '~/components/icons/ArrowIcon.vue';
import EventExploreDateCard from '~/components/EventExploreDateCard.vue';
type Event = {
  name: string;
  description: string;
  detail: string;
  start_date: string; // หรือใช้ Date ถ้าต้องการแปลงให้เป็นวันที่
  end_date: string; // หรือใช้ Date ถ้าต้องการแปลงให้เป็นวันที่
  location: string;
  map: string;
  capacity: number;
  status: string;
  slug: string;
  image: string;
  organizer: string;
};

const tagData = [
  { tag: 'Technology', color: '#FF5733' },
  { tag: 'Music', color: '#33FF57' },
  { tag: 'Art', color: '#3357FF' },
  { tag: 'Sports', color: '#FF33A1' },
];

const eventData = ref<Event[]>([]);
const fetchData = async () => {
  const reponse = await fetch('http://localhost:8080/api/events');
  eventData.value = await reponse.json();
  console.log('insert data', eventData.value);
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

onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="mx-auto my-24 max-w-4xl">
    {{ eventData[sampleEventIndex] }}
    <!-- Header Event Banner -->
    <NuxtLink :to="{ name: 'event-id', params: { id: 1 } }">
      <div class="relative h-[500px] w-full rounded-2xl">
        <div class="relative">
          <img
            src="https://picsum.photos/900/500"
            alt=""
            class="h-full w-full rounded-2xl"
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
            <div class="h-[250px] w-full rounded-2xl bg-beige p-4">
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
                src="https://picsum.photos/250/340"
                alt=""
                class="h-full w-full rounded-2xl"
              />
            </div>
          </div>
          <div class="grid grid-cols-6 gap-3">
            <div
              class="col-span-4 grid h-[150px] w-full grid-cols-3 place-content-center rounded-2xl bg-black p-5 text-white"
            >
              <div>
                When
                <p>Tuesday - Friday</p>
                <p>
                  {{ eventData[reccommentIndex]?.start_date }} -
                  {{ eventData[reccommentIndex]?.end_date }}
                </p>
              </div>
              <div>
                Where
                <!-- <p>{{ eventData[reccommentIndex]?.location }}</p> -->
              </div>
              <div>
                Who
                <p>SomSan Tech</p>
              </div>
            </div>
            <NuxtLink
              :to="{ name: 'event-id', params: { id: 1 } }"
              class="col-span-2"
            >
              <button class="h-[150px] w-full rounded-2xl bg-beige">
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
          <div v-for="event in eventData" class="h-full shrink-0 rounded-md">
            <img
              src="https://picsum.photos/200/280"
              alt=""
              class="rounded-2xl"
            />
            <div class="max-w-[200px]">
              <p>{{ event?.start_date }}</p>
              <p>{{ event?.name }}</p>
              <p>At {{ event?.location }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Tags section -->
    <div class="py-7">
      <h1 class="t1 py-3">Tags</h1>
      <div class="flex flex-wrap gap-2">
        <div
          class="flex h-[60px] w-[160px] items-center gap-3 rounded-md bg-beige p-3 shadow-sm"
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
    <div class="py-7">
      <h1 class="t1 py-3">Explore by date</h1>
      <div class="flex justify-between gap-10">
        <!-- Explore by Date -->
        <div class="w-full">
          <p class="py-2 text-lg font-semibold">
            Jan 5 <span class="text-sm text-zinc-500">Monday</span>
          </p>
          <div class="flex w-full flex-col gap-3">
            <div v-for="event in eventData">
              <NuxtLink :to="{ name: 'event-id', params: { id: event?.slug } }">
                <EventExploreDateCard :eventDetail="event" />
              </NuxtLink>
            </div>
          </div>
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
