<script setup lang="ts">
definePageMeta({
  layout: 'backoffice',
});
</script>

<template>
  <div class="ml-80 flex h-fit w-screen bg-ghost-white">
    <div
      class="mx-20 mb-16 mt-32 h-fit w-full rounded-3xl bg-white drop-shadow-lg"
    >
      <div class="p-12">
        <h1 class="t1">All Registrations</h1>
        <AttendeeDetail />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
