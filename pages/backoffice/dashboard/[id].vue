<script setup lang="ts">
import * as d3 from 'd3';
import { ref, onMounted } from 'vue';
import Star from '~/components/icons/Star.vue';
import RegisPeople from '~/components/icons/RegisPeople.vue';
import AllViews from '~/components/icons/AllViews.vue';
import AvgViews from '~/components/icons/AvgViews.vue';
import Bookmark from '~/components/icons/Bookmark.vue';
import type { Registration } from '~/models/registration';

definePageMeta({
  layout: 'backoffice',
});

const demoAgeData = [
  {
    ageRange: '15-19',
    male: 25,
    female: 30,
    preferNotToSay: 5,
  },
  {
    ageRange: '20-25',
    male: 40,
    female: 35,
    preferNotToSay: 10,
  },
  {
    ageRange: '26-30',
    male: 50,
    female: 45,
    preferNotToSay: 8,
  },
  {
    ageRange: '31-35',
    male: 30,
    female: 50,
    preferNotToSay: 12,
  },
];

const findMaxValuesAndOverallMax = (data: typeof demoAgeData) => {
  const maxValues = {
    male: 0,
    female: 0,
    preferNotToSay: 0,
  };

  let overallMax = 0;

  data.forEach((item) => {
    maxValues.male = Math.max(maxValues.male, item.male);
    maxValues.female = Math.max(maxValues.female, item.female);
    maxValues.preferNotToSay = Math.max(
      maxValues.preferNotToSay,
      item.preferNotToSay
    );

    overallMax = Math.max(
      overallMax,
      item.male,
      item.female,
      item.preferNotToSay
    );
  });

  return { maxValues, overallMax };
};

const calculateWidth = (
  allData: { day: string; count: number; date: string }[],
  data: Number
) => {
  if (!Array.isArray(allData)) return 0;
  console.log('allData', allData);

  const max = Math.max(...allData.map((item) => item.count)) * 1.25;
  const width = (data * 100) / max;
  console.log(width);

  return width;
};

const result = findMaxValuesAndOverallMax(demoAgeData);

const chartsData = [
  { label: 'Female', value: 30, color: '#989898' },
  { label: 'Male', value: 40, color: '#D71515' },
  { label: 'No Prefer', value: 10, color: '#CCCCCC' },
];

const checkInData = [
  { label: 'Pending', value: 30, color: '#989898' },
  { label: 'Going', value: 40, color: '#D71515' },
  { label: 'Checked In', value: 10, color: '#CCCCCC' },
];

const generateConicGradient = (data: typeof chartsData) => {
  let total = data.reduce((sum, item) => sum + item.value, 0);
  let currentPercentage = 0;

  return data
    .map((item) => {
      const startPercentage = currentPercentage;
      const endPercentage = currentPercentage + (item.value / total) * 100;
      currentPercentage = endPercentage;
      return `${item.color} ${startPercentage}% ${endPercentage}%`;
    })
    .join(', ');
};

const goals = 20;

const conicGradientStyle = `conic-gradient(${generateConicGradient(chartsData)})`;
const getLast7DaysData = (data) => {
  const last7Days = data
    .sort(
      (a, b) =>
        new Date(b.view_date).toLocaleDateString('en-US', {
          timeZone: 'Asia/Bangkok',
        }) -
        new Date(a.view_date).toLocaleDateString('en-US', {
          timeZone: 'Asia/Bangkok',
        })
    )
    .slice(0, 7)
    .sort(
      (a, b) =>
        new Date(a.view_date).toLocaleDateString('en-US', {
          timeZone: 'Asia/Bangkok',
        }) -
        new Date(b.view_date).toLocaleDateString('en-US', {
          timeZone: 'Asia/Bangkok',
        })
    )
    .map((item) => {
      const day = new Date(item.view_date).toLocaleDateString('en-US', {
        weekday: 'short',
        timeZone: 'Asia/Bangkok',
      });
      return {
        day,
        count: item.view_count,
        date: new Date(item.view_date).toLocaleDateString('en-US', {
          timeZone: 'Asia/Bangkok',
        }),
      };
    });

  return last7Days;
};

