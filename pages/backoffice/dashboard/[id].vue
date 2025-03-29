<script setup lang="ts">
import * as d3 from 'd3';
import Chart from 'chart.js/auto';

import Star from '~/components/icons/Star.vue';
import Arrow from '~/components/icons/Arrow.vue';
import Calendar from '~/components/icons/Calendar.vue';
import Location from '~/components/icons/Location.vue';
import Clock from '~/components/icons/Clock.vue';
import type { Registration } from '~/models/registration';
import SumaryOfView from '~/components/backoffice/SumaryOfView.vue';
import StackBarChart from '~/components/backoffice/StackBarChart.vue';
import PieChart from '~/components/backoffice/PieChart.vue';
import type { Answer, ExistingQuestion, Feedback } from '~/models/feedback';
const profileData = useCookie('profileData');

const error = useError();
definePageMeta({
  layout: 'backoffice',
});

const route = useRoute();
const param = route.params.id;
const feedbackData = ref<Feedback[]>([]);
const averageRating = ref();
const registrationsData = ref<Registration[]>([]);
const sumOfGender: any = ref(0);
const groupedByGender = ref();
const groupedByAgeRangeAndGender = ref();
const groupedByStatus = ref();

const viewsData = ref();
const totalViewCount = ref(0);

const colors = {
  Female: '#ff823f ',
  Male: '#deddd7',
  Other: '#ff0000 ',
  'Prefer not to say': '#ff4e20 ',
};
const statusColor: any = {
  'Awaiting Check-in': '#131313',
  'Checked in': '#ff0000',
  Unattended: '#deddd7',
};

const generateregistrationGoalChartData = (
  registered: number,
  goal: number,
  colorRegistered: string,
  colorGoal: string
) => {
  return {
    labels: ['Registered', 'Goal'],
    datasets: [
      {
        label: 'Registration Progress',
        data: [registered, goal - registered],
        backgroundColor: [colorRegistered, colorGoal],
        borderRadius: 5,
        hoverOffset: 10,
      },
    ],
  };
};
const isLoading = useState('isLoading', () => true);

const colorRegistered = '#ffb661';
const colorGoal = '#ff0000';
const registrationGoalChartRef = ref<HTMLCanvasElement | null>(null);
const registrationGoalChartData = ref();

const initializeRegistrationGoalChart = () => {
  nextTick(() => {
    if (registrationGoalChartRef.value) {
      new Chart(registrationGoalChartRef.value, {
        type: 'doughnut',
        data: registrationGoalChartData.value,
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
              position: 'bottom',
            },
            title: {
              display: false,
              text: 'Registration Goal',
            },
          },
        },
      });
    }
  });
};

function getAverage() {
  const total = feedbackData.value.reduce(
    (sum, curr) => sum + curr.feedbackRating,
    0
  );
  const avg = total / feedbackData.value.length;
  averageRating.value =
    total === 0 ? 0 : (Math.round(avg * 10) / 10).toFixed(1);
}

const token = useCookie('accessToken');

watch(registrationGoalChartRef, (newValue) => {
  if (newValue) {
    initializeRegistrationGoalChart();
  }
});

