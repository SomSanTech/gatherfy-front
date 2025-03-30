<script setup lang="ts">
import * as d3 from 'd3';
import Chart from 'chart.js/auto';
import type { Registration } from '~/models/registration';
import type { User } from '~/models/user';
import SumaryOfView from '~/components/backoffice/SumaryOfView.vue';
import type { UserProfile } from '~/models/userProfile';

definePageMeta({
  layout: 'backoffice',
});
interface Event {
  eventId: number;
  eventName: string;
  eventLocation: string;
  eventStartDate: string;
  eventEndDate: string;
}
const eventsData = ref<Event[]>([]);
const adminData: any = ref<User | null>(null);
const registrationsData = ref<Registration[]>([]);
const accessToken = useCookie('accessToken');
const profileData = useCookie<UserProfile>('profileData');
const sumOfGender: any = ref(0);
const groupedByGender = ref();
const groupedByAgeRangeAndGender = ref();
const sumOfViews: any = ref(0);
const viewLineChartRef = ref<HTMLCanvasElement | null>(null);
const viewLineChartData: any = ref({
  labels: [],
  datasets: [] as Array<any>,
});
const viewsData = ref();
const ageGenderChartRef = ref<HTMLCanvasElement | null>(null);
const ageGenderChartData = ref();
const ageGenderLabels = ref();
const pieOfRegisChartRef = ref<HTMLCanvasElement | null>(null);
const pieOfRegisChartData = ref();
const isLoading = useState('isLoading');
const lineChartColorSet = [
  '#ff0000',
  '#DEDDD7',
  '#1C46F5',
  '#131313',
  '#FFD700',
  '#FF82A9',
  '#B4B4B4',
  '#ff4e20',
  '#52FFA8',
  '#FF8C00',
];

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

function getColor(category: any) {
  const colors = {
    Female: '#ff823f ',
    Male: '#deddd7',
    Other: '#ff0000 ',
    'Prefer not to say': '#ff4e20 ',
  };
  return colors[category] || 'black';
}

const transformData = (registrations: Registration[]) => {
  const total = registrations.length;
  const checkedIn = registrations.filter(
    (r) => r.status === 'Checked in'
  ).length;
  const unattended = registrations.filter(
    (r) => r.status === 'Unattended'
  ).length;
  const awaitingCheckIn = total - checkedIn - unattended; // คำนวณจากที่เหลือ

  return {
    labels: ['Checked in', 'Awaiting Check-in', 'Unattended'],
    datasets: [
      {
        data: [checkedIn, awaitingCheckIn, unattended],
        backgroundColor: ['#ff0000', '#ff4e20', '#ffd073'],
      },
    ],
  };
};

const fetchAllRegisData = async () => {
  const fetchedData = await useFetchWithAuth(
    `v2/registrations`,
    'GET',
    accessToken.value
  );
  if ('data' in fetchedData) {
    registrationsData.value = fetchedData.data || [];
  }

  // groupedByGender.value = Object.fromEntries(
  //   d3.rollup(
  //     registrationsData.value,
  //     (v) => v.length,
  //     (d) => d.gender
  //   )
  // );

  // sumOfGender.value = Object.values(groupedByGender.value).reduce(
  //   (sum: any, value: any) => sum + value,
  //   0
  // );

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
        (age: string) => groupedByAgeRangeAndGender.value[age]?.[category] || 0
      ),
      backgroundColor: getColor(category),
      stack: 'Stack 0',
      borderRadius: 5,
      width: 5,
    }));

    initializeAgeGenderChart();
  }

  pieOfRegisChartData.value = transformData(registrationsData.value);
};

const fetchAllEventData = async () => {
  const fetchedData = await useFetchWithAuth(
    `v1/backoffice/events`,
    'GET',
    accessToken.value
  );
  if ('data' in fetchedData) {
    eventsData.value = fetchedData.data || [];
  }
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
        viewLineChartData.value.labels = labels;
      }
      const eventData: any = eventsData.value.find(
        (e) => e.eventId === event.event_id
      );

      viewLineChartData.value.datasets.push({
        label: eventData ? `${eventData.eventName}` : 'Unknown event',
        data: data,
        borderColor: lineChartColorSet[index % lineChartColorSet.length],
        backgroundColor: lineChartColorSet[index % lineChartColorSet.length]
          .replace('hsl', 'hsla')
          .replace(')', ', 0.2)'),
        fill: false,
        tension: 0.4,
      });
    });
  }
};