const last7DayData = ref();
const maxForLast7Day = ref(0);
const viewsData = ref();
const totalViewCount = ref(0);
const fetchData = async () => {
  try {
    const fetchedData = await useFetchData(`v1/views/2`);
    viewsData.value = fetchedData || [];
    console.log(viewsData.value);

    totalViewCount.value = viewsData.value.reduce(
      (sum, record) => sum + record.view_count,
      0
    );
    console.log(totalViewCount.value);
    last7DayData.value = getLast7DaysData(viewsData.value);
    console.log(last7DayData.value);
    const max = Math.max(...last7DayData.value.map((item) => item.count)); // Find the max value
    maxForLast7Day.value = max;
    console.log('max', maxForLast7Day.value);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
const route = useRoute();
const param = route.params.id;
const registrationsData = ref<Registration[]>([]);
const isLoading = ref(true);

const fetchRegisData = async () => {
  console.log(param);

  const fetchedData = await useFetchData(`v1/registrations/event/${param}`);
  registrationsData.value = fetchedData || [];
  console.log('regis', registrationsData.value);
  const groupedByGender = d3.rollup(
    registrationsData.value,
    (v) => v.length, // Count the number of entries for each gender
    (d) => d.gender // Group by the "gender" field
  );

  console.log(groupedByGender); // This will output: Map(2) { 'Female' => 1, 'Male' => 1 }
};

onMounted(() => {
  try {
    isLoading.value = true;
    fetchRegisData();
  } finally {
    isLoading.value = false;
  }
});
onMounted(() => {
  fetchData();
});
</script>

<template>
  <div class="ml-80 flex h-full w-screen">
    <div class="mx-20 mt-32 flex w-full flex-col gap-3">
      <h1 class="t1">Event name</h1>
      <div class="grid w-full grid-cols-4 gap-3">
        <div
          class="col-span-1 flex h-24 w-full items-center justify-between rounded-[20px] bg-zinc-100 p-3 px-6"
        >
          <p class="text-2xl font-semibold">Hi, User007</p>
        </div>
        <div class="col-span-3 flex gap-3">
          <div
            class="flex h-24 w-full items-center justify-between rounded-[20px] bg-zinc-100 p-3 px-6"
          >
            <RegisPeople class="text-5xl" />
            <div>
              <p class="text-2xl font-semibold">
                {{ registrationsData?.length }}
              </p>
              <p>Registrations</p>
            </div>
          </div>
          <div
            class="flex h-24 w-full items-center justify-between rounded-[20px] bg-zinc-100 p-3 px-6"
          >
            <AllViews class="text-5xl" />
            <div>
              <p class="text-2xl font-semibold">{{ totalViewCount }}</p>
              <p>Views</p>
            </div>
          </div>
          <div
            class="flex h-24 w-full items-center justify-between rounded-[20px] bg-zinc-100 p-3 px-6"
          >
            <AvgViews class="text-5xl" />
            <div>
              <p class="text-2xl font-semibold">
                {{ Math.floor(totalViewCount / viewsData?.length) }}
                <span class="text-sm font-normal">per day</span>
              </p>
              <p>Views</p>
            </div>
          </div>
          <div
            class="flex h-24 w-full items-center justify-between rounded-[20px] bg-zinc-100 p-3 px-6"
          >
            <Bookmark class="text-5xl" />
            <div>
              <p class="text-2xl font-semibold">240</p>
              <p>Favorite</p>
            </div>
          </div>
        </div>
      </div>
      <div class="grid h-full grid-cols-10 gap-3">
        <div
          class="col-span-6 flex flex-col gap-5 rounded-[20px] bg-zinc-100 px-8 py-5"
        >
          <h1 class="text-2xl font-semibold">Engagement</h1>
          <div class="flex gap-16">
            <div class="flex flex-col justify-between">
              <p>{{ Math.round(maxForLast7Day * 1.25) }}</p>
              <p>{{ Math.round(maxForLast7Day * 1.25 * 0.75) }}</p>
              <p>{{ Math.round(maxForLast7Day * 1.25 * 0.5) }}</p>
              <p>{{ Math.round(maxForLast7Day * 1.25 * 0.25) }}</p>
              <p>{{ 0 }}</p>
              <!-- This ensures the bottom starts from 0 -->
            </div>

            <div class="flex w-full items-end justify-between self-end">
              <div
                v-for="data in last7DayData"
                class="flex h-52 w-[40px] items-end justify-end rounded-lg bg-gray-200"
              >
                <div
                  class="flex w-full items-end justify-end rounded-b-lg bg-black-1"
                  :style="{
                    height: `${calculateWidth(last7DayData, data.count)}%`,
                  }"
                ></div>
                {{ data.day }}
              </div>
            </div>
          </div>
        </div>
        <div
          class="col-span-4 mx-auto flex w-full gap-2 rounded-[20px] bg-zinc-100 p-5"
        >
          <div
            class="col-span-4 mx-auto flex h-full w-full flex-col items-center justify-center gap-10 rounded-[20px] bg-zinc-100 p-5"
          >
            <p class="t3 self-start">Registration</p>

            <div class="relative">
              <div
                class="pie-chart"
                :style="{
                  background: `conic-gradient(#D71515 0% ${(registrationsData?.length / goals) * 100 - 0.01}%, #e0e0e0 ${(registrationsData?.length / goals) * 100}%)`,
                }"
              ></div>
              <div
                class="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
              >
                <div
                  class="flex h-full w-full flex-col items-center justify-center text-center"
                >
                  <p class="t2">75%</p>
                  <p>of Goals</p>
                </div>
              </div>
            </div>

            <p class="t3">
              <span class="text-burgundy">{{ registrationsData?.length }}</span>
              from 300 Registration
            </p>
          </div>
        </div>
      </div>
      <div class="grid h-[350px] grid-cols-12 gap-3">
        <div class="col-span-4 flex flex-col gap-2 rounded-[20px] bg-zinc-100">
          <div
            class="col-span-4 mx-auto flex h-full w-full flex-row items-center justify-center gap-10 rounded-[20px] bg-zinc-100 p-5"
          >
            <div class="relative">
              <div
                class="pie-chart"
                :style="{ background: conicGradientStyle }"
              ></div>
              <div
                class="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
              ></div>
            </div>

            <div>
              <ul class="legend">
                <li v-for="(data, index) in chartsData" :key="index">
                  <span
                    :style="{ backgroundColor: data.color }"
                    class="legend-color"
                  ></span>
                  {{ data.label }}: {{ data.value }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div
          class="col-span-4 flex flex-col gap-4 rounded-[20px] bg-zinc-100 px-8 py-5"
        >
          <h1 class="text-2xl font-semibold">Registor Demographics</h1>
          <div v-for="data in demoAgeData">
            <div class="flex items-center gap-5">
              <p>{{ data.ageRange }}</p>
              <div class="flex w-52 flex-col gap-1">
                <div
                  class="h-5 rounded-md bg-[#989898]"
                  :style="{
                    width: `${calculateWidth(data.male, result.overallMax)}%`,
                  }"
                ></div>
                <div
                  class="h-5 rounded-md bg-[#CCCCCC]"
                  :style="{
                    width: `${calculateWidth(data.female, result.overallMax)}%`,
                  }"
                ></div>
                <div
                  class="h-5 rounded-md bg-[#D71515]"
                  :style="{
                    width: `${calculateWidth(data.preferNotToSay, result.overallMax)}%`,
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-span-4 flex flex-col gap-3">
          <div class="flex flex-col gap-2 rounded-[20px] bg-zinc-100 p-6">
            <p>Check-In</p>
            <div class="flex h-6 w-full bg-zinc-200">
              <div class="w-10 bg-burgundy"></div>
              <div class="w-4 bg-zinc-500"></div>
              <div class="w-10 bg-zinc-300"></div>
            </div>
            <div>
              <ul class="legend">
                <li v-for="(data, index) in checkInData" :key="index">
                  <span
                    :style="{ backgroundColor: data.color }"
                    class="legend-color"
                  ></span>
                  {{ data.label }}: {{ data.value }}
                </li>
              </ul>
            </div>
          </div>
          <div
            class="flex flex-col items-center justify-center gap-2 rounded-[20px] bg-zinc-100 p-6"
          >
            <Star class="fill-burgundy text-[150px]" />
            <div class="text-center">
              <p class="text-4xl">4.7</p>
              <p>Average feedback score</p>
            </div>
            <button class="flex items-end justify-end self-end">
              more feedback details
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pie-chart {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.legend {
  list-style: none;
  padding: 0;
  margin: 0;
}

.legend li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}
</style>
