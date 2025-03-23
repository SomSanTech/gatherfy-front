<script setup lang="ts">
import * as d3 from 'd3';
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
const ageGenderChartRef = ref<HTMLCanvasElement | null>(null);
const ageGenderChartData = ref();
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
    height: 320,
    type: 'line',
    zoom: { enabled: false },
    toolbar: { show: false },
  },
  colors: chartData.value.datasets.map((item) => item.borderColor),
  dataLabels: { enabled: false },
  stroke: { curve: 'smooth', width: 2 },
  title: {
    text: 'Event Participation',
    align: 'center',
    style: { fontSize: '16px', fontWeight: '500', color: '#444' },
  },
  xaxis: {
    categories: chartData.value.labels,
    title: { text: 'Month', style: { color: '#666' } },
    axisBorder: { show: false },
    labels: { style: { colors: '#777' } },
  },
  yaxis: {
    title: { text: 'Participants', style: { color: '#666' } },
    min: 0,
    labels: { style: { colors: '#777' } },
  },
  grid: {
    borderColor: '#ddd',
    strokeDashArray: 5,
  },
  legend: {
    position: 'bottom', // ⬇️ ย้ายมาไว้ข้างล่าง
    horizontalAlign: 'center', // จัดให้อยู่ตรงกลาง
    fontSize: '13px',
    labels: { colors: '#444' }, // เปลี่ยนสีตัวหนังสือให้ดูอ่านง่าย
    markers: {
      width: 10, // ปรับขนาด marker ให้เล็กลง
      height: 10,
      radius: 4, // ทำให้มุมมน
    },
    itemMargin: {
      horizontal: 10, // เพิ่มระยะห่างระหว่าง legend
      vertical: 5,
    },
  },
};

// const options = {
//   series: chartData.value.datasets.map((item) => ({
//     name: item.label,
//     data: item.data,
//   })),
//   chart: {
//     height: 350,
//     type: 'line',
//     zoom: { enabled: false },
//     toolbar: { show: false },
//   },
//   colors: chartData.value.datasets.map((item) => item.borderColor),
//   dataLabels: { enabled: false },
//   stroke: { curve: 'smooth' },
//   title: {
//     text: 'Event Participation',
//     align: 'left',
//   },
//   xaxis: {
//     categories: chartData.value.labels,
//     title: { text: 'Month' },
//   },
//   yaxis: {
//     title: { text: 'Participants' },
//     min: 0,
//   },
//   legend: {
//     position: 'top',
//     horizontalAlign: 'right',
//     floating: true,
//     offsetY: -25,
//     offsetX: -5,
//   },
// };
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
              position: 'right', // ⬇️ ย้าย Legend ไปข้างล่าง
              labels: {
                font: { size: 12, family: 'Poppins' },
                color: '#444', // เปลี่ยนสีให้ซอฟต์ขึ้น
                boxWidth: 12, // ลดขนาดสี่เหลี่ยมสีของ legend
                padding: 15, // เพิ่มระยะห่างให้ดูเป็นระเบียบ
              },
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)', // พื้นหลังโปร่งใสเล็กน้อย
              titleFont: { size: 13, weight: '500' }, // ปรับฟอนต์หัวข้อให้ดูอ่านง่าย
              bodyFont: { size: 12 },
              cornerRadius: 4, // ทำให้ขอบมน
            },
          },
          scales: {
            x: {
              grid: {
                display: false, // ซ่อนเส้น grid แนวนอน
              },
              ticks: {
                font: { size: 12, family: 'Poppins' },
                color: '#666',
              },
            },
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              grid: {
                color: 'rgba(200, 200, 200, 0.3)', // ลดความเข้มของเส้น grid
                borderDash: [5, 5], // ทำให้เป็นเส้นประดูสบายตา
              },
              ticks: {
                font: { size: 12, family: 'Poppins' },
                color: '#666',
                padding: 5, // เพิ่มระยะห่างจากแกน
              },
            },
          },
        },
      });
    } else {
      console.log('Chart canvas not found');
    }
  });
};
function getColor(category: any) {
  const colors = {
    Female: '#D2FF52 ',
    Male: '#deddd7',
    Other: '#1C46F5 ',
    'Prefer not to say': '#131313 ',
  };
  return colors[category] || 'black';
}
const ageGenderLabels = ref();
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

