<script setup lang="ts">
import * as d3 from 'd3';
import VueApexCharts from 'vue3-apexcharts';
import Chart from 'chart.js/auto';
import EventList from '~/components/backoffice/EventList.vue';
import type { Registration } from '~/models/registration';
import type { Event } from '~/models/event';
import type { User } from '~/models/user';
import StackBarChart from '~/components/backoffice/StackBarChart.vue';
import SumaryOfView from '~/components/backoffice/SumaryOfView.vue';
import type { UserProfile } from '~/models/userProfile';

definePageMeta({
  layout: 'backoffice',
});

const eventsData = ref<Event[]>([]);
const adminData: any = ref<User | null>(null);
const isLoading = ref(true);
const registrationsData = ref<Registration[]>([]);
const colors: Record<string, string> = {
  Female: '#989898',
  Male: '#D71515',
  Other: '#cccccc',
};
const sumOfGender: any = ref(0);
const groupedByGender = ref();
const groupedByAgeRangeAndGender = ref();
const sumOfViews: any = ref(0);
const chartCanvasRef = ref<HTMLCanvasElement | null>(null);
const chartData: any = ref({
  labels: [],
  datasets: [] as Array<any>,
});
const viewsData = ref();

const sumAllViews = (data: any) => {
  return data.reduce(
    (acc: { totalViews: number; totalEntries: number }, event: any) => {
      const eventViewCount = event.views.reduce(
        (sum: number, view: any) => sum + view.count,
        0
      );
      const eventViewLength = event.views.length;

      acc.totalViews += eventViewCount;
      acc.totalEntries += eventViewLength;

      return acc;
    },
    { totalViews: 0, totalEntries: 0 }
  );
};

