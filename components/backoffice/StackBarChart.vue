<script setup lang="ts">
const props = defineProps<{
  groupedByAgeRangeAndGender?: any;
  colors?: Object;
}>();
</script>

<template>
  <div class="flex h-full w-full flex-col gap-5">
    <h1 class="b1 font-semibold">
      Age and Gender Breakdown of Event Registrants
    </h1>
    <div
      v-if="Object.keys(groupedByAgeRangeAndGender).length === 0"
      class="flex h-full items-center justify-center"
    >
      <p class="b2">No registration now</p>
    </div>
    <div v-else class="flex flex-col items-center justify-center gap-4">
      <div class="flex items-end gap-8">
        <div
          v-for="demo in Object.keys(groupedByAgeRangeAndGender).sort(
            (a, b) => {
              const ageOrder = {
                '15-19': 1,
                '20-24': 2,
                '25-29': 3,
                '30+': 4,
              };
              return ageOrder[a] - ageOrder[b];
            }
          )"
        >
          <div class="flex flex-col items-center gap-1">
            <div class="flex gap-1">
              <div
                class="flex h-40 w-fit flex-col items-center justify-end drop-shadow-md"
                v-for="gen in Object.keys(
                  groupedByAgeRangeAndGender[demo]
                ).sort((a, b) => {
                  const genderOrder = {
                    Male: 1,
                    Female: 2,
                    Other: 3,
                  };
                  return genderOrder[a] - genderOrder[b];
                })"
              >
                <p class="b4 text-dark-grey/60">
                  {{ groupedByAgeRangeAndGender[demo][gen] }}
                </p>
                <div
                  class="w-5 rounded-md"
                  :style="{
                    backgroundColor: `${colors[gen]}`,
                    height: `${calculateWidth(groupedByAgeRangeAndGender, groupedByAgeRangeAndGender[demo][gen])}%`,
                  }"
                ></div>
              </div>
            </div>
            <p class="b4 text-dark-grey/60">{{ demo }}</p>
          </div>
        </div>
      </div>

      <div class="mt-10 flex justify-center gap-5">
        <div
          v-for="color in Object.keys(colors).sort((a, b) => {
            const genderOrder = {
              Male: 1,
              Female: 2,
              Other: 3,
            };
            return genderOrder[a] - genderOrder[b];
          })"
          class="flex items-center gap-1"
        >
          <div
            class="h-4 w-8 rounded-sm"
            :style="{ backgroundColor: colors[color] }"
          ></div>
          <p class="b4">{{ color }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
