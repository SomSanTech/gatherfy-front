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
import type { Tag } from '~/models/tag';
import ExploreBar from '~/components/ExploreBar.vue';
import scrollama from 'scrollama';

const today = ref(new Date());
const eventData = ref<Event[]>([]);
const recommendedData = ref<Event[]>([]);
const bannerEventData = ref<Event[]>([]);
const tagsData = ref<Tag[]>([]);
const isFirstClickSampleEvent = ref(false);
const reccommentIndex = ref(0);
const sampleEventIndex = ref(0);
const selectedEventTime = ref('today');
const isLoading = useState('isLoading');
const isScroll = useState('isScroll');
const filteredTimeData = ref();
const scrollContainer = ref(null);
const reccomRef = ref();
const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
let intervalId = null;
let scrollDirection = 1;
let scroller;

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

const fetchData = async () => {
  const fetchedData = await useFetchData<Event[]>('v1/events', 'GET');
  const fetchTagData = await useFetchData<Tag[]>('v1/tags', 'GET');
  const fetchRecommendedData = await useFetchData<Event[]>(
    'v1/events/recommended',
    'GET'
  );
  eventData.value = fetchedData.data || [];
  tagsData.value = fetchTagData.data || [];
  recommendedData.value = fetchRecommendedData.data || [];
  const currentDate = new Date().getTime();
  bannerEventData.value = eventData.value
    .filter((event) => new Date(event.ticket_end_date).getTime() > currentDate)
    .sort(
      (a: Event, b: Event) =>
        new Date(a.ticket_start_date).getTime() -
        new Date(b.ticket_start_date).getTime()
    )
    .slice(0, 5);
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

const handleSelectTime = (time: string) => {
  selectedEventTime.value = time;
};
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

  filter.sort((a, b) => {
    return (
      new Date(a?.start_date)?.getTime() - new Date(b?.start_date)?.getTime()
    );
  });

  filteredTimeData.value = filter;
};

const pauseScroll = () => clearInterval(intervalId);

const resumeScroll = () => {
  intervalId = setInterval(() => {
    const el = scrollContainer.value;
    if (el) {
      el.scrollLeft += 2 * scrollDirection;

      if (el.scrollLeft + el.clientWidth >= el.scrollWidth) {
        scrollDirection = -1;
      }
      if (el.scrollLeft <= 0) {
        scrollDirection = 1;
      }
    }
  }, 20);
};

const scrollToRecommendEvent = () => {
  reccomRef.value?.scrollIntoView({ behavior: 'smooth' });
};

watch([today], ([newToday]) => {
  filterExploreDate.value;
});

watch(selectedEventTime, (newValue) => {
  if (newValue) {
    selectedEventTime.value = newValue;
    filterTimeEventData(newValue);
  }
});

onMounted(async () => {
  try {
    isLoading.value = true;
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

onMounted(() => {
  intervalId = setInterval(() => {
    const el = scrollContainer.value;
    if (el) {
      el.scrollLeft += 2 * scrollDirection;

      if (el.scrollLeft + el.clientWidth >= el.scrollWidth) {
        scrollDirection = -1;
      }
      if (el.scrollLeft <= 0) {
        scrollDirection = 1;
      }
    }
  }, 20);
});

onUnmounted(() => {
  clearInterval(intervalId);
});

onMounted(() => {
  if (process.client) {
    setTimeout(() => {
      const steps = document.getElementById('reccom');
      scroller = scrollama();

      scroller
        .setup({
          step: '.step',
          offset: 0.9,
          debug: false,
        })
        .onStepEnter((response) => {
          isScroll.value = false;
        })
        .onStepExit((response) => {
          isScroll.value = true;
        });

      window.addEventListener('resize', scroller.resize);
    }, 1000);
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', scroller.resize);
});

const activeIndex = ref(0);
// let intervalId = null;

onMounted(() => {
  intervalId = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % bannerEventData.value.length;
  }, 3000); // Every 3 seconds
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});

const isDragging = ref(false);
const dragStartX = ref(0);
const dragCurrentX = ref(0);
const offsetX = ref(0);

// Function to stop the auto slideshow when the user starts dragging
function startDrag(e) {
  isDragging.value = true;
  if (intervalId) {
    clearInterval(intervalId); // Stop the automatic slideshow
  }
  dragStartX.value = e.type.includes('touch')
    ? e.touches[0].clientX
    : e.clientX;
  dragCurrentX.value = dragStartX.value;
}

// Function to track dragging and calculate offset
function onDragging(e) {
  if (!isDragging.value) return;
  if (intervalId) {
    clearInterval(intervalId); // Stop the automatic slideshow
  }
  dragCurrentX.value = e.type.includes('touch')
    ? e.touches[0].clientX
    : e.clientX;
  offsetX.value = dragCurrentX.value - dragStartX.value;
}

// Function to handle when dragging ends
function endDrag() {
  if (!isDragging.value) return;

  const threshold = 50; // Threshold for swipe sensitivity
  if (offsetX.value > threshold) {
    activeIndex.value =
      (activeIndex.value - 1 + bannerEventData.value.length) %
      bannerEventData.value.length;
  } else if (offsetX.value < -threshold) {
    activeIndex.value = (activeIndex.value + 1) % bannerEventData.value.length;
  }

  offsetX.value = 0;
  isDragging.value = false;

  // Restart the interval after drag ends
  intervalId = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % bannerEventData.value.length;
  }, 3000); // Resume automatic slideshow after drag
}
</script>