const prepareViewsData = (views: any, type: string) => {
  const labels: any[] = [];
  const data: any[] = [];

  if (type === 'daily') {
    views.forEach((view: any) => {
      const date = view.date.split(' ')[0];
      if (!labels.includes(date)) labels.push(date);
      data.push(view.count);
    });
  } else if (type === 'weekly') {
    const weeks: any = {};
    views.forEach((view: any) => {
      const week = new Date(view.date).toISOString().slice(0, 10).slice(0, 7);
      if (!weeks[week]) weeks[week] = [];
      weeks[week].push(view.count);
    });
    Object.keys(weeks).forEach((week) => {
      labels.push(week);
      data.push(
        Math.round(
          weeks[week].reduce((a: any, b: any) => a + b, 0) / weeks[week].length
        )
      );
    });
  } else if (type === 'monthly') {
    const months: any = {};
    views.forEach((view: any) => {
      const month = view.date.slice(0, 7);
      if (!months[month]) months[month] = [];
      months[month].push(view.count);
    });

    const monthAbbreviations = [
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

    Object.keys(months).forEach((month) => {
      const yearMonth = month.split('-');
      const year = yearMonth[0];
      const monthIndex = parseInt(yearMonth[1], 10) - 1;
      const monthLabel = `${monthAbbreviations[monthIndex]} ${year}`;

      labels.push(monthLabel);
      data.push(months[month].reduce((a: any, b: any) => a + b, 0));
    });
  }
  return { labels, data };
};
// const options = {
//   series: [
//     {
//       name: "High - 2013",
//       data: [28, 29, 33, 36, 32, 32, 33]
//     },
//     {
//       name: "Low - 2013",
//       data: [12, 11, 14, 18, 17, 13, 13]
//     }
//   ],
//   chart: {
//     height: 350,
//     type: "line",
//     dropShadow: {
//       enabled: true,
//       color: "#000",
//       top: 18,
//       left: 7,
//       blur: 10,
//       opacity: 0.5
//     },
//     zoom: {
//       enabled: false
//     },
//     toolbar: {
//       show: false
//     }
//   },
//   colors: ["#77B6EA", "#545454"],
//   dataLabels: {
//     enabled: false
//   },
//   stroke: {
//     curve: "smooth"
//   },
//   title: {
//     text: "Average High & Low Temperature",
//     align: "left"
//   },
//   grid: {
//     borderColor: "#e7e7e7",
//     row: {
//       colors: ["#f3f3f3", "transparent"],
//       opacity: 0.5
//     }
//   },
//   markers: {
//     size: 1
//   },
//   xaxis: {
//     categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
//     title: {
//       text: "Month"
//     }
//   },
//   yaxis: {
//     title: {
//       text: "Temperature"
//     },
//     min: 5,
//     max: 40
//   },
//   legend: {
//     position: "top",
//     horizontalAlign: "right",
//     floating: true,
//     offsetY: -25,
//     offsetX: -5
//   }
// };
const options = {
  series: chartData.value.datasets.map((item) => ({
    name: item.label,
    data: item.data,
  })),
  chart: {
    height: 350,
    type: 'line',
    zoom: { enabled: false },
    toolbar: { show: false },
  },
  colors: chartData.value.datasets.map((item) => item.borderColor),
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth' },
  title: {
    text: 'Event Participation',
    align: 'left',
  },
  xaxis: {
    categories: chartData.value.labels,
    title: { text: 'Month' },
  },
  yaxis: {
    title: { text: 'Participants' },
    min: 0,
  },
  legend: {
    position: 'top',
    horizontalAlign: 'right',
    floating: true,
    offsetY: -25,
    offsetX: -5,
  },
};
const donutChartRef = ref<HTMLCanvasElement | null>(null);
const DATA_COUNT = 5;
const NUMBER_CFG = { count: DATA_COUNT, min: 0, max: 100 };

const data = {
  labels: ['Other', 'Male', 'Female', 'Prefer not to say'],
  datasets: [
    {
      label: 'Gender Count',
      data: [2, 3, 3, 3],
      backgroundColor: ['#cccccc', '#D71515', '#989898', '#f56042'],
    },
  ],
};

const initializeDonutChart = () => {
  nextTick(() => {
    if (donutChartRef.value) {
      new Chart(donutChartRef.value, {
        type: 'doughnut',
        data: data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Chart.js Doughnut Chart',
            },
          },
        },
      });
    }
  });
};
const initializeChart = () => {
  nextTick(() => {
    if (chartCanvasRef.value) {
      new Chart(chartCanvasRef.value, {
        type: 'line',
        data: chartData.value,
        options: {
          responsive: true,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
          },
          scales: {
            y: {
              type: 'linear',
              display: true,
              position: 'left',
            },
          },
        },
      });
    } else {
      console.log('Chart canvas not found');
    }
  });
};

const fetchAllRegisData = async () => {
  const fetchedData = await useFetchWithAuth(
    `v2/registrations`,
    'GET',
    accessToken.value
  );
  registrationsData.value = fetchedData.data || [];

  groupedByGender.value = Object.fromEntries(
    d3.rollup(
      registrationsData.value,
      (v) => v.length,
      (d) => d.gender
    )
  );

  sumOfGender.value = Object.values(groupedByGender.value).reduce(
    (sum: any, value: any) => sum + value,
    0
  );

  const groupedByAgeRangeAndGenderData = d3.rollup(
    registrationsData.value,
    (v) =>
      d3.rollup(
        v,
        (genders) => genders.length,
        (d) => d.gender
      ),
    (d) => {
      const age = d.age;
      if (age >= 15 && age <= 19) return '15-19';
      if (age >= 20 && age <= 24) return '20-24';
      if (age >= 25 && age <= 29) return '25-29';
      return '30+';
    }
  );

  groupedByAgeRangeAndGender.value = Object.fromEntries(
    Array.from(groupedByAgeRangeAndGenderData, ([ageRange, genderMap]) => [
      ageRange,
      Object.fromEntries(genderMap),
    ])
  );
};

const accessToken = useCookie('accessToken');

