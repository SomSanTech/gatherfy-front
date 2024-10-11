<script setup lang="ts">
import * as d3 from 'd3';
import ArrowIcon from '~/components/icons/ArrowIcon.vue';
import EventExploreDateCard from '~/components/EventExploreDateCard.vue';
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

const data = ref<Event[]>([]);
const fetchEvents = async () => {
  let fetchData = await fetch('/events.json');
  // console.log(fetchData);
  const jsonData = await fetchData.json();
  data.value = jsonData;
  console.log(data.value);
};

const data2 = ref();
const fetchData = async () => {
  let fetchData = await fetch('http://localhost:8080/api/events');
  let searchData = await fetch(
    'http://localhost:8080/api/events/search?keyword=expo'
  );

  const searchDatas = await searchData.json();
  console.log(searchDatas);

  // console.log(fetchData.json());
  const jsonData = await fetchData.json();
  data2.value = jsonData;
  console.log(data2.value);
};
const handleReccomEvent = (type: string) => {
  if (type === 'next' && reccommentIndex.value !== data.value.length) {
    reccommentIndex.value += 1;
  }
  if (type === 'prev' && reccommentIndex.value !== 0) {
    reccommentIndex.value -= 1;
  }
};
const reccommentIndex = ref(0);

onMounted(() => {
  fetchEvents();
  fetchData();
});
</script>

<template>
  <div class="mx-auto my-24 max-w-4xl">
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
          <h1 class="shw text-4xl text-white">Tech Expo 2024</h1>
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
                {{ data[reccommentIndex]?.event_title }}
              </h3>
              <p>
                {{ data[reccommentIndex]?.event_detail }}
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
                  {{ data[reccommentIndex]?.event_start_date }} -
                  {{ data[reccommentIndex]?.event_end_date }}
                </p>
              </div>
              <div>
                Where
                <p>{{ data[reccommentIndex]?.location }}</p>
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
          <div v-for="event in data" class="h-full shrink-0 rounded-md">
            <img
              src="https://picsum.photos/200/280"
              alt=""
              class="rounded-2xl"
            />
            <div class="max-w-[200px]">
              <p>{{ event?.event_start_date }}</p>
              <p>{{ event?.event_title }}</p>
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
        <div class="h-[60px] w-[160px] rounded-md bg-zinc-100"></div>
        <div class="h-[60px] w-[160px] rounded-md bg-zinc-100"></div>
        <div class="h-[60px] w-[160px] rounded-md bg-zinc-100"></div>
        <div class="h-[60px] w-[160px] rounded-md bg-zinc-100"></div>
        <div class="h-[60px] w-[160px] rounded-md bg-zinc-100"></div>
        <div class="h-[60px] w-[160px] rounded-md bg-zinc-100"></div>
        <div class="h-[60px] w-[160px] rounded-md bg-zinc-100"></div>
        <div class="h-[60px] w-[160px] rounded-md bg-zinc-100"></div>
        <div class="h-[60px] w-[160px] rounded-md bg-zinc-100"></div>
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
            <NuxtLink
              :to="{ name: 'event-id', params: { id: event?.id } }"
              v-for="event in data"
            >
              <EventExploreDateCard :eventDetail="event" />
            </NuxtLink>
          </div>
        </div>
        <!-- map -->
        <div class="flex flex-col gap-2">
          <div class="h-[250px] w-[250px] rounded-md bg-zinc-200"></div>
          <div class="h-[250px] w-[250px] rounded-md bg-zinc-200"></div>
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
