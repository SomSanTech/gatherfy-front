<script setup lang="ts">
import EventList from '~/components/backoffice/EventList.vue';
import type { Event } from '~/models/event';
import type { User } from '~/models/user';

definePageMeta({
  layout: 'backoffice',
});
const mockAdminLogin = {
  userId: 2,
  firstname: 'Jane',
  lastname: 'Smith',
  username: 'Janesmith',
  gender: 'Female',
  email: 'janesmith@example.com',
  phone: '0987654321',
  role: 'Organization',
};
const eventsData = ref<Event[]>([]);
const adminData = ref<User | null>(null);
const isLoading = ref(true);
const fetchData = async () => {
  const fetchedData = await useFetchData(
    `v1/events/owner/${adminData.value?.userId}`
  );
  eventsData.value = fetchedData || [];
};

onMounted(() => {
  try {
    isLoading.value = true;
    localStorage.setItem('admin', JSON.stringify(mockAdminLogin));
    const storedUser = localStorage.getItem('admin');
    adminData.value = storedUser ? JSON.parse(storedUser) : {};
    fetchData();
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="ml-80 flex h-full w-screen bg-ghost-white">
    <div class="mx-20 mb-16 mt-32 w-full rounded-3xl bg-white drop-shadow-lg">
      <div class="p-12">
        <h1 class="t1">Registrations by event</h1>
        <div v-if="isLoading" class="my-16 flex items-center justify-center">
          <span class="loader"></span>
        </div>
        <table
          v-else
          class="mt-8 w-full table-auto caption-top overflow-scroll text-sm"
        >
          <thead class="">
            <tr class="border-default-300 border-b transition-colors">
              <td
                class="h-14 w-64 px-4 text-base font-semibold text-lavender-gray"
              >
                Event Name
              </td>
              <td
                class="h-14 w-48 px-4 text-base font-semibold text-lavender-gray"
              >
                Location
              </td>
              <td
                class="h-14 w-52 px-4 text-center text-base font-semibold text-lavender-gray"
              >
                Action
              </td>
            </tr>
          </thead>
          <tbody class="tbody-container overflow-y-auto">
            <tr v-if="eventsData.length === 0" class="text-center">
              <td colspan="3" class="b1 py-20">No Event</td>
            </tr>
            <tr
              v-else
              v-for="event in eventsData"
              class="border-default-300 cursor-default border-b transition-colors"
            >
              <EventList :event="event" :type="'event'" />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