const fetchAllEventData = async () => {
  const fetchedData = await useFetchWithAuth(
    `v1/backoffice/events`,
    'GET',
    accessToken.value
  );
  eventsData.value = fetchedData.data || [];
  // eventsData.value =  [];
};
const fetchAllViewData = async () => {
  if (eventsData.value) {
    const eventIds = eventsData.value.map((event) => event.eventId).join(',');
    const fetchedData = await useFetchData(
      `v1/views?eventIds=${eventIds}`,
      'GET'
    );
    viewsData.value = fetchedData.data || [];
    sumOfViews.value = sumAllViews(viewsData.value);

    viewsData.value.forEach((event: any, index: number) => {
      const eventViews = event.views || [];
      const { labels, data } = prepareViewsData(eventViews, 'monthly');

      if (index === 0) {
        chartData.value.labels = labels;
      }
      const eventData: any = eventsData.value.find(
        (e) => e.eventId === event.event_id
      );

      chartData.value.datasets.push({
        label: eventData ? `${eventData.eventName}` : 'Unknown event',
        data: data,
        borderColor: `hsl(0, 50%, ${70 - index * 10}%)`,
        backgroundColor: `hsla(0, 50%, ${70 - index * 10}%, 0.2)`,
        fill: false,
      });
    });
  }
};
const profileData = useCookie<UserProfile>('profileData');
onMounted(async () => {
  try {
    isLoading.value = true;
    const storedUser = localStorage.getItem('admin');
    adminData.value = storedUser ? JSON.parse(storedUser) : {};

    await fetchAllRegisData();
    await fetchAllEventData();
    await fetchAllViewData();
    console.log(chartData.value);
    console.log(options.series);
    initializeChart();
    initializeDonutChart();
  } finally {
    isLoading.value = false;
  }
});

watch(chartCanvasRef, (newValue) => {
  if (newValue) {
    initializeChart();
  }
});

watch(donutChartRef, (newValue) => {
  if (newValue) {
    initializeDonutChart();
  }
});
</script>

<template>
  <div class="mb-44 w-full bg-ghost-white">
    <div
      v-if="isLoading"
      class="my-16 flex h-screen w-full items-center justify-center"
    >
      <span class="loader"></span>
    </div>
    <div
      v-else-if="eventsData.length === 0"
      class="error-msg flex h-screen w-full items-center justify-center"
    >
      <p class="t3">
        No events to display. Create your first event to get started!
      </p>
    </div>
    <div v-else class="ml-80 flex h-full">
      <div class="mx-20 mt-32 flex w-full flex-col gap-3">
        <SumaryOfView
          v-if="profileData"
          :sumOfViews="sumOfViews?.totalViews"
          :viewsEntries="sumOfViews?.totalEntries"
          :allRegistration="registrationsData?.length"
          :profileData
          format="row"
        />

        <div class="grid grid-cols-10 gap-3">
          <div
            class="view-by-month col-span-6 rounded-[20px] bg-white px-8 py-5 drop-shadow-md"
          >
            <p class="b1 pb-5 font-semibold">
              Monthly Event View Counts (4 months)
            </p>
            {{ chartData }}
            <canvas ref="donutChartRef" class=""></canvas>
            <canvas ref="chartCanvasRef" class=""></canvas>
            <client-only>
              <VueApexCharts
                width="100%"
                height="350"
                :options="options"
                :series="options.series"
              />
            </client-only>
          </div>
          <div
            class="view-by-gender col-span-4 rounded-[20px] bg-white px-8 py-5 drop-shadow-md"
            v-if="groupedByAgeRangeAndGender"
          >
            <StackBarChart
              :groupedByAgeRangeAndGender="groupedByAgeRangeAndGender"
              :colors="colors"
            />
          </div>
          <!-- <div
            class="col-span-4 rounded-[20px] bg-white px-8 py-5 drop-shadow-md"
          >
            <PieChart :groupedByGender="groupedByGender" :colors="colors" />
          </div> -->
        </div>
        <div class="event-list-div grid h-[350px] grid-cols-10 gap-3">
          <div
            class="col-span-10 flex flex-col gap-2 rounded-[20px] bg-white px-8 py-6 pb-10 drop-shadow-md"
          >
            <div>
              <p class="b1 font-semibold">Events</p>
            </div>
            <table
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
                  class="event-list border-default-300 cursor-default border-b transition-colors"
                >
                  <EventList :event="event" :type="'dashboard'" />
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
