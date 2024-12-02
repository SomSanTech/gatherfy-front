<script setup lang="ts">
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

onMounted(() => {
  if (props.groupedByGender && props.colors) {
    conicGradientStyle.value = `conic-gradient(${generateConicGradient(props.groupedByGender, props.colors)})`;
  }
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
      class="flex h-full w-full flex-row items-center justify-center gap-5"
    >
      <div class="relative flex h-full w-full items-center justify-center">
        <div
          class="aspect-square w-3/4 rounded-full drop-shadow-lg"
          :style="{ background: conicGradientStyle }"
        ></div>
        <div
          class="absolute left-1/2 top-1/2 aspect-square w-2/4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white drop-shadow-sm"
        ></div>
      </div>
      <div class="w-2/3">
        <ul class="m-0 list-none p-0" v-if="groupedByGender">
          <li
            v-for="(data, index) in Object.keys(groupedByGender).sort(
              (a, b) => {
                const genderOrder: Record<'Male' | 'Female' | 'Other', number> =
                  {
                    Male: 1,
                    Female: 2,
                    Other: 3,
                  };
                return (
                  genderOrder[a as keyof typeof genderOrder] -
                  genderOrder[b as keyof typeof genderOrder]
                );
              }
            )"
            :key="index"
            class="b3 flex items-center gap-2"
          >
            <span
              v-if="colors"
              :style="{ backgroundColor: colors[data] }"
              class="h-3 w-3 rounded-full drop-shadow-sm"
            ></span>
            {{ data }} [{{ groupedByGender[data] }}]
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
