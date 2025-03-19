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
const isLoading = ref(true);
const sumOfGender: any = ref(0);
const groupedByGender = ref();
const groupedByAgeRangeAndGender = ref();
const groupedByStatus = ref();
const last7DayData = ref();
const maxForLast7Day = ref(0);
const viewsData = ref();
const totalViewCount = ref(0);
const colors = {
  Female: '#989898',
  Male: '#D71515',
  Other: '#cccccc',
  'Prefer not to say': '#f56042',
};
const statusColor: any = {
  'Awaiting Check-in': '#989898',
  'Checked in': '#D71515',
  Unattended: '#cccccc',
};

const generateDonutChartData = (
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

const colorRegistered = '#cccccc'; // สีของส่วนที่ลงทะเบียนแล้ว
const colorGoal = '#D71515'; // สีของส่วนที่ยังไม่ถึงเป้าหมาย
const registrationGoalChartRef = ref<HTMLCanvasElement | null>(null);

const donutChartData = ref();
const initializeDonutChart = () => {
  nextTick(() => {
    if (registrationGoalChartRef.value) {
      new Chart(registrationGoalChartRef.value, {
        type: 'doughnut',
        data: donutChartData.value,
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false,
              position: 'bottom',
            },
            title: {
              display: false,
              text: 'Chart.js Doughnut Chart',
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
const getLast7DaysData = (data: any) => {
  const sortedData = data.sort(
    (a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const last7Days = sortedData.slice(0, 7);
  const finalData = last7Days.sort(
    (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return finalData.map((item: any) => {
    const dateObj = new Date(item.date);
    return {
      day: dateObj.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        timeZone: 'Asia/Bangkok',
      }),
      count: item.count,
      date: dateObj.toLocaleDateString('en-US', { timeZone: 'Asia/Bangkok' }),
    };
  });
};
const token = useCookie('accessToken');
watch(registrationGoalChartRef, (newValue) => {
  if (newValue) {
    initializeDonutChart();
  }
});
const fetchViewsData = async () => {
  try {
    const fetchedData = await useFetchData(`v1/views?eventIds=${param}`, 'GET');
    viewsData.value = fetchedData.data || [];
    console.log('viewsData.value', viewsData.value);

    totalViewCount.value = viewsData.value[0].views.reduce(
      (sum: any, record: any) => sum + record.count,
      0
    );

    last7DayData.value = getLast7DaysData(viewsData.value[0].views);

    maxForLast7Day.value = Math.max(
      ...last7DayData.value.map((item: any) => item.count)
    );
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

// ฟังก์ชันกำหนดสี
function getColor(category: any) {
  const colors = {
    Female: '#989898',
    Male: '#D71515',
    Other: '#cccccc',
    'Prefer not to say': '#f56042',
  };
  return colors[category] || 'black';
}
const labels = ref();
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

  groupedByStatus.value = Object.fromEntries(
    d3.rollup(
      registrationsData.value,
      (v) => v.length,
      (d) => d.status
    )
  );

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
    labels.value = Object.keys(groupedByAgeRangeAndGender.value);

    const categories = [
      ...new Set(
        labels.value.flatMap(
          (age) => Object.keys(groupedByAgeRangeAndGender.value[age]) || []
        )
      ),
    ];

    stackChartData.value = categories.map((category) => ({
      label: category,
      data: labels.value.map(
        (age) => groupedByAgeRangeAndGender.value[age]?.[category] || 0
      ),
      backgroundColor: getColor(category),
      stack: 'Stack 0',
      borderRadius: 5,
      width: 5,
    }));

    initializestackChart();
  }
};
// const initializestackChart = () => {
//   nextTick(() => {
//     if (stackChartRef.value) {
//       new Chart(stackChartRef.value, {
//         type: 'bar',
//         data: {
//           labels: labels.value,
//           datasets: stackChartData.value,
//         },
//         options: {
//           responsive: true,
//           scales: {
//             x: {
//               stacked: true,
//               // barPercentage: 0.4, // ปรับความกว้างของแท่ง (ค่าเริ่มต้นคือ 0.9)
//               // categoryPercentage: 0.5, // ปรับพื้นที่ที่แต่ละหมวดหมู่ใช้
//               barThickness: 20, // กำหนดความกว้างคงที่ (เช่น 20px)
//               maxBarThickness: 30, // ความกว้างสูงสุดของแท่ง
//               grid: {
//                 drawBorder: false,
//                 drawOnChartArea: false,
//                 display: true,
//               },
//               border: { display: true },
//               ticks: {
//                 font: { size: 12, family: 'Poppins', weight: '' },
//                 color: '#333',
//                 align: 'center',
//                 // maxRotation: 90,
//                 // minRotation: 90,
//               },
//             },
//             y: {
//               stacked: true,
//               grid: {
//                 drawBorder: true,
//                 drawOnChartArea: true,
//                 display: true,
//               },
//               border: { display: false },
//               ticks: { display: true },
//             },
//           },
//           hover: { mode: 'nearest', intersect: true },
//           plugins: {
//             legend: { display: true },
//             title: { display: false },
//           },
//           layout: { padding: { top: 10, bottom: 10 } },
//         },
//       });
//     }
//   });
// };
const initializestackChart = () => {
  nextTick(() => {
    if (stackChartRef.value) {
      new Chart(stackChartRef.value, {
        type: 'bar',
        data: {
          labels: labels.value,
          datasets: stackChartData.value,
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

                  stackChartData.value.forEach((dataset) => {
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
  eventDetail.value = fetchedData.data || [];
};
function formatDate(date) {
  return date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
}

function formatMonth(date) {
  return date.toISOString().slice(0, 7); // 'YYYY-MM'
}

function getDateRange(period) {
  const now = new Date();
  let startDate = new Date(now);

  if (period === '7 days') {
    startDate.setDate(now.getDate() - 6);
  } else if (period === '30 days') {
    startDate.setDate(now.getDate() - 29);
  } else if (period === '6 months') {
    startDate.setMonth(now.getMonth() - 5); // 6 เดือนล่าสุดรวมเดือนปัจจุบัน
    startDate.setDate(1); // เริ่มต้นที่วันที่ 1 ของเดือน
  } else {
    throw new Error('Invalid period');
  }

  const dates = [];
  let currentDate = new Date(startDate);

  if (period === '6 months') {
    while (currentDate <= now) {
      dates.push(formatMonth(currentDate)); // ดึงเฉพาะ 'YYYY-MM'
      currentDate.setMonth(currentDate.getMonth() + 1); // เพิ่มทีละเดือน
    }
  } else {
    while (currentDate <= now) {
      dates.push(formatDate(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  return dates;
}

function generateChartData(data, period = '7 days') {
  const labels = getDateRange(period);
  const dataMap = new Map();

  if (period === '6 months') {
    // สร้าง map สำหรับยอดรวมของแต่ละเดือน
    data.forEach(({ date, count }) => {
      const month = date.slice(0, 7); // 'YYYY-MM'
      dataMap.set(month, (dataMap.get(month) || 0) + count);
    });
  } else {
    // ใช้ map สำหรับรายวันปกติ
    data.forEach(({ date, count }) => {
      dataMap.set(date, count);
    });
  }

  const datasetData = labels.map((label) => dataMap.get(label) || 0);

  return {
    labels,
    datasets: [
      {
        label: 'My Dataset',
        data: datasetData,
        backgroundColor: 'red',
        borderWidth: 1,
        borderRadius: 5,
        borderSkipped: false,
      },
    ],
  };
}

const viewsChartRef = ref<HTMLCanvasElement | null>(null);
const stackChartRef = ref<HTMLCanvasElement | null>(null);
const stackChartData = ref();
const chartInstance = ref(null);
const barData = ref();
// const initializeBarChart = () => {
//   nextTick(() => {
//     if (viewsChartRef.value) {
//       new Chart(viewsChartRef.value, {
//         type: 'bar',
//         data: barData.value,
//         options: {
//           responsive: true,
//           plugins: {
//             legend: {
//               position: 'bottom',
//               gap: 5,
//             },
//             title: {
//               display: false,
//               text: 'Chart.js Doughnut Chart',
//             },
//           },
//         },
//       });
//     }
//   });
// };
// const initializeBarChart = () => {
//   nextTick(() => {
//     if (viewsChartRef.value) {
//       new Chart(viewsChartRef.value, {
//         type: 'bar',
//         data: barData.value,
//         options: {
//           responsive: true,
//           scales: {
//             x: {
//               grid: {
//                 drawBorder: false,
//                 drawOnChartArea: false,
//                 display: false,
//               },
//               border: {
//                 display: false,
//               },
//               ticks: {
//                 font: { size: 12, family: 'Poppins', weight: '' },
//                 color: '#333',
//                 align: 'center', // จัดให้อยู่ตรงกลาง
//                 maxRotation: 90, // หมุน label เป็นแนวตั้ง
//                 minRotation: 90, // บังคับให้เป็นแนวตั้ง
//               },
//             },
//             y: {
//               grid: {
//                 drawBorder: false,
//                 drawOnChartArea: false,
//                 display: false,
//               },
//               border: {
//                 display: false,
//               },
//               ticks: {
//                 display: false,
//               },
//             },
//           },
//           hover: {
//             mode: 'nearest',
//             intersect: true, // hover only when intersecting a bar
//           },
//           plugins: {
//             legend: {
//               display: false,
//             },
//             title: {
//               display: false,
//             },
//           },
//           layout: {
//             padding: { top: 10, bottom: 10 },
//           },
//         },
//       });
//     }
//   });
// };
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
                maxRotation: 90,
                minRotation: 90,
              },
            },
            y: {
              grid: {
                drawBorder: false,
                drawOnChartArea: false,
                display: false,
              },
              border: { display: false },
              ticks: { display: false },
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

watch(stackChartRef, (newValue) => {
  if (newValue) {
    initializestackChart();
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
    donutChartData.value = generateDonutChartData(
      registrationsData?.value.length,
      eventDetail.value.registration_goal,
      colorGoal,
      colorRegistered
    );

    barData.value = generateChartData(
      viewsData.value[0]?.views,
      selectedViewOption.value
    );
    console.log('barData', barData.value);

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
  <div class="ml-80 flex h-full w-screen bg-ghost-white">
    <div
      v-if="isLoading"
      class="my-16 flex h-screen w-full items-center justify-center"
    >
      <span class="loader"></span>
    </div>
    <div v-else class="mx-20 my-24 flex w-full flex-col gap-3">
      <NuxtLink
        to="/backoffice/dashboard"
        class="mb-1 flex items-center gap-2 text-dark-grey duration-200 hover:-ml-3"
      >
        <Arrow />
        <p class="b2">Back to overall dashboard</p>
      </NuxtLink>
      <div class="mb-4 flex items-center gap-5">
        <img
          :src="eventDetail?.image"
          alt=""
          class="h-[180px] rounded-lg object-cover"
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

      <div class="grid h-full grid-cols-10 gap-3">
        <div
          class="col-span-5 flex flex-col gap-5 rounded-[20px] bg-white px-8 py-5 drop-shadow-md"
        >
          <h1 class="b1 font-semibold">Engagement last 7 days</h1>

          <select
            v-model="selectedViewOption"
            class="b2 w-full rounded-lg border-[1px] border-black/20 p-2"
          >
            <option disabled value="">Select option</option>
            <option value="7 days">views last 7 days</option>
            <option value="30 days">views last 30 days</option>
            <option value="6 months">views last 6 months</option>
          </select>
          <canvas
            ref="viewsChartRef"
            class="h-full"
            style="height: 100%"
          ></canvas>

          <!-- <div class="view-by-7day flex h-full flex-col justify-center">
            <div class="flex justify-center gap-5">
              <div v-if="last7DayData.length>0"
                class="b4 flex flex-col items-end justify-between text-dark-grey/60"
              >
                <p>{{ Math.round(maxForLast7Day * 1.25) }}</p>
                <p>{{ Math.round(maxForLast7Day * 1.25 * 0.75) }}</p>
                <p>{{ Math.round(maxForLast7Day * 1.25 * 0.5) }}</p>
                <p>{{ Math.round(maxForLast7Day * 1.25 * 0.25) }}</p>
                <p>{{ 0 }}</p>
              </div>

              <div
                v-if="last7DayData.length > 0"
                class="b3 flex w-full items-end justify-between self-end"
              >
                <div
                  v-for="data in last7DayData"
                  class="group relative flex cursor-pointer flex-col items-center"
                >
                  <div
                    class="flex h-52 w-[40px] items-end justify-end rounded-lg bg-gray-200 duration-300 group-hover:scale-105"
                  >
                    <div
                      class="flex w-full items-end justify-end rounded-b-lg bg-black-1 duration-300 group-hover:bg-burgundy"
                      :style="{
                        height: `${calculateWidth(last7DayData, data.count)}%`,
                      }"
                    ></div>
                  </div>
                  <div
                    class="absolute -top-16 w-max rounded-md border bg-white px-4 py-1 opacity-0 duration-300 group-hover:opacity-100"
                  >
                    {{ data.day }} <br />
                    {{ data.count }} views
                  </div>
                  <p
                    class="b4 absolute -bottom-7 w-max shrink-0 text-dark-grey/60"
                  >
                    {{ data.day }}
                  </p>
                </div>
              </div>
              <div v-else class="b2">No View Data</div>
            </div>
          </div> -->
        </div>
        <div
          class="col-span-3 mx-auto w-full gap-2 rounded-[20px] bg-white p-5 px-8 py-5 drop-shadow-md"
        >
          <p class="b1 self-start font-semibold">Registration</p>
          <div
            class="view-goal flex h-full w-full flex-col items-center justify-center gap-8 rounded-[20px]"
          >
            <canvas ref="registrationGoalChartRef" class=""></canvas>
            <!-- 
            <div class="relative flex w-full items-center justify-center">
              <div
                class="aspect-square w-3/4 rounded-full drop-shadow-lg"
                :style="{
                  background: `conic-gradient(#D71515 0% ${(registrationsData?.length / goals) * 100}%, #e0e0e0 ${(registrationsData?.length / goals) * 100}%)`,
                }"
              ></div>
              <div
                class="absolute left-1/2 top-1/2 aspect-square w-3/5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white drop-shadow-sm"
              > 

                <div
                  class="flex h-full w-full flex-col items-center justify-center text-center"
                >
                  <p class="t3">
                    {{
                      Math.floor(
                        (registrationsData?.length /
                          eventDetail.registration_goal) *
                          100
                      )
                    }}%
                  </p>
                  <p class="b3">of Goals</p>
                </div>
              </div>
            </div> -->

            <p class="b1 text-center font-semibold">
              <span class="text-burgundy">{{ registrationsData?.length }}</span>
              from {{ eventDetail.registration_goal }} Registration
            </p>
          </div>
        </div>
        <div class="col-span-2 flex h-full">
          <SumaryOfView
            v-if="viewsData"
            :profile-data="profileData"
            :sumOfViews="totalViewCount"
            :viewsEntries="viewsData[0].views?.length"
            :allRegistration="registrationsData?.length"
          />
        </div>
      </div>
      <div class="grid grid-cols-12 gap-3">
        <div class="col-span-7 flex flex-col gap-3">
          <div
            class="view-by-gender-age rounded-[20px] bg-white p-12 drop-shadow-md"
            v-if="groupedByAgeRangeAndGender"
          >
            <h1 class="b1 font-semibold">
              Age and Gender Breakdown of Event Registrants
            </h1>
            <canvas
              ref="stackChartRef"
              class="h-full"
              style="height: 100%"
            ></canvas>
            <!-- <StackBarChart
              :groupedByAgeRangeAndGender="groupedByAgeRangeAndGender"
              :colors="colors"
            /> -->
          </div>
          <div
            class="view-by-checkin flex flex-col gap-2 rounded-[20px] bg-white p-12 drop-shadow-md"
          >
            <p class="b1 font-semibold">Check-In</p>
            <div
              v-if="Object.keys(groupedByGender).length === 0"
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
                    width: `${(groupedByStatus[status] * 100) / registrationsData?.length}%`,
                  }"
                  :class="`${index === 0 ? 'rounded-l-md' : index === Object.keys(groupedByStatus).length - 1 ? 'rounded-r-md' : ''} w-10`"
                ></div>
              </div>
              <div>
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
        </div>

        <div class="col-span-5 flex flex-col gap-3">
          <div
            class="view-by-gender flex flex-grow flex-col gap-2 rounded-[20px] bg-white p-12 drop-shadow-md"
          >
            <PieChart :groupedByGender="groupedByGender" :colors="colors" />
          </div>
          <div
            class="view-by-feedback flex flex-col gap-2 rounded-[20px] bg-white p-12 drop-shadow-md"
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
                  <Star class="t3 fill-burgundy" />
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
