<script setup lang="ts">
import EventList from '~/components/backoffice/EventList.vue';
import type { Event } from '~/models/event';
import type { User } from '~/models/user';
import type { UserProfile } from '~/models/userProfile';

definePageMeta({
  layout: 'backoffice',
});
const profileData = useCookie('profileData');
const isLoading = useState('isLoading');

const eventsData = ref<Event[]>([]);
const adminData = ref<UserProfile>();
const deleteAlert = ref(false);
const deleteAlertMessage = ref('');
const deletePopup = ref(false);
const eventDataDelete = ref();
const accessToken = useCookie('accessToken');
// const refreshToken = useCookie('refreshToken');

const fetchData = async () => {
  const fetchedData = await useFetchWithAuth(
    `v1/backoffice/events`,
    'GET',
    accessToken.value
  );
  eventsData.value = fetchedData.data || [];
};
function handleDeleteEvent(event: Event) {
  eventDataDelete.value = event;
  deletePopup.value = true;
  document.body.style.overflow = 'hidden';
}
function closeDeletePopup() {
  deletePopup.value = false;
  document.body.style.overflow = '';
}
async function deleteEvent() {
  const fetchedDeleteData = await useFetchWithAuth(
    `v2/backoffice/events/${eventDataDelete.value.eventId}`,
    'DELETE',
    accessToken.value
  );
  if (fetchedDeleteData.status === 200) {
    closeDeletePopup();
    deleteAlertMessage.value = 'Event is removed';
    eventsData.value = eventsData.value.filter(
      (event) => event.eventId !== eventDataDelete.value.eventId
    );
  } else {
    deleteAlertMessage.value = 'Something went wrong';
  }
  deleteAlert.value = true;
  setTimeout(() => {
    deleteAlert.value = false;
  }, 3000);
}
onMounted(() => {
  try {
    if (profileData.value) {
      adminData.value = profileData.value;
    }

    fetchData();
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <Loader v-if="isLoading" />

  <div v-else class="flex w-screen bg-[#EEEEEE] lg:ml-80">
    <div class="bg-glass mx-5 mb-16 mt-32 h-fit w-full rounded-3xl lg:mx-20">
      <div class="p-5 lg:p-12">
        <div class="grid grid-cols-2">
          <h1 class="t1">Event list</h1>
          <NuxtLink
            :to="{
              name: `backoffice-events-create`,
            }"
            class="flex justify-end"
          >
            <BtnComp text="Create event" color="blue" />
          </NuxtLink>
        </div>
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
              <EventList
                :event="event"
                :type="'event'"
                @handle-delete-event="handleDeleteEvent"
              />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <div
    v-if="deletePopup"
    :class="deletePopup ? 'scale-100 opacity-100' : 'scale-0 opacity-0'"
    class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm duration-500"
  >
    <div
      class="relative w-2/3 overflow-auto rounded-xl border border-opacity-5 bg-white pt-5 shadow-lg lg:w-[30%] lg:px-14"
    >
      <div class="px-6 pb-6 pt-5 text-center">
        <img
          src="/components/images/warning.png"
          width="50"
          class="mx-auto mb-5"
        />
        <h2 class="t3">Delete Event</h2>
        <h3 class="b2 mb-6 mt-5 font-normal">
          You'r going to delete the
          <span class="font-semibold">{{ eventDataDelete?.eventName }}.</span>
          Are you sure?
        </h3>
        <button
          @click="deleteEvent"
          class="b3 mr-2 inline-flex items-center rounded-lg bg-red-600 px-3 py-2.5 text-center font-medium text-white hover:bg-red-800 focus:ring-4 focus:ring-red-300"
        >
          Yes, Delete!
        </button>
        <button
          @click="closeDeletePopup"
          class="b3 inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-center font-medium text-gray-900 hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200"
        >
          No, Keep it.
        </button>
      </div>
    </div>
  </div>
  <div
    :class="
      deleteAlert ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
    "
    class="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-xl border border-red-400 bg-red-100 px-20 py-3 text-red-700 duration-500"
    role="alert"
  >
    <p class="b2">{{ deleteAlertMessage }}</p>
  </div>
</template>

<style scoped></style>
