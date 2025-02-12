<script setup lang="ts">
import * as d3 from 'd3';
import ArrowIcon from '~/components/icons/Arrow.vue';
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
import ExploreBar from '~/components/ExploreBar.vue';

const today = ref(new Date());

const eventData = ref<Event[]>([]);
const recommendedData = ref<Event[]>([]);
const bannerEventData = ref<Event[]>([]);
const tagsData = ref<Event[]>([]);

const fetchData = async () => {
  const fetchedData = await useFetchData('v1/events');
  const fetchTagData = await useFetchData('v1/tags');
  const fetchRecommendedData = await useFetchData('v1/events/recommended');
  eventData.value = (await fetchedData) || [];
  tagsData.value = (await fetchTagData) || [];
  recommendedData.value = (await fetchRecommendedData) || [];

  bannerEventData.value = eventData.value
    .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))
    .slice(0, 5);

  console.log('bannerEventData ', bannerEventData.value);
};

const handleReccomEvent = (type: string) => {
  if (type === 'next') {
    reccommentIndex.value =
      (reccommentIndex.value + 1) % recommendedData.value.length;
  }
  if (type === 'prev') {
    reccommentIndex.value =
      (reccommentIndex.value - 1 + recommendedData.value.length) %
      recommendedData.value.length;
  }
};

const isFirstClickSampleEvent = ref(false);

