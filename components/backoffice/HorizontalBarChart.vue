<script setup lang="ts"></script>

<template>
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
</template>

<style scoped></style>
