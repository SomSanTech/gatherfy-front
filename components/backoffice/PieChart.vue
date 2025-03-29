<script setup lang="ts">
import Chart from 'chart.js/auto';

const props = defineProps<{
  groupedByGender?: any;
  colors?: Record<string, string>;
}>();
const conicGradientStyle = ref();

watch(
  () => props.groupedByGender,
  (newValue) => {
    if (newValue && props.colors) {
      conicGradientStyle.value = `conic-gradient(${generateConicGradient(props.groupedByGender, props.colors)})`;
    }
  },
  { immediate: true }
);
const chartData = ref();
const donutChartInstance = ref<Chart | null>(null);
const generateChartData = (
  groupByGender: Record<string, number>,
  colors: any
) => {
  return {
    labels: Object.keys(groupByGender),
    datasets: [
      {
        label: 'Gender Distribution',
        data: Object.values(groupByGender),
        backgroundColor: Object.keys(groupByGender).map((key) => colors[key]),
        borderRadius: 5,
        hoverOffset: 20,
      },
    ],
  };
};

const donutChartRef = ref<HTMLCanvasElement | null>(null);

const initializeDonutChart = () => {
  nextTick(() => {
    if (donutChartRef.value) {
      if (donutChartInstance.value) {
        donutChartInstance.value.destroy();
      }
      new Chart(donutChartRef.value, {
        type: 'doughnut',
        data: chartData.value,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
              // gap: 5,
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
watch(donutChartRef, (newValue) => {
  if (newValue) {
    initializeDonutChart();
  }
});
onMounted(() => {
  chartData.value = generateChartData(props.groupedByGender, props.colors);

  if (props.groupedByGender && props.colors) {
    conicGradientStyle.value = `conic-gradient(${generateConicGradient(props.groupedByGender, props.colors)})`;
  }
  initializeDonutChart();
});
</script>

<template>
  <div class="h-full">
    <p class="b1 font-semibold">Gender Breakdown of Registrants</p>
    <div
      v-if="Object.keys(groupedByGender).length === 0"
      class="mt-2 flex items-center justify-center"
    >
      <p class="b2">No registration now</p>
    </div>
    <div
      v-else
      class="flex h-full w-full flex-row items-center justify-center gap-5 p-10"
    >
      <canvas ref="donutChartRef" class=""></canvas>
    </div>
  </div>
</template>

<style scoped></style>