const fetchViewsData = async () => {
  try {
    const fetchedData = await useFetchData(`v1/views?eventIds=${param}`, 'GET');
    viewsData.value = fetchedData.data || [];

    totalViewCount.value = viewsData.value[0].views.reduce(
      (sum: any, record: any) => sum + record.count,
      0
    );
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

function getColor(category: any) {
  const colors = {
    Female: '#ff823f ',
    Male: '#deddd7',
    Other: '#ff0000 ',
    'Prefer not to say': '#ff4e20 ',
  };
  return colors[category] || 'black';
}
const ageGenderLabels = ref();

const fetchRegisData = async () => {
  const fetchedData = await useFetchWithAuth(
    `v2/registrations/event/${param}`,
    'GET',
    token.value
  );
  if (fetchedData.error) {
    error.value = 'error';
  } else {
    registrationsData.value = fetchedData.data || [];
  }

  groupedByGender.value = Object.fromEntries(
    d3.rollup(
      registrationsData.value,
      (v) => v.length,
      (d) => d.gender
    )
  );

  groupedByStatus.value = registrationsData.value.length
    ? Object.fromEntries(
        d3.rollup(
          registrationsData.value,
          (v) => v.length,
          (d) => d.status
        )
      )
    : {};

  sumOfGender.value = Object.values(groupedByGender.value).reduce(
    (sum: any, value) => sum + value,
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

  if (Object.keys(groupedByAgeRangeAndGender.value).length > 0) {
    ageGenderLabels.value = Object.keys(groupedByAgeRangeAndGender.value);

    const categories = [
      ...new Set(
        ageGenderLabels.value.flatMap(
          (age) => Object.keys(groupedByAgeRangeAndGender.value[age]) || []
        )
      ),
    ];

    ageGenderChartData.value = categories.map((category) => ({
      label: category,
      data: ageGenderLabels.value.map(
        (age) => groupedByAgeRangeAndGender.value[age]?.[category] || 0
      ),
      backgroundColor: getColor(category),
      stack: 'Stack 0',
      borderRadius: 5,
      width: 5,
    }));

    initializeAgeGenderChart();
  }
};

const initializeAgeGenderChart = () => {
  nextTick(() => {
    if (ageGenderChartRef.value) {
      new Chart(ageGenderChartRef.value, {
        type: 'bar',
        data: {
          labels: ageGenderLabels.value,
          datasets: ageGenderChartData.value,
        },
        options: {
          indexAxis: 'y', // ✅ ทำให้กราฟเป็นแนวนอน
          responsive: true,
          scales: {
            y: {
              stacked: true,
              barPercentage: 0.3, // ✅ ลดความกว้างของแท่ง (ค่าเริ่มต้น 0.9)
              categoryPercentage: 0.5, // ✅ ลดพื้นที่ที่แต่ละหมวดหมู่ใช้
              grid: {
                drawBorder: false,
                drawOnChartArea: false,
                display: true,
              },
              border: { display: true },
              ticks: {
                font: { size: 12, family: 'Poppins' },
                color: '#333',
                align: 'center',
              },
            },
            x: {
              stacked: true,
              grid: {
                drawBorder: true,
                drawOnChartArea: true,
                display: true,
              },
              border: { display: false },
              ticks: { display: true },
            },
          },
          hover: { mode: 'nearest', intersect: true },
          plugins: {
            legend: { display: true },
            title: { display: false },
            tooltip: {
              callbacks: {
                footer: (tooltipItems) => {
                  if (!tooltipItems.length) return;

                  let index = tooltipItems[0].dataIndex; // ✅ index ของ bar ที่ hover อยู่
                  let genderSums = {};
                  let totalSum = 0;

                  ageGenderChartData.value.forEach((dataset) => {
                    let label = dataset.label; // เช่น "Male", "Female"
                    let value = dataset.data[index]; // ✅ ดึงค่าของ bar ที่ hover

                    if (value > 0) {
                      genderSums[label] = value;
                      totalSum += value;
                    }
                  });

                  // ✅ แปลงเป็นข้อความ tooltip
                  let genderList = Object.entries(genderSums)
                    .map(([gender, count]) => `${gender}: ${count}`)
                    .join('\n');

                  return `${genderList}\nรวมทั้งหมด: ${totalSum}`;
                },
              },
            },
          },
          layout: { padding: { top: 10, bottom: 10 } },
        },
      });
    }
  });
};

const eventDetail = ref();
const fetchEventDetail = async () => {
  const fetchedData = await useFetchWithAuth(
    `v1/backoffice/events/${param}`,
    'GET',
    token.value
  );
  if ('data' in fetchedData) {
    eventDetail.value = fetchedData.data || [];
  }
};

function formatDate(date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
  }).format(date); // '2 Mar'
}

function formatMonth(date) {
  return new Intl.DateTimeFormat('en-GB', { month: 'short' }).format(date); // 'Mar'
}

function getDateRange(period) {
  const now = new Date();
  let startDate = new Date(now);

  if (period === '7 days') {
    startDate.setDate(now.getDate() - 6);
  } else if (period === '30 days') {
    startDate.setDate(now.getDate() - 29);
  } else if (period === '6 months') {
    startDate.setMonth(now.getMonth() - 5);
    startDate.setDate(1);
  } else {
    throw new Error('Invalid period');
  }

  const dates = [];
  let currentDate = new Date(startDate);

  if (period === '6 months') {
    while (currentDate <= now) {
      dates.push(formatMonth(currentDate)); // 'Mar', 'Apr', 'May'
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
  } else {
    while (currentDate <= now) {
      dates.push(formatDate(currentDate)); // '2 Mar', '3 Mar'
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  return dates;
}

function generateChartData(data, period = '7 days') {
  const labels = getDateRange(period);
  const dataMap = new Map();

  if (period === '6 months') {
    data.forEach(({ date, count }) => {
      const month = formatMonth(new Date(date)); // 'Mar', 'Apr'
      dataMap.set(month, (dataMap.get(month) || 0) + count);
    });
  } else {
    data.forEach(({ date, count }) => {
      const formattedDate = formatDate(new Date(date)); // '2 Mar', '3 Mar'
      dataMap.set(formattedDate, count);
    });
  }

  const datasetData = labels.map((label) => dataMap.get(label) || 0);

  return {
    labels,
    datasets: [
      {
        label: 'views',
        data: datasetData,
        backgroundColor: '#ff0000',
        borderRadius: 18,
        borderSkipped: false,
      },
    ],
  };
}

const viewsChartRef = ref<HTMLCanvasElement | null>(null);
const ageGenderChartRef = ref<HTMLCanvasElement | null>(null);
const ageGenderChartData = ref();
const chartInstance = ref<Chart | null>(null);
const barData = ref();

const initializeBarChart = () => {
  nextTick(() => {
    if (viewsChartRef.value) {
      // ทำลายแผนภูมิเก่าถ้ามีอยู่
      if (chartInstance.value) {
        chartInstance.value.destroy();
      }

      // สร้างแผนภูมิใหม่และเก็บอ้างอิง
      chartInstance.value = new Chart(viewsChartRef.value, {
        type: 'bar',
        data: barData.value,
        options: {
          responsive: true,
          scales: {
            x: {
              grid: {
                drawBorder: false,
                drawOnChartArea: false,
                display: false,
              },
              border: { display: false },
              ticks: {
                font: { size: 12, family: 'Poppins', weight: '' },
                color: '#333',
                align: 'center',
                // maxRotation: 90,
                // minRotation: 90,
              },
            },
            y: {
              grid: {
                drawBorder: false,
                drawOnChartArea: true,
                display: true,
              },
              border: { display: false },
              ticks: { display: true },
            },
          },
          hover: { mode: 'nearest', intersect: true },
          plugins: {
            legend: { display: false },
            title: { display: false },
          },
          layout: { padding: { top: 10, bottom: 10 } },
        },
      });
    }
  });
};
watch(viewsChartRef, (newValue) => {
  if (newValue) {
    initializeBarChart();
  }
});

watch(ageGenderChartRef, (newValue) => {
  if (newValue) {
    initializeAgeGenderChart();
  }
});
onMounted(async () => {
  try {
    isLoading.value = true;
    const fetchedFeedbackData = await useFetchWithAuth(
      `v1/feedbacks/event/${param}`,
      'GET',
      token.value
    );
    feedbackData.value = fetchedFeedbackData.data || [];
    getAverage();
    await fetchRegisData();
    await fetchViewsData();
    await fetchEventDetail();

    if (
      eventDetail.value &&
      eventDetail.value.registration_goal !== undefined
    ) {
      registrationGoalChartData.value = generateregistrationGoalChartData(
        registrationsData?.value.length,
        eventDetail.value.registration_goal,
        colorGoal,
        colorRegistered
      );
    }

    barData.value = generateChartData(
      viewsData.value[0]?.views,
      selectedViewOption.value
    );

    initializeBarChart();
  } finally {
    isLoading.value = false;
  }
});

onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }
});
const selectedViewOption = ref('7 days');
watch(selectedViewOption, (newValue) => {
  // if (newValue) {
  barData.value = generateChartData(
    viewsData.value[0]?.views,
    selectedViewOption.value
  );
  initializeBarChart();
  // }
});
</script>

<template>
  <Loader v-if="isLoading" />

  <div v-else class="flex h-full w-screen bg-[#EEEEEE] lg:ml-80">
    <div class="my-24 flex w-full flex-col gap-4 px-5 lg:mx-20 lg:px-0">
      <NuxtLink
        to="/backoffice/dashboard"
        class="mb-1 flex items-center gap-2 text-dark-grey duration-200 hover:-ml-3"
      >
        <Arrow />
        <p class="b2">Back to overall dashboard</p>
      </NuxtLink>
      <div class="bg-glass flex items-center gap-4 rounded-[20px] p-3">
        <img
          :src="eventDetail?.image"
          alt=""
          class="h-[180px] rounded-[12px] object-cover"
        />
        <div class="flex w-fit flex-col justify-center gap-2">
          <div class="tag-group b4 flex gap-2">
            <button
              v-for="tag in eventDetail?.tags"
              class="bg-zin-200 rounded-md border border-dark-grey/60 px-3"
            >
              {{ tag.tag_title }}
            </button>
          </div>
          <NuxtLink
            v-if="eventDetail?.slug"
            :to="{ name: 'event-id', params: { id: eventDetail?.slug } }"
          >
            <button
              class="dash-event-name flex items-center gap-1 text-3xl font-semibold duration-300 hover:underline"
            >
              {{ eventDetail?.name }} <Arrow class="t3 rotate-180" /></button
          ></NuxtLink>
          <div class="dash-event-date b2 flex items-center gap-2">
            <Calendar />
            <p v-if="eventDetail?.start_date && eventDetail?.end_date">
              {{ useFormatDateTime(eventDetail?.start_date, 'date') }} -
              {{ useFormatDateTime(eventDetail?.end_date, 'date') }}
            </p>
          </div>
          <div class="dash-event-time b2 flex items-center gap-2">
            <Clock />
            <p v-if="eventDetail?.start_date && eventDetail?.end_date">
              {{ useFormatDateTime(eventDetail?.start_date, 'time') }} -
              {{ useFormatDateTime(eventDetail?.end_date, 'time') }}
            </p>
          </div>
          <div class="dash-event-location b2 flex items-center gap-2">
            <Location />
            <p>{{ eventDetail?.location }}</p>
          </div>
        </div>
      </div>

      <div class="grid h-full gap-4 lg:grid-cols-10">
        <div
          class="jus bg-glass col-span-5 flex flex-col gap-4 rounded-[20px] px-8 py-5"
        >
          <div class="flex items-center justify-between">
            <h1 class="b1 font-semibold">
              Engagement last {{ selectedViewOption }}
            </h1>

            <select
              v-model="selectedViewOption"
              class="b3 w-fit self-end rounded-lg border-[1px] border-black/20 p-1"
            >
              <option disabled value="">Select option</option>
              <option value="7 days">views last 7 days</option>
              <option value="30 days">views last 30 days</option>
              <option value="6 months">views last 6 months</option>
            </select>
          </div>
          <canvas
            ref="viewsChartRef"
            class=""
            style="height: 100%; max-height: 400px"
          ></canvas>
        </div>
        <div
          class="bg-glass col-span-3 mx-auto flex w-full flex-col gap-2 rounded-[20px] p-8"
        >
          <p class="b1 self-start font-semibold">Registration Goal</p>
          <div
            class="view-goal flex h-full w-full flex-col items-center justify-center gap-8 rounded-[20px] p-8"
          >
            <canvas ref="registrationGoalChartRef" class=""></canvas>
          </div>
          <p
            v-if="
              eventDetail?.registration_goal && registrationsData?.length > 0
            "
            class="b1 text-center font-semibold"
          >
            <span class="text-[#ff0000]">{{ registrationsData?.length }}</span>
            from {{ eventDetail?.registration_goal }} Registration
          </p>
        </div>
        <div class="col-span-2 flex h-full">
          <SumaryOfView
            v-if="viewsData && registrationsData"
            :profile-data="profileData"
            :sumOfViews="totalViewCount"
            :viewsEntries="viewsData[0].views?.length"
            :allRegistration="registrationsData?.length"
          />
        </div>
      </div>
      <div class="flex flex-col gap-4">
        <div class="grid gap-4 lg:grid-cols-12">
          <div
            class="view-by-gender-age bg-glass rounded-[20px] p-12 lg:col-span-8"
            v-if="groupedByAgeRangeAndGender"
          >
            <h1 class="b1 font-semibold">
              Age and Gender Breakdown of Event Registrants
            </h1>
            <canvas
              ref="ageGenderChartRef"
              class="h-full"
              style="height: 100%"
            ></canvas>
          </div>
          <div
            v-if="groupedByGender"
            class="view-by-gender bg-glass col-span-4 flex flex-grow flex-col gap-2 rounded-[20px] p-12"
          >
            <PieChart :groupedByGender="groupedByGender" :colors="colors" />
          </div>
        </div>

        <div class="grid gap-4 lg:grid-cols-12">
          <div
            class="view-by-checkin bg-glass col-span-7 flex flex-col gap-2 rounded-[20px] p-12"
          >
            <p class="b1 font-semibold">Check-In</p>
            <div
              v-if="Object.keys(groupedByStatus || {}).length === 0"
              class="flex items-center justify-center"
            >
              <p class="b2">No registration now</p>
            </div>
            <div v-else class="flex flex-col gap-2">
              <div
                class="flex h-6 w-full rounded-l-md rounded-r-md bg-zinc-200"
              >
                <div
                  v-for="(status, index) in Object.keys(groupedByStatus).sort(
                    (a, b) => {
                      const statusOrder: any = {
                        'Checked in': 1,
                        'Awaiting Check-in': 2,
                        Unattended: 3,
                      };
                      return statusOrder[a] - statusOrder[b];
                    }
                  )"
                  :key="index"
                  :style="{
                    backgroundColor: statusColor[status],
                    width: `${(groupedByStatus[status] * 100) / (registrationsData?.length || 1)}%`,
                  }"
                  :class="`${index === 0 ? 'rounded-l-md' : index === Object.keys(groupedByStatus).length - 1 ? 'rounded-r-md' : ''} w-10`"
                ></div>
              </div>
              <div v-if="Object.keys(groupedByStatus)?.length > 0">
                <ul class="legend">
                  <li
                    v-for="(status, index) in Object.keys(groupedByStatus).sort(
                      (a, b) => {
                        const statusOrder: any = {
                          'Checked in': 1,
                          'Awaiting Check-in': 2,
                          Unattended: 3,
                        };
                        return statusOrder[a] - statusOrder[b];
                      }
                    )"
                    :key="index"
                    class="b3 flex items-center gap-1"
                  >
                    <div
                      :style="{ backgroundColor: statusColor[status] }"
                      class="h-3 w-3 rounded-full"
                    ></div>
                    {{ status }}: {{ groupedByStatus[status] }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div
            class="view-by-feedback bg-glass col-span-5 flex flex-col gap-2 rounded-[20px] p-12"
          >
            <p class="b1 self-start font-semibold">Feedback</p>
            <div
              v-if="registrationsData.length === 0"
              class="flex items-center justify-center"
            >
              <p class="b2">No feedback now</p>
            </div>
            <div v-else class="flex flex-col justify-center gap-2">
              <div class="text-center">
                <div class="flex items-center justify-center gap-1">
                  <Star class="t3 fill-[#ff0000]" />
                  <p class="t3 font-semibold">{{ averageRating }}</p>
                </div>

                <p class="b2">Average feedback score</p>
              </div>
              <NuxtLink
                :to="{
                  name: `backoffice-feedback-response-id`,
                  params: { id: param },
                }"
                class="b4 flex items-center justify-end gap-1 self-end pt-2 text-dark-grey/60"
              >
                more feedback details
                <Arrow class="rotate-180" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