const handleSampleEvent = (type: string) => {
  isFirstClickSampleEvent.value = true;
  if (type === 'next') {
    sampleEventIndex.value =
      (sampleEventIndex.value + 1) % bannerEventData.value.length;
  }
  if (type === 'prev') {
    sampleEventIndex.value =
      (sampleEventIndex.value - 1 + bannerEventData.value.length) %
      bannerEventData.value.length;
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

type GroupedEvents = {
  [date: string]: Event[];
};

const filterExploreDate = computed<GroupedEvents>(() => {
  const dateFocus = new Date(today.value);

  const filteredData = eventData.value.filter((item) => {
    const itemStartDate = new Date(item.start_date);
    const itemEndDate = new Date(item.end_date);
    return (
      itemStartDate.getTime() >= dateFocus.getTime() ||
      itemEndDate.getTime() >= dateFocus.getTime()
    );
  });

  const groupDateData = d3.group(filteredData, (d) => {
    return d.start_date;
  });

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
  filterExploreDate.value;
});
const selectedEventTime = ref('today');
const handleSelectTime = (time: string) => {
  selectedEventTime.value = time;
};

const isLoading = ref(false);

onMounted(async () => {
  isLoading.value = true;
  try {
    await fetchData();
  } catch (error) {
    console.error('Error fetching events:', error);
  } finally {
    isLoading.value = false;
    filterTimeEventData(selectedEventTime.value);

    const intervalId = setInterval(() => {
      if (!isFirstClickSampleEvent.value) {
        sampleEventIndex.value =
          (sampleEventIndex.value + 1) % bannerEventData?.value?.length;
      } else {
        clearInterval(intervalId);
      }
    }, 5000);
  }
});

const accessToken = useCookie('accessToken');
// const refreshToken = useCookie('refreshToken');

console.log(accessToken.value);
const filteredTimeData = ref();
const filterTimeEventData = (time: string) => {
  let filter;
  if (time === 'today') {
    filter = eventData.value.filter((e) => {
      const start = new Date(e?.start_date)?.getTime();
      const today = new Date().getTime();
      const end = new Date(e?.end_date)?.getTime();
      return start <= today && end >= today;
    });
  } else {
    filter = eventData.value.filter((e) => {
      return new Date(e?.start_date)?.getTime() > new Date().getTime();
    });
  }

  filteredTimeData.value = filter;
};
watch(selectedEventTime, (newValue) => {
  if (newValue) {
    selectedEventTime.value = newValue;
    filterTimeEventData(newValue);
  }
});
</script>

<template>
  <div
    v-if="isLoading"
    class="flex h-screen w-full items-center justify-center"
  >
    <span class="loader"></span>
  </div>
  <div v-else class="relative mx-auto my-28 px-5 lg:my-24 lg:max-w-6xl lg:px-0">
    <!-- Header Event Banner -->
    <div class="relative">
      <button
        class="header-btn-prev absolute left-3 top-1/2 z-40 -translate-y-1/2 rounded-full bg-black/50 p-3 text-light-grey"
        @click="handleSampleEvent('prev')"
      >
        <ArrowIcon class="" />
      </button>
      <NuxtLink
        :to="{
          name: 'event-id',
          params: { id: bannerEventData[sampleEventIndex]?.slug || 1 },
        }"
      >
        <div class="relative h-[500px] w-full rounded-2xl">
          <div class="relative">
            <img
              :src="bannerEventData[sampleEventIndex]?.image"
              alt=""
              class="h-[500px] w-full rounded-2xl object-cover"
            />
            <div class="absolute inset-0 rounded-2xl bg-black opacity-20"></div>
          </div>
          <div class="bg-blak/20 absolute bottom-3 left-3 rounded-lg px-4 py-4">
            <div class="flex gap-1 pb-2">
              <div v-for="tag in bannerEventData[sampleEventIndex]?.tags">
                <NuxtLink :to="{ name: 'events', query: { tag: tag } }">
                  <button
                    class="b4 rounded-sm bg-light-grey px-2 drop-shadow-md"
                  >
                    {{ tag }}
                  </button>
                </NuxtLink>
              </div>
            </div>
            <h1 class="event-name shw t1 line-clamp-2 text-white">
              {{ bannerEventData[sampleEventIndex]?.name }}
            </h1>
            <div class="b3 mt-4 flex gap-2">
              <BtnComp text="Join now" />
            </div>
          </div>
        </div>
      </NuxtLink>
      <button
        @click="handleSampleEvent('next')"
        class="header-btn-next absolute right-3 top-1/2 z-40 -translate-y-1/2 rounded-full bg-black/50 p-3 text-light-grey"
      >
        <ArrowIcon class="rotate-180" />
      </button>
    </div>

    <!-- Recommend Event section -->
    <div class="w-full py-7 lg:pt-16">
      <h1 class="t2">Recommend Event</h1>
      <div class="relative flex w-full items-center justify-between gap-3 py-5">
        <button
          class="recommended-btn-prev left-0 h-fit rounded-full"
          @click="handleReccomEvent('prev')"
        >
          <ArrowIcon class="text-2xl text-black" />
        </button>
        <div class="grid w-full grid-cols-5 gap-3">
          <div
            class="col-span-3 grid h-[200px] gap-3 lg:h-[400px] lg:grid-rows-3"
          >
            <div
              class="row-span-2 flex w-full flex-col justify-between rounded-2xl bg-light-grey p-3 drop-shadow-md lg:p-7"
            >
              <div>
                <div class="flex gap-1 pb-1">
                  <div v-for="tag in recommendedData[reccommentIndex]?.tags">
                    <NuxtLink :to="{ name: 'events', query: { tag: tag } }">
                      <button
                        class="b4 rounded-md border border-dark-grey/60 px-4 drop-shadow-md duration-200 hover:bg-dark-grey/20"
                      >
                        {{ tag }}
                      </button>
                    </NuxtLink>
                  </div>
                </div>
                <h3 class="reccom-name b1 line-clamp-1 font-semibold">
                  {{ recommendedData[reccommentIndex]?.name }}
                </h3>

                <p
                  class="reccom-detail b2 line-clamp-2 lg:line-clamp-[4] lg:pt-2"
                >
                  {{ recommendedData[reccommentIndex]?.detail }}
                </p>
              </div>

              <NuxtLink
                :to="{
                  name: 'event-id',
                  params: { id: recommendedData[reccommentIndex]?.slug || 0 },
                }"
                class="col-span-2"
              >
                <BtnComp text="Registor now" color="red" />
              </NuxtLink>
            </div>
            <div
              class="row-span-1 hidden w-full grid-cols-3 place-content-center gap-10 rounded-2xl bg-black p-7 text-light-grey drop-shadow-md lg:grid"
            >
              <div class="flex flex-col gap-1">
                <Calendar />
                <div>
                  <p class="b3 font-semibold">When</p>

                  <p
                    v-if="recommendedData[reccommentIndex]"
                    class="reccom-when b4"
                  >
                    <span>{{
                      useFormatDateTime(
                        new Date(recommendedData[reccommentIndex]?.start_date),
                        'date'
                      )
                    }}</span>
                    <br />

                    <span
                      v-if="
                        useFormatDateTime(
                          new Date(recommendedData[reccommentIndex]?.end_date),
                          'date'
                        ) !==
                        useFormatDateTime(
                          new Date(
                            recommendedData[reccommentIndex]?.start_date
                          ),
                          'date'
                        )
                      "
                    >
                      -
                      {{
                        useFormatDateTime(
                          new Date(recommendedData[reccommentIndex]?.end_date),
                          'date'
                        )
                      }}</span
                    >
                  </p>
                </div>
              </div>
              <div class="flex flex-col gap-1">
                <Location />
                <div>
                  <p class="b3 font-semibold">Where</p>
                  <p class="b4 reccom-where line-clamp-2">
                    {{ recommendedData[reccommentIndex]?.location }}
                  </p>
                </div>
              </div>
              <div class="flex flex-col gap-1">
                <Organisation />
                <div>
                  <p class="b3 font-semibold">Who</p>
                  <p class="b4 reccom-who">
                    {{ recommendedData[reccommentIndex]?.owner }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="col-span-2 w-full drop-shadow-md">
            <img
              :src="recommendedData[reccommentIndex]?.image"
              alt=""
              class="h-[200px] w-full rounded-2xl object-cover lg:h-[400px]"
            />
          </div>
          <div
            class="col-span-5 row-span-1 grid w-full grid-cols-3 place-content-center gap-3 rounded-2xl bg-black p-3 text-light-grey drop-shadow-md lg:hidden"
          >
            <div class="flex flex-col gap-1">
              <Calendar class="b3" />
              <div>
                <p class="b3 font-semibold">When</p>

                <p
                  v-if="recommendedData[reccommentIndex]"
                  class="reccom-when-mb b4"
                >
                  <span>{{
                    useFormatDateTime(
                      new Date(recommendedData[reccommentIndex]?.start_date),
                      'date'
                    )
                  }}</span>
                  <br />

                  <span
                    v-if="
                      useFormatDateTime(
                        new Date(recommendedData[reccommentIndex]?.end_date),
                        'date'
                      ) !==
                      useFormatDateTime(
                        new Date(recommendedData[reccommentIndex]?.start_date),
                        'date'
                      )
                    "
                  >
                    -
                    {{
                      useFormatDateTime(
                        new Date(recommendedData[reccommentIndex]?.end_date),
                        'date'
                      )
                    }}</span
                  >
                </p>
              </div>
            </div>
            <div class="flex flex-col gap-1">
              <Location class="b3" />
              <div>
                <p class="b3 font-semibold">Where</p>
                <p class="b4 reccom-where-mb line-clamp-2">
                  {{ recommendedData[reccommentIndex]?.location }}
                </p>
              </div>
            </div>
            <div class="flex flex-col gap-1">
              <Organisation class="b3" />
              <div>
                <p class="b3 font-semibold">Who</p>
                <p class="b4 reccom-who-mb">
                  {{ recommendedData[reccommentIndex]?.owner }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <button
          class="recommended-btn-next right-0 h-fit rounded-full"
          @click="handleReccomEvent('next')"
        >
          <ArrowIcon class="rotate-180 text-2xl text-black" />
        </button>
      </div>
    </div>
    <!-- Event List section -->
    <div id="time-list" class="w-full py-7">
      <ExploreBar
        :is-show-sort="false"
        @handle-select-time="handleSelectTime"
        :selectedEventTime
      />
      <h1 class="time-title t2 py-4">
        {{
          selectedEventTime === 'today'
            ? `Today, ${useFormatDateTime(new Date(), 'fullDate').slice(0, 6)}`
            : 'Upcomming'
        }}
      </h1>
      <div class="relative">
        <div
          class="absolute left-0 top-0 z-20 h-full w-6 bg-gradient-to-r from-white"
        ></div>
        <div class="w-full overflow-x-auto px-4 pb-5">
          <div class="pt-14" v-if="filteredTimeData?.length === 0">
            <p class="no-card-message b2">
              No
              {{
                selectedEventTime === 'today'
                  ? 'events today'
                  : 'upcoming events'
              }}
            </p>
          </div>
          <div id="time-list-card" v-else class="flex h-full w-full gap-3">
            <div v-for="event in filteredTimeData">
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
        <div v-for="tag in tagsData" :key="tag.tag_id">
          <NuxtLink :to="{ name: 'events', query: { tag: tag.tag_title } }">
            <button
              class="flex h-[40px] w-[110px] items-center gap-3 rounded-md bg-light-grey p-3 drop-shadow-md duration-200 hover:bg-grey lg:h-[60px] lg:w-[160px]"
            >
              <div
                :style="{ backgroundColor: tag.tag_code }"
                class="h-full w-[5px] rounded"
              ></div>
              <span class="b3 ml-2 font-semibold">{{ tag.tag_title }}</span>
            </button>
          </NuxtLink>
        </div>
      </div>
    </div>
    <!-- Explore Date section -->
    <div id="explore-date" class="w-full py-7">
      <h1 class="explore-title t2 py-3">Explore by date</h1>
      <div class="flex w-full gap-8">
        <div class="w-full">
          <div v-if="Object.keys(filterExploreDate).length === 0">
            <p class="no-explore-message b1 mt-8">
              There are no events during this period
            </p>
          </div>
          <div
            v-else
            class="flex w-full gap-4"
            v-for="(events, date) in filterExploreDate"
            :key="date"
          >
            <div class="flex flex-col">
              <div class="my-4 h-3 w-3 rounded-full bg-zinc-200"></div>
              <div class="h-full translate-x-1/2 border-l-[1px]"></div>
            </div>
            <div>
              <p class="b2 w-full py-2 font-semibold">
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

        <div class="DatePicker sticky top-28 hidden self-start lg:block">
          <DatePicker v-model="today" mode="date" />
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
