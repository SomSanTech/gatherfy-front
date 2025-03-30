<script setup lang="ts">
import RegistrationDetail from '~/components/backoffice/RegistrationDetail.vue';
import Arrow from '~/components/icons/Arrow.vue';

definePageMeta({
  layout: 'backoffice',
});
</script>

<template>
  <div class="ml-80 flex h-fit w-screen bg-mist-grey">
    <div
      class="mx-20 mb-16 mt-32 h-fit w-full rounded-3xl bg-white drop-shadow-lg"
    >
      <div class="p-12">
        <NuxtLink
          to="/backoffice/registrations"
          class="mb-5 flex items-center gap-2 text-dark-grey duration-200 hover:-ml-3"
        >
          <Arrow />
          <p class="b2">Back to registration list</p>
        </NuxtLink>
        <h1 class="regis-detail-title t1">Registrations Detail</h1>
        <RegistrationDetail />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
