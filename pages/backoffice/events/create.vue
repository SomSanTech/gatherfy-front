<script setup lang="ts">
import EventDetail from '~/components/backoffice/EventDetail.vue';
import Arrow from '~/components/icons/Arrow.vue';

definePageMeta({
  layout: 'backoffice',
});

const route = useRoute();
const param = route.params.id;
</script>

<template>
  <div class="ml-80 flex h-fit w-screen bg-ghost-white">
    <div
      class="mx-20 mb-16 mt-32 h-fit w-full rounded-3xl bg-white drop-shadow-lg"
    >
      <div class="p-12">
        <NuxtLink
          to="/backoffice/events"
          class="mb-5 flex items-center gap-2 text-dark-grey duration-200 hover:-ml-3"
        >
          <Arrow />
          <p class="b2">Back to event list</p>
        </NuxtLink>
        <div class="grid grid-cols-2">
          <h1 class="regis-detail-title t1">Event Detail</h1>
          <!-- <NuxtLink :to="{
            name: `backoffice-feedback-id`,
            params: { id: param },
          }" class="flex justify-end">
            <BtnComp text="Manage Feedback" color="blue" />
          </NuxtLink> -->
        </div>

        <EventDetail />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
