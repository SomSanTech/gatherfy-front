<script setup lang="ts">
import EventList from '~/components/backoffice/EventList.vue';
import type { Event } from '~/models/event';

definePageMeta({
  layout: 'backoffice',
});
const mockAdminLogin = {
  userId: 3,
  firstname: 'Jane',
  lastname: 'Smith',
  username: 'Janesmith',
  gender: 'Female',
  email: 'janesmith@example.com',
  phone: '0987654321',
  role: 'Organization',
};
const eventsData = ref<Event[]>([]);
const adminData = ref();
const fetchData = async () => {
  const fetchedData = await useFetchData(
    `v1/events/registration/${adminData.value.userId}`
  );
  eventsData.value = fetchedData || [];
  console.log(eventsData.value);
};

onMounted(() => {
  localStorage.setItem('admin', JSON.stringify(mockAdminLogin));
  adminData.value = JSON.parse(localStorage.getItem('admin'));
  console.log(adminData.value.userId);
  fetchData();
});
</script>

<template>
  <div class="ml-80 flex h-full w-screen bg-ghost-white">
    <div class="mx-20 mb-16 mt-32 w-full rounded-3xl bg-white drop-shadow-lg">
      <div class="p-12">
        <h1 class="t1">Registrations by event</h1>
        <table
          class="mt-8 w-full table-auto caption-top overflow-scroll text-sm"
        >
          <thead class="">
            <tr class="border-default-300 border-b transition-colors">
              <td
                class="h-14 w-52 px-4 text-base font-semibold text-lavender-gray"
              >
                Event Name
              </td>
              <td
                class="h-14 w-52 px-4 text-base font-semibold text-lavender-gray"
              >
                Location
              </td>
              <!-- <td
                class="h-14 w-64 px-4 text-base font-semibold text-lavender-gray"
              >
                Event
              </td>
              <td
                class="h-14 w-52 px-4 text-center text-base font-semibold text-lavender-gray"
              >
                Status
              </td> -->
              <td
                class="h-14 w-52 px-4 text-center text-base font-semibold text-lavender-gray"
              >
                Action
              </td>
            </tr>
          </thead>
          <tbody class="tbody-container overflow-y-auto">
            <tr
              v-for="event in eventsData"
              class="border-default-300 border-b transition-colors"
            >
              <EventList :event="event" />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
