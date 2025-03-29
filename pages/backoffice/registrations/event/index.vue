<script setup lang="ts">
import EventList from '~/components/backoffice/EventList.vue';
import type { Event } from '~/models/event';
import type { User } from '~/models/user';

definePageMeta({
  layout: 'backoffice',
});
const eventsData = ref<Event[]>([]);
const adminData = ref<User | null>(null);
const isLoading = useState('isLoading');

const accessToken = useCookie('accessToken');
const fetchData = async () => {
  const fetchedData = await useFetchWithAuth(
    `v1/backoffice/events`,
    'GET',
    accessToken.value
  );
  eventsData.value = fetchedData.data || [];
};

onMounted(() => {
  try {
    isLoading.value = true;
    const storedUser = localStorage.getItem('admin');
    adminData.value = storedUser ? JSON.parse(storedUser) : {};
    fetchData();
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <Loader v-if="isLoading" />

  <div v-else class="flex h-full w-screen bg-[#EEEEEE] lg:ml-80 lg:h-screen">
    <div
      class="mx-4 mb-16 mt-32 w-full rounded-3xl bg-white drop-shadow-lg lg:mx-20"
    >
      <div class="p-3 lg:p-12">
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
              <td colspan="6" class="b1 py-20">No Event</td>
            </tr>
            <NuxtLink
              v-else
              v-for="event in eventsData"
              :to="{
                name: 'backoffice-registrations-event-id',
                params: { id: event?.eventId },
              }"
              class="border-default-300 cursor-pointer border-b transition-colors hover:bg-gray-100"
              style="display: table-row"
            >
              <EventList :event="event" :type="'registration'" />
            </NuxtLink>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
