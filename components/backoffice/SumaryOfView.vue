<script setup lang="ts">
import type { UserProfile } from '~/models/userProfile';
import RegisPeople from '~/components/icons/RegisPeople.vue';
import AllViews from '~/components/icons/AllViews.vue';
import AvgViews from '~/components/icons/AvgViews.vue';

const props = defineProps<{
  profileData: UserProfile;
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
    :class="`overall ${format === 'row' ? 'grid grid-cols-4' : 'flex flex-grow'} h-full w-full gap-3`"
  >
    <div
      v-if="format === 'row'"
      class="col-span-1 flex w-full items-center justify-between rounded-[20px] border border-white/90 bg-white/70 p-3 px-6 drop-shadow-md backdrop-blur-xl"
    >
      <p class="t3">Hi, {{ profileData?.username }}</p>
    </div>
    <div
      :class="`${format === 'row' ? 'col-span-3 flex h-24' : 'grid w-full grid-rows-3'} h-full gap-3`"
    >
      <div
        :class="`${format === 'row' ? 'flex-row' : 'flex-row'} items- flex w-full flex-grow justify-between gap-3 rounded-[20px] border border-white/90 bg-white/70 p-4 drop-shadow-md backdrop-blur-xl`"
      >
        <div>
          <div class="flex flex-col gap-4">
            <p class="b3">Registrations</p>
            <p class="b1 !text-5xl">
              {{ allRegistration }}
            </p>
          </div>
        </div>
        <RegisPeople class="self-start !fill-black/70 text-4xl" />
      </div>
      <div
        :class="`${format === 'row' ? 'flex-row' : 'flex-row'} items- flex w-full justify-between gap-3 rounded-[20px] border border-white/90 bg-white/70 p-4 drop-shadow-md backdrop-blur-xl`"
      >
        <div class="flex flex-col gap-4">
          <p class="b3">Views</p>
          <p class="b1 !text-5xl">{{ sumOfViews }}</p>
        </div>
        <AllViews class="!fill-black/70 text-4xl" />
      </div>
      <div
        :class="`${format === 'row' ? 'flex-row' : 'flex-row'} items- flex w-full justify-between gap-3 rounded-[20px] border border-white/90 bg-white/70 p-4 drop-shadow-md backdrop-blur-xl`"
      >
        <div class="flex flex-col gap-4">
          <p class="b3">Views</p>
          <p class="b3">
            <span class="!text-5xl">
              {{ someCalculation }}
            </span>
            <span class="b3 font-normal">per day</span>
          </p>
        </div>
        <AvgViews class="!fill-black/70 text-4xl" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