const initializeViewLineChart = () => {
  nextTick(() => {
    if (viewLineChartRef.value) {
      new Chart(viewLineChartRef.value, {
        type: 'line',
        data: viewLineChartData.value,
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
      console.error('Chart canvas not found');
    }
  });
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

const initializePieRegisChart = () => {
  nextTick(() => {
    if (pieOfRegisChartRef.value) {
      new Chart(pieOfRegisChartRef.value, {
        type: 'doughnut',
        data: pieOfRegisChartData.value,
        options: {
          responsive: true,
          layout: {
            padding: {
              bottom: 0, // ปรับระยะห่างระหว่าง chart กับ legend
            },
          },
          plugins: {
            legend: {
              position: 'bottom',
              align: 'start',
              labels: {
                padding: 10, // เพิ่มระยะห่างระหว่าง legend items
                boxWidth: 15, // ขนาดของสี่เหลี่ยมสี
                usePointStyle: true, // ทำให้เป็นวงกลมแทนสี่เหลี่ยม (optional)
              },
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

onMounted(async () => {
  try {
    isLoading.value = true;
    const storedUser = localStorage.getItem('admin');
    adminData.value = storedUser ? JSON.parse(storedUser) : {};
    await fetchAllRegisData();
    await fetchAllEventData();
    await fetchAllViewData();
  } finally {
    setTimeout(() => {
      isLoading.value = false;
    }, 1000);
  }
});

watch(viewLineChartRef, (newValue) => {
  if (newValue) {
    initializeViewLineChart();
  }
});

watch(ageGenderChartRef, (newValue) => {
  if (newValue) {
    initializeAgeGenderChart();
  }
});

watch(pieOfRegisChartRef, (newValue) => {
  if (newValue) {
    initializePieRegisChart();
  }
});
</script>

<template>
  <Loader v-if="isLoading" />

  <div v-else class="w-full bg-[#EEEEEE] pb-24">
    <div
      v-if="eventsData.length === 0"
      class="error-msg flex h-screen w-full items-center justify-center"
    >
      <p class="t3">
        No events to display. Create your first event to get started!
      </p>
    </div>
    <div v-else class="flex h-full lg:ml-80">
      <div class="mt-32 flex w-full flex-col gap-3 px-4 lg:mx-20">
        <SumaryOfView
          v-if="profileData"
          :sumOfViews="sumOfViews?.totalViews"
          :viewsEntries="sumOfViews?.totalEntries"
          :allRegistration="registrationsData?.length"
          :profileData
          format="row"
        />

        <div class="grid gap-3 lg:grid-cols-10">
          <div
            class="view-by-month bg-glass col-span-7 rounded-[20px] p-4 lg:p-12"
          >
            <p class="b1 pb-5 font-semibold">
              Monthly Event View Counts (4 months)
            </p>

            <canvas ref="viewLineChartRef" class=""></canvas>
          </div>
          <div
            class="view-by-gender bg-glass col-span-3 flex h-full flex-col gap-3 rounded-[20px] p-4 lg:p-12"
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
        <div class="grid gap-4 lg:grid-cols-10">
          <div
            class="col-span-3 grid h-full gap-4 md:max-h-[600px] lg:grid-rows-3"
          >
            <div
              v-if="eventsData"
              class="bg-glass row-span-1 flex flex-col gap-2 rounded-[20px] p-6"
            >
              <h1 class="b1 font-semibold">Your Event</h1>
              <p class="b1">
                <span class="text-8xl"> {{ eventsData.length }}</span> Event
              </p>
            </div>
            <div class="bg-glass row-span-2 h-full rounded-[20px] p-12">
              <h1 class="b1 pb-2 font-semibold">
                Registration and Check-in Proportion
              </h1>
              <canvas
                ref="pieOfRegisChartRef"
                class="h-full w-full"
                style="height: 100%"
              ></canvas>
            </div>
          </div>
          <div
            class="col-span-7 flex grid-cols-10 flex-col gap-2 rounded-[20px] drop-shadow-md md:max-h-[600px]"
          >
            <div>
              <p class="b1 font-semibold">Events</p>
            </div>
            <div class="w-full table-auto caption-top text-sm">
              <div
                class="b3 border-default-300 grid grid-cols-12 border-b pb-2 !text-sm transition-colors"
              >
                <p class="px- col-span-4 text-base font-semibold text-black/40">
                  Event Name
                </p>
                <p
                  class="col-span-4 px-2 text-base font-semibold text-black/40"
                >
                  Location
                </p>
                <p
                  class="px- col-span-1 text-center text-base font-semibold text-black/40"
                >
                  Status
                </p>
                <p
                  class="px- col-span-3 text-center text-base font-semibold text-black/40"
                >
                  Action
                </p>
              </div>
              <div class="relative">
                <!-- <div
                  class="absolute left-0 top-0 z-40 h-8 w-full bg-gradient-to-b from-[#EEEEEE]"
                ></div> -->
                <div
                  class="flex w-full flex-col gap-2 overflow-y-auto md:max-h-[550px]"
                >
                  <div v-if="eventsData.length === 0" class="text-center">
                    <p colspan="3" class="b1 py-20">No Event</p>
                  </div>
                  <div
                    v-else
                    v-for="event in eventsData"
                    class="b3 bg-glass grid h-fit w-full grid-cols-12 content-center gap-6 rounded-md p-3"
                  >
                    <p class="col-span-4">{{ event?.eventName }}</p>
                    <p class="col-span-4">{{ event?.eventLocation }}</p>
                    <p
                      :class="
                        new Date(event?.eventEndDate).getTime() <
                        new Date().getTime()
                          ? 'bg-red-300'
                          : 'bg-blue-300'
                      "
                      class="col-span-1 place-self-center rounded-md px-2 py-1"
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
                <!-- <div
                  class="absolute bottom-0 left-0 z-40 h-8 w-full bg-gradient-to-t from-[#EEEEEE]"
                ></div> -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