<template>
  <Loader v-if="isLoading" />

  <div
    v-else
    :class="isLoading ? 'opacity-0' : 'opacity-100'"
    class="y-28 lg:y-24 relative mx-auto"
  >
    <!-- Banner section -->
    <!-- <div
      id="reccom"
      class="step bg-dak relative flex h-screen !p-0 flex-col lg:items-end lg:justify-end justify-center gap-5 pb-20 pl-5 pr-5 text-dark lg:flex-row"
    >
      <div
        class="pointer-events-none absolute inset-0 z-0 bg-gradient-to-b from-dark/20 to-transparent"
      ></div>
      <transition name="fade-slide" class="w-fit px-5 lg:px-0">
        <div
          v-if="!isScroll"
          class="flex w-fit cursor-pointer items-end justify-end gap-2 self-end lg:gap-5"
          @click="scrollToRecommendEvent"
        >
          <ArrowDown
            class="translate-y-2 -rotate-90 self-end text-[64px] sm:text-[160px]"
          />
          <p class="w-fit text-end text-[40px] sm:text-[100px] lg:text-start">
            Explore event
          </p>
        </div>
      </transition>

      <div
        ref="scrollContainer"
        @mouseenter="pauseScroll"
        @mouseleave="resumeScroll"
        class="px-5 lg:px-0 hide-scrollbar flex w-full gap-5 overflow-x-auto scroll-smooth sm:gap-10"
      >
        <div
          v-for="data in bannerEventData"
          class="flex-shrink-0 cursor-pointer"
        >
          <NuxtLink :to="{ name: 'event-id', params: { id: data?.slug } }">
            <div
              class="relative flex h-full w-full items-end gap-5 rounded-2xl drop-shadow-xl"
            >
              <div class="relative flex h-full flex-col justify-end">
                <div
                  class="pointer-events-none absolute h-full w-full bg-black/20"
                ></div>
                <img
                  :src="data?.image"
                  alt=""
                  :class="[
                    'h-[300px] shrink-0 object-cover transition-all duration-1000 sm:h-[500px]',
                    isScroll
                      ? 'min-w-[90vw] max-w-[90vw] sm:min-w-[1000px] sm:max-w-[1000px]'
                      : 'min-w-[75vw] max-w-[75vw] sm:min-w-[500px] sm:max-w-[500px]',
                  ]"
                />
                <div class="absolute right-3 top-3 flex gap-1">
                  <div
                    v-for="tag in data?.tags"
                    class="rounded-lg bg-white/30 px-3 py-1 text-xs text-white backdrop-blur sm:text-sm"
                  >
                    {{ tag.tag_title }}
                  </div>
                </div>

                <div
                  class="absolute left-3 top-3 aspect-square h-[20%] rounded-br-3xl rounded-tl-3xl bg-white/20 p-2 backdrop-blur-sm sm:h-1/4 sm:p-3"
                >
                  <p class="b3 !text-3xl text-white sm:!text-7xl">
                    {{ new Date(data?.start_date).getDate() }}
                    <span
                      class="b1 absolute bottom-1 right-1 text-xl sm:bottom-3 sm:right-3 sm:text-2xl"
                    >
                      {{ monthNames[new Date(data?.start_date).getMonth()] }}
                    </span>
                  </p>
                </div>

                <div
                  class=":w-fit absolute bottom-3 right-3 max-w-[75%] rounded-br-2xl rounded-tl-2xl bg-white/20 p-2 text-end backdrop-blur-sm sm:p-3 lg:w-[90%] lg:max-w-[90%]"
                >
                  <p
                    style="
                      -webkit-line-clamp: 2;
                      display: -webkit-box;
                      -webkit-box-orient: vertical;
                    "
                    class="b3 overflow-hidden text-base text-white sm:!text-3xl"
                  >
                    {{ data.name }}
                  </p>
                </div>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div> -->

    <div
      id="reccom"
      ref="scrollContiner"
      class="step relative flex h-screen w-full flex-col items-center justify-center gap-14 overflow-hidden"
    >
      <div class="flex w-full items-center justify-center p-4 pt-32 lg:pt-32">
        <div class="flex flex-col items-center text-center">
          <p class="t1">Discover Unmissable Events Near You</p>
          <button
            @click="scrollToRecommendEvent"
            class="b2 mt-4 flex items-center gap-1 rounded-xl border-[1px] border-dark px-6 py-2 text-dark transition-all"
          >
            Explore event <ArrowDown class="rotate-180" />
          </button>
        </div>
      </div>
      <div
        @mousedown="startDrag"
        @mousemove="onDragging"
        @mouseup="endDrag"
        @mouseleave="endDrag"
        @touchstart="startDrag"
        @touchmove="onDragging"
        @touchend="endDrag"
        class="items- relative flex h-full w-full justify-center overflow-hidden"
      >
        <div
          v-for="(data, index) in bannerEventData"
          :key="data.slug"
          :style="{
            transform: `
    translateX(${(index - activeIndex) * 18 + (index === activeIndex ? offsetX : 0)}px)
    scale(${1 - Math.abs(index - activeIndex) * 0.05})
    rotate(${(index - activeIndex) * 3}deg)
  `,
            zIndex: bannerEventData.length - Math.abs(index - activeIndex),
            transition: isDragging ? 'none' : 'transform 0.8s ease',
          }"
          class="absolute"
        >
          <NuxtLink
            :prefetch="false"
            :to="{ name: 'event-id', params: { id: data?.slug } }"
          >
            <div
              class="relative flex h-[390px] w-[250px] items-end overflow-hidden rounded-2xl bg-white shadow-2xl sm:h-[400px] sm:w-[850px]"
            >
              <div class="absolute inset-0 bg-black/20"></div>

              <img
                :src="data?.image"
                alt=""
                class="h-full w-full object-cover"
              />

              <!-- Tag -->
              <div
                class="absolute right-3 top-3 flex flex-col gap-1 lg:flex-row lg:gap-2"
              >
                <div
                  v-for="tag in data?.tags"
                  :key="tag.tag_title"
                  class="b2 rounded-lg bg-white/30 px-3 py-1 text-white backdrop-blur"
                >
                  {{ tag.tag_title }}
                </div>
              </div>

              <!-- Date -->
              <div
                class="absolute left-3 top-3 aspect-square h-16 rounded-br-2xl rounded-tl-2xl bg-white/30 p-2 leading-3 backdrop-blur sm:h-20"
              >
                <p class="b1 !text-[30px] leading-tight text-white">
                  {{ new Date(data?.start_date).getDate() }}
                  <span class="b2 block text-end">
                    {{ monthNames[new Date(data?.start_date).getMonth()] }}
                  </span>
                </p>
              </div>

              <!-- Name -->
              <div
                class="absolute bottom-3 right-3 w-[70%] rounded-br-2xl rounded-tl-2xl bg-white/20 p-2 text-end backdrop-blur lg:w-fit"
              >
                <p class="b1 line-clamp-2 text-white">
                  {{ data.name }}
                </p>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Recommend Event section -->
    <div
      ref="reccomRef"
      class="mx-auto min-h-[100px] w-full px-5 py-7 lg:max-w-6xl lg:px-0 lg:pt-24"
    >
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
                    <NuxtLink
                      :to="{ name: 'events', query: { tag: tag.tag_title } }"
                    >
                      <button
                        class="b4 rounded-md border border-dark-grey/60 px-4 drop-shadow-md duration-200 hover:bg-dark-grey/20"
                      >
                        {{ tag.tag_title }}
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
              class="row-span-1 hidden w-full grid-cols-3 place-content-center gap-10 rounded-2xl bg-dark p-7 text-light-grey drop-shadow-md lg:grid"
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
    <div id="time-list" class="mx-auto w-full px-5 py-7 lg:max-w-6xl lg:px-0">
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
          class="absolute -left-1 top-0 z-20 h-full w-6 bg-gradient-to-r from-white"
        ></div>
        <div class="w-full overflow-x-auto px-4 pb-5">
          <div class="pt-14" v-if="filteredTimeData?.length === 0">
            <p class="no-card-message b2 lg:py-24">
              No
              {{
                selectedEventTime === 'today'
                  ? 'events today'
                  : 'upcoming events'
              }}
            </p>
          </div>
          <div id="time-list-card" v-else class="flex h-full w-full gap-3 py-4">
            <div v-for="event in filteredTimeData">
              <NuxtLink :to="{ name: 'event-id', params: { id: event?.slug } }">
                <EventListCard :eventDetail="event" :isVertical="true" />
              </NuxtLink>
            </div>
          </div>
        </div>
        <div
          class="absolute -right-1 top-0 z-20 h-full w-10 bg-gradient-to-l from-white"
        ></div>
      </div>
    </div>

    <!-- Tags section -->
    <div class="mx-auto px-5 py-7 lg:max-w-6xl lg:px-0">
      <h1 class="t1 py-3">Tags</h1>
      <div class="flex flex-wrap gap-2">
        <div v-for="tag in tagsData" :key="tag.tag_id" class="group">
          <NuxtLink :to="{ name: 'events', query: { tag: tag.tag_title } }">
            <button
              class="group flex items-center gap-3 rounded-md bg-light-grey p-4 drop-shadow-md duration-200 hover:bg-grey"
            >
              <Entertainment
                v-if="tag.tag_title.includes('Entertainment')"
                :class="`group-hover:stroke-[${tag.tag_code}] group-hover:text-[${tag.tag_code}]`"
              />
              <Music v-if="tag.tag_title === 'Music'" />
              <Technology v-if="tag.tag_title === 'Technology'" />
              <Sports v-if="tag.tag_title === 'Sports'" />
              <Art
                v-if="tag.tag_title === 'Art'"
                :class="`group-hover:stroke-[${tag.tag_code}] group-hover:fill -[${tag.tag_code}]`"
              />
              <Workshop v-if="tag.tag_title === 'Workshop'" />
              <span class="b3 font-semibold">{{ tag.tag_title }}</span>
            </button>
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Explore Date section -->
    <div
      id="explore-date"
      class="mx-auto w-full px-5 py-7 lg:max-w-6xl lg:px-0"
    >
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
          <DatePicker v-model="today" mode="date" color="red" />
        </div>
      </div>
    </div>

    <!-- Footer section -->
    <footer class="mt-20 bg-dark text-light-grey">
      <div
        class="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-6 py-12 md:grid-cols-3"
      >
        <div>
          <button
            class="go-home-btn league-gothic text-2xl uppercase text-red-800 lg:text-4xl"
          >
            Gatherfy
          </button>
          <p class="b2 text-gray-400">
            Making events easier, one click at a time.
          </p>
        </div>

        <div>
          <h3 class="b1 mb-4 font-semibold">Quick Links</h3>
          <ul class="b2 space-y-2 text-gray-300">
            <li>
              <NuxtLink to="/">
                <a href="/" class="hover:text-white">Home</a>
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="{ name: 'events' }">
                <a href="/about" class="hover:text-white">Events</a>
              </NuxtLink>
            </li>
          </ul>
        </div>

        <div>
          <h3 class="b1 mb-4 font-semibold">Follow Us</h3>
          <div class="b2 flex gap-4">
            <a
              href="mailto:gatherfy.somsantech@gmail.com"
              class="flex items-center gap-2 fill-light-grey hover:text-white"
            >
              <Gmail />
              <i class="fab fa-facebook-f">gatherfy.somsantech@gmail.com</i>
            </a>
            <!-- <a href="#" class="text-gray-400 hover:text-white">
              <i class="fab fa-twitter"></i>
              
            </a>
            <a href="#" class="text-gray-400 hover:text-white">
              <i class="fab fa-instagram"></i>
            </a> -->
          </div>
        </div>
      </div>

      <div class="mt-8 border-t border-gray-700">
        <div
          class="b3 mx-auto flex max-w-7xl flex-col justify-between px-6 py-4 text-gray-500 md:flex-row"
        >
          <p>&copy; 2025 Gatherfy. All rights reserved.</p>
          <!-- <p>
            <a href="/privacy" class="hover:text-white">Privacy Policy</a> ·
            <a href="/terms" class="hover:text-white">Terms of Service</a>
          </p> -->
        </div>
      </div>
    </footer>
  </div>
</template>

<style>
.shw {
  text-shadow: 1px 1px 6px rgb(0 0 0 / 45%);
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
