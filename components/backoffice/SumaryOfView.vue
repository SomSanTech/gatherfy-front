<script setup lang="ts">
import type { User } from '~/models/user';
import RegisPeople from '~/components/icons/RegisPeople.vue';
import AllViews from '~/components/icons/AllViews.vue';
import AvgViews from '~/components/icons/AvgViews.vue';

const props = defineProps<{
  adminData?: User;
  allRegistration?: Number;
  sumOfViews?: Number;
  viewsEntries?: Number;
  format?: String;
}>();

const totalViews = props.sumOfViews ?? 0;
const totalEntries = props.viewsEntries ?? 0;

const someCalculation = Math.round(totalViews / totalEntries);
</script>

<template>
  <div
    :class="`${format === 'row' ? 'grid grid-cols-4' : 'flex flex-grow'} h-full w-full gap-3`"
  >
    <div
      v-if="format === 'row'"
      class="col-span-1 flex h-24 w-full items-center justify-between rounded-[20px] bg-white p-3 px-6 drop-shadow-md"
    >
      <p class="t3">Hi, {{ adminData?.firstname }} {{ adminData?.lastname }}</p>
    </div>
    <div
      :class="`${format === 'row' ? 'col-span-3 flex h-24' : 'flex flex-grow flex-col'} h-full gap-3`"
    >
      <div
        :class="`${format === 'row' ? 'flex-row' : 'flex-col items-center justify-center text-center'} flex w-full flex-grow items-center justify-between gap-3 rounded-[20px] bg-white p-3 px-6 drop-shadow-md`"
      >
        <RegisPeople class="text-5xl" />
        <div>
          <p class="t3">
            {{ allRegistration }}
          </p>
          <p class="b3">Registrations</p>
        </div>
      </div>
      <div
        :class="`${format === 'row' ? 'flex-row' : 'flex-col items-center justify-center text-center'} flex w-full items-center justify-between gap-3 rounded-[20px] bg-white p-3 px-6 drop-shadow-md`"
      >
        <AllViews class="text-5xl" />
        <div>
          <p class="t3 font-semibold">{{ sumOfViews }}</p>
          <p class="b3">Views</p>
        </div>
      </div>
      <div
        :class="`${format === 'row' ? 'flex-row' : 'flex-col items-center justify-center text-center'} flex w-full items-center justify-between gap-3 rounded-[20px] bg-white p-3 px-6 drop-shadow-md`"
      >
        <AvgViews class="text-5xl" />
        <div>
          <p class="t3">
            {{ someCalculation }}
            <span class="b3 font-normal">per day</span>
          </p>
          <p class="b3">Views</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