const pastelColors = [
  '#D2FF52', // ฟ้าพาสเทล
  '#DEDDD7', // ม่วงพาสเทล
  '#1C46F5', // เขียวพาสเทล
  '#131313', // ส้มพาสเทล
  '#FFD700', // แดงพาสเทล
  '#FF82A9', // แดงพาสเทล
  '#B4B4B4', // แดงพาสเทล
  '#9A55FF', // แดงพาสเทล
  '#52FFA8', // แดงพาสเทล
  '#FF8C00', // แดงพาสเทล
];

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
        borderColor: pastelColors[index % pastelColors.length], // เลือกสีวนไป
        backgroundColor: pastelColors[index % pastelColors.length]
          .replace('hsl', 'hsla')
          .replace(')', ', 0.2)'), // เพิ่ม transparency
        fill: false,
        tension: 0.4, // ให้เส้นโค้งนุ่มขึ้น แต่ไม่เว้าเกินไป
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
          indexAxis: 'x', // ✅ ทำให้กราฟเป็นแนวนอน
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
            legend: { display: true, position: 'bottom' },
            title: { display: false },
            tooltip: {
              callbacks: {
                footer: (tooltipItems) => {
                  if (!tooltipItems.length) return;

                  let index = tooltipItems[0].dataIndex; // ✅ index ของ bar ที่ hover อยู่
                  let genderSums = {};
                  let totalSum = 0;
                  let colorMap = {
                    Female: '#D2FF52 ',
                    Male: '#deddd7',
                    Other: '#1C46F5 ',
                    'Prefer not to say': '#131313 ',
                  }; // ✅ เก็บสีของแต่ละหมวดหมู่

                  ageGenderChartData.value.forEach((dataset) => {
                    let label = dataset.label; // เช่น "Male", "Female"
                    let value = dataset.data[index]; // ✅ ดึงค่าของ bar ที่ hover
                    let color = dataset.backgroundColor; // ✅ ดึงสีของ dataset

                    if (value > 0) {
                      genderSums[label] = value;
                      colorMap[label] = color;
                      totalSum += value;
                    }
                  });

                  // ✅ แปลงเป็นข้อความ tooltip พร้อมสี
                  // let genderList = Object.entries(genderSums)
                  //   .map(([gender, count]) => {
                  //     let color = colorMap[gender];
                  //     return `● ${gender}: ${count}`; // 🔴 ใช้จุดสีบอก
                  //   })
                  //   .join('\n');

                  // return `${genderList}\nsum: ${totalSum}`;
                  return `sum: ${totalSum}`;
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

watch(ageGenderChartRef, (newValue) => {
  if (newValue) {
    initializeAgeGenderChart();
  }
});
</script>

<template>
  <div class="mb-44 w-full bg-[#EEEEEE]">
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
            class="view-by-month col-span-7 rounded-[20px] border border-white/90 bg-white/70 p-12 drop-shadow-md backdrop-blur-xl"
          >
            <p class="b1 pb-5 font-semibold">
              Monthly Event View Counts (4 months)
            </p>

            <canvas ref="chartCanvasRef" class=""></canvas>
          </div>
          <div
            class="view-by-gender col-span-3 flex h-full flex-col gap-3 rounded-[20px] border border-white/90 bg-white/70 p-12 drop-shadow-md backdrop-blur-xl"
            v-if="groupedByAgeRangeAndGender"
          >
            <h1 class="b1 font-semibold">
              Age and Gender Breakdown of Event Registrants
            </h1>
            <canvas
              ref="ageGenderChartRef"
              class="h-full w-full"
              style="height: 100%"
            ></canvas>
          </div>
        </div>
        <div class="event-list-div grid h-[350px] grid-cols-10 gap-3">
          <div
            class="col-span-10 flex flex-col gap-2 rounded-[20px] pb-10 drop-shadow-md"
          >
            <div>
              <p class="b1 font-semibold">Events</p>
            </div>
            <div class="w-full table-auto caption-top text-sm">
              <div
                class="border-default-300 grid grid-cols-12 border-b transition-colors"
              >
                <p
                  class="col-span-4 px-4 text-base font-semibold text-lavender-gray"
                >
                  Event Name
                </p>
                <p
                  class="col-span-4 px-4 text-base font-semibold text-lavender-gray"
                >
                  Location
                </p>
                <p
                  class="col-span-1 px-4 text-center text-base font-semibold text-lavender-gray"
                >
                  Status
                </p>
                <p
                  class="col-span-3 px-4 text-center text-base font-semibold text-lavender-gray"
                >
                  Action
                </p>
              </div>
              <div class="flex w-full flex-col gap-2 overflow-y-auto">
                <div v-if="eventsData.length === 0" class="text-center">
                  <p colspan="3" class="b1 py-20">No Event</p>
                </div>
                <div
                  v-else
                  v-for="event in eventsData"
                  class="b3 grid h-fit w-full grid-cols-12 content-center gap-6 rounded-md border border-white/90 bg-white/70 p-3 drop-shadow-md backdrop-blur-xl"
                >
                  <p class="col-span-4">{{ event?.eventName }}</p>
                  <p class="col-span-4">{{ event?.eventLocation }}</p>
                  <p
                    class="col-span-1 place-self-center rounded-md bg-blue-300 px-2 py-1"
                  >
                    {{
                      new Date(event?.eventEndDate).getTime() <
                      new Date().getTime()
                        ? 'ended'
                        : 'active'
                    }}
                  </p>
                  <NuxtLink
                    class="go-to-dashboard col-span-3"
                    :to="{
                      path: `/backoffice/dashboard/${event?.eventId}`,
                    }"
                  >
                    <div class="flex items-center justify-center gap-2 p-4">
                      <Dashboard class="t3" />
                      <p class="b3">View dashboard</p>
                    </div>
                  </NuxtLink>
                </div>
                <!-- <tr
                  v-else
                  v-for="event in eventsData"
                  class="event-list border-default-300 cursor-default border-b transition-colors"
                >
                  <EventList :event="event" :type="'dashboard'" />
                  
                </tr> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
