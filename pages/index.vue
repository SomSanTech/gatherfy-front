<script setup lang="ts">
import * as d3 from 'd3';
import ArrowIcon from '~/components/icons/ArrowIcon.vue';
import Calendar from '~/components/icons/Calendar.vue';
import Location from '~/components/icons/Location.vue';
import Organisation from '~/components/icons/Organisation.vue';
import EventExploreDateCard from '~/components/EventExploreDateCard.vue';
import EventListCard from '~/components/EventListCard.vue';
import BtnComp from '~/components/BtnComp.vue';
import { DatePicker } from 'v-calendar';
import 'v-calendar/style.css';
import type { Event } from '~/models/event';
import { useFetchData } from '~/composables/useFetchData';

const today = ref(new Date());
const tagData = [
  { tag: 'Technology', color: '#FF5733' },
  { tag: 'Music', color: '#33FF57' },
  { tag: 'Art', color: '#3357FF' },
  { tag: 'Sports', color: '#FF33A1' },
];

const eventData = ref<Event[]>([]);

const fetchData = async () => {
  const fetchedData = await useFetchData('v1/events');
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

const handleSampleEvent = (type: string) => {
  if (type === 'next' && sampleEventIndex.value !== eventData.value.length) {
    sampleEventIndex.value += 1;
  }
  if (type === 'prev' && sampleEventIndex.value !== 0) {
    sampleEventIndex.value -= 1;
  }
};

const reccommentIndex = ref(0);

const sampleEventIndex = ref(0);

const maxDate = new Date();
maxDate.setMonth(maxDate.getMonth() + 2);

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const selectedEventTime: 'today' | 'upcome' | 'all' = ref('today');

const selectedEventTimeStyle = {
  active: 'text-light-grey font-semibold bg-burgundy py-2',
  notActive: 'text-black',
};

type GroupedEvents = {
  [date: string]: Event[];
};
const filterExploreDate = computed<GroupedEvents>(() => {
  const filteredData = eventData.value.filter((item) => {
    const itemDate = new Date(item.start_date).getTime();
    return (
      itemDate >= today.value.getTime() &&
      itemDate <= addDays(today.value, 3).getTime()
    );
  });

  if (filteredData.length === 0) {
    const nextAvailableDate = eventData.value.find(
      (item) => new Date(item.start_date).getTime() > today.value.getTime()
    );
    return nextAvailableDate
      ? { [nextAvailableDate.start_date]: [nextAvailableDate] }
      : {};
  }

  const groupDateData = d3.group(filteredData, (d) => d.start_date);
  const groupedEvents: GroupedEvents = {};

  Array.from(groupDateData.entries())
    .sort(
      ([dateA], [dateB]) =>
        new Date(dateA).getTime() - new Date(dateB).getTime()
    )
    .forEach(([date, events]) => {
      groupedEvents[date] = events as Event[];
    });

  return groupedEvents;
});

watch([today], ([newToday]) => {
  console.log('Today changed to:', newToday);

  filterExploreDate.value;
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
      <button
        class="absolute left-3 top-1/2 z-40 -translate-y-1/2 rounded-full bg-black/50 p-3 text-light-grey"
        @click="handleSampleEvent('prev')"
      >
        <ArrowIcon class="" />
      </button>
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
            <h1 class="shw t1 text-white">
              {{ eventData[sampleEventIndex]?.name }}
            </h1>
            <div class="b3 mt-4 flex gap-2">
              <BtnComp text="Join now" />
            </div>
          </div>
        </div>
      </NuxtLink>
      <button
        @click="handleSampleEvent('next')"
        class="absolute right-3 top-1/2 z-40 -translate-y-1/2 rounded-full bg-black/50 p-3 text-light-grey"
      >
        <ArrowIcon class="rotate-180" />
      </button>
    </div>

    <!-- Recommend Event section -->
    <div class="w-full py-7">
      <h1 class="t2">Reccomment Event</h1>
      <div class="relative flex w-full items-center justify-between gap-3 py-5">
        <button
          class="left-0 h-fit rounded-full"
          @click="handleReccomEvent('prev')"
        >
          <ArrowIcon class="text-2xl text-black" />
        </button>
        <div class="grid w-full grid-cols-5 gap-3">
          <div class="col-span-3 grid h-[400px] grid-rows-3 gap-3">
            <div
              class="row-span-2 flex w-full flex-col justify-between rounded-2xl bg-light-grey p-7 drop-shadow-md"
            >
              <div>
                <h3 class="b1 pb-4 font-semibold">
                  {{ eventData[reccommentIndex]?.name }}
                </h3>
                <p class="b2">
                  {{ eventData[reccommentIndex]?.detail }}
                </p>
              </div>

              <NuxtLink
                :to="{
                  name: 'event-id',
                  params: { id: eventData[reccommentIndex]?.slug || 0 },
                }"
                class="col-span-2"
              >
                <BtnComp text="Registor now" color="red" />
              </NuxtLink>
            </div>
            <div
              class="row-span-1 grid w-full grid-cols-3 place-content-center rounded-2xl bg-black p-7 text-light-grey drop-shadow-md"
            >
              <div class="flex flex-col gap-1">
                <Calendar />
                <div>
                  <p class="font-semibold">When</p>

                  <p v-if="eventData[reccommentIndex]" class="text-sm">
                    {{
                      useFormatDateTime(
                        new Date(eventData[reccommentIndex]?.start_date),
                        'date'
                      )
                    }}
                    -
                    {{
                      useFormatDateTime(
                        new Date(eventData[reccommentIndex]?.end_date),
                        'date'
                      )
                    }}
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
          </div>

          <div class="col-span-2 w-full drop-shadow-md">
            <img
              :src="eventData[reccommentIndex]?.image"
              alt=""
              class="h-[400px] w-full rounded-2xl object-cover"
            />
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
      <div class="flex gap-2 rounded-xl border border-black-1 p-2">
        <button
          @click="selectedEventTime = 'today'"
          :class="`rounded-md px-4 ${selectedEventTime === 'today' ? selectedEventTimeStyle?.active : 'duration-200 hover:bg-zinc-200'}`"
        >
          Today event
        </button>
        <button
          @click="selectedEventTime = 'upcome'"
          :class="`rounded-md px-4 ${selectedEventTime === 'upcome' ? selectedEventTimeStyle?.active : 'duration-200 hover:bg-zinc-200'}`"
        >
          Upcoming event
        </button>
        <button
          @click="selectedEventTime = 'all'"
          :class="`rounded-md px-4 ${selectedEventTime === 'all' ? selectedEventTimeStyle?.active : 'duration-200 hover:bg-zinc-200'}`"
        >
          All event
        </button>
      </div>
      <h1 class="t2 py-4">Today, 5 Jan</h1>
      <div class="relative">
        <div
          class="absolute left-0 top-0 z-20 h-full w-8 bg-gradient-to-r from-white"
        ></div>
        <div class="w-full overflow-x-auto px-4 pb-5">
          <div class="flex h-full w-full gap-3">
            <div v-for="event in eventData">
              <NuxtLink :to="{ name: 'event-id', params: { id: event?.slug } }">
                <EventListCard :eventDetail="event" :isVertical="true" />
              </NuxtLink>
            </div>
          </div>
        </div>
        <div
          class="absolute right-0 top-0 z-20 h-full w-10 bg-gradient-to-l from-white"
        ></div>
      </div>
    </div>
    <!-- Tags section -->
    <div class="py-7">
      <h1 class="t1 py-3">Tags</h1>
      <div class="flex flex-wrap gap-2">
        <button
          class="flex h-[60px] w-[160px] items-center gap-3 rounded-md bg-light-grey p-3 drop-shadow-md duration-200 hover:bg-grey"
          v-for="data in tagData"
          :key="data.tag"
        >
          <div
            :style="{ backgroundColor: data?.color }"
            class="h-full w-[5px] rounded"
          ></div>
          <span class="ml-2 font-semibold">{{ data.tag }}</span>
        </button>
      </div>
    </div>
    <!-- Explore Date section -->
    <div class="w-full py-7">
      <h1 class="t2 py-3">Explore by date</h1>
      <div class="flex w-full gap-8">
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
                {{ useFormatDateTime(new Date(date), 'fullDate') }}
              </p>
              <div class="flex w-full flex-col gap-3">
                <div v-for="event in events" class="w-full">
                  <NuxtLink
                    v-if="event?.slug"
                    :to="{ name: 'event-id', params: { id: event?.slug } }"
                  >
                    <EventExploreDateCard :eventDetail="event" class="w-full" />
                  </NuxtLink>
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
