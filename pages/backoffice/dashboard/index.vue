<script setup lang="ts">
import { ref, onMounted } from 'vue';
import RegisPeople from '~/components/icons/RegisPeople.vue';
import AllViews from '~/components/icons/AllViews.vue';
import AvgViews from '~/components/icons/AvgViews.vue';
import Bookmark from '~/components/icons/Bookmark.vue';
import Chart from 'chart.js/auto';
import EventList from '~/components/backoffice/EventList.vue';
import type { Event } from '~/models/event';
import type { User } from '~/models/user';

definePageMeta({
  layout: 'backoffice',
});

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
const data1 = [65, 59, 80, 81, 56, 55, 40];
const data2 = [28, 48, 40, 19, 86, 27, 90];

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

const calculateWidth = (data: Number, max: Number) => {
  const width = (data * 100) / max;
  return width;
};

const result = findMaxValuesAndOverallMax(demoAgeData);

const chartData = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: data1,
      borderColor: '#D71515',
      backgroundColor: '#D71515',
      yAxisID: 'y',
    },
    {
      label: 'Dataset 2',
      data: data2,
      borderColor: '#989898',
      backgroundColor: '#989898',
      yAxisID: 'y1',
    },
  ],
};

const chartCanvas = ref<HTMLCanvasElement | null>(null);

onMounted(() => {
  if (chartCanvas.value) {
    new Chart(chartCanvas.value, {
      type: 'line',
      data: chartData,
      options: {
        responsive: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        stacked: false,
        plugins: {
          legend: {
            display: false,
            position: 'top',
          },
          title: {
            display: false,
            text: 'Chart.js Line Chart - Multi Axis',
          },
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: {
              drawOnChartArea: false,
            },
          },
        },
      },
    });
  }
});
const genderData = [
  { label: 'Female', value: 30, color: '#989898' },
  { label: 'Male', value: 40, color: '#D71515' },
  { label: 'No Prefer', value: 10, color: '#CCCCCC' },
];

const generateConicGradient = (data: typeof genderData) => {
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

const conicGradientStyle = `conic-gradient(${generateConicGradient(genderData)})`;

const eventsData = ref<Event[]>([]);
const adminData = ref<User | null>(null);
const isLoading = ref(true);

const fetchData = async () => {
  const fetchedData = await useFetchData(
    `v1/events/registration/${adminData.value?.userId}`
  );
  eventsData.value = fetchedData || [];
  console.log(eventsData.value);
};

onMounted(() => {
  try {
    isLoading.value = true;
    const storedUser = localStorage.getItem('admin');
    adminData.value = storedUser ? JSON.parse(storedUser) : {};
    console.log(adminData.value?.userId);
    fetchData();
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="ml-80 flex h-full w-screen">
    <div class="mx-20 mt-32 flex w-full flex-col gap-3">
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
              <p class="text-2xl font-semibold">240</p>
              <p>Registrations</p>
            </div>
          </div>
          <div
            class="flex h-24 w-full items-center justify-between rounded-[20px] bg-zinc-100 p-3 px-6"
          >
            <AllViews class="text-5xl" />
            <div>
              <p class="text-2xl font-semibold">1,098</p>
              <p>Views</p>
            </div>
          </div>
          <div
            class="flex h-24 w-full items-center justify-between rounded-[20px] bg-zinc-100 p-3 px-6"
          >
            <AvgViews class="text-5xl" />
            <div>
              <p class="text-2xl font-semibold">
                100 <span class="text-sm font-normal">per day</span>
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
      <div class="grid grid-cols-10 gap-3">
        <div class="col-span-6 rounded-[20px] bg-zinc-100 p-5">
          <canvas ref="chartCanvas" class="h-full w-full"></canvas>
        </div>
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
                <li v-for="(data, index) in genderData" :key="index">
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
      </div>
      <div class="grid h-[350px] grid-cols-10 gap-3">
        <div
          class="col-span-6 flex flex-col gap-2 rounded-[20px] bg-zinc-100 p-6"
        >
          <div>
            <p>Events</p>
          </div>
          <div v-if="isLoading" class="my-16 flex items-center justify-center">
            <span class="loader"></span>
          </div>
          <table
            v-else
            class="w-full table-auto caption-top overflow-scroll text-sm"
          >
            <thead class="">
              <tr class="border-default-300 border-b transition-colors">
                <td
                  class="h-14 w-64 px-4 text-base font-semibold text-lavender-gray"
                >
                  Event Name
                </td>
                <td
                  class="h-14 w-48 px-4 text-base font-semibold text-lavender-gray"
                >
                  Location
                </td>
                <td
                  class="h-14 w-52 px-4 text-center text-base font-semibold text-lavender-gray"
                >
                  Action
                </td>
              </tr>
            </thead>
            <tbody class="tbody-container overflow-y-auto">
              <tr v-if="eventsData.length === 0" class="text-center">
                <td colspan="3" class="b1 py-20">No Event</td>
              </tr>

              <tr
                v-else
                v-for="event in eventsData"
                class="border-default-300 cursor-default border-b transition-colors"
              >
                <EventList :event="event" :type="'dashboard'" />
              </tr>
            </tbody>
          </table>
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
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

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
