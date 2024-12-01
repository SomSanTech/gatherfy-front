<script setup lang="ts">
import RegistrationList from '~/components/backoffice/RegistrationList.vue';
import type { Registration } from '~/models/registration';
import type { User } from '~/models/user';

definePageMeta({
  layout: 'backoffice',
});
const registrationsData = ref<Registration[]>([]);
const adminData = ref<User | null>(null);
const isLoading = ref(true);

const fetchData = async () => {
  const fetchedData = await useFetchData(
    `v1/registrations/owner/${adminData.value?.userId}`
  );
  registrationsData.value = fetchedData || [];
  // registrationsData.value =  [];
  console.log(registrationsData.value);
};

onMounted(() => {
  try {
    isLoading.value = true;
    const storedUser = localStorage.getItem('admin');
    adminData.value = storedUser ? JSON.parse(storedUser) : {};
    fetchData();
    console.log(registrationsData.value);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="ml-80 flex h-full w-screen bg-ghost-white">
    <div class="mx-20 mb-16 mt-32 w-full rounded-3xl bg-white drop-shadow-lg">
      <div class="p-12">
        <h1 class="back-regis-title t1">All Registrations</h1>
        <div v-if="isLoading" class="my-16 flex items-center justify-center">
          <span class="loader"></span>
        </div>
        <div
          v-else-if="registrationsData.length === 0"
          class="my-16 flex items-center justify-center"
        >
          <p class="error-text b1">No Registration</p>
        </div>
        <table
          v-else
          class="mt-8 w-full table-auto caption-top overflow-scroll text-sm"
        >
          <thead class="">
            <tr class="border-default-300 border-b transition-colors">
              <td
                class="regis-list-name h-14 w-52 px-4 text-base font-semibold text-lavender-gray"
              >
                Attendees Name
              </td>
              <td
                class="regis-list-phone h-14 w-52 px-4 text-base font-semibold text-lavender-gray"
              >
                Phone Number
              </td>
              <td
                class="regis-list-email h-14 w-52 px-4 text-base font-semibold text-lavender-gray"
              >
                Email
              </td>
              <td
                class="regis-list-event-name h-14 w-64 px-4 text-base font-semibold text-lavender-gray"
              >
                Event
              </td>
              <td
                class="regis-list-status h-14 w-52 px-4 text-center text-base font-semibold text-lavender-gray"
              >
                Status
              </td>
              <td
                class="h-14 w-52 px-4 text-center text-base font-semibold text-lavender-gray"
              >
                Action
              </td>
            </tr>
          </thead>
          <tbody class="tbody-container overflow-y-auto">
            <tr
              v-for="registration in registrationsData"
              class="regis-list border-default-300 cursor-default border-b transition-colors"
            >
              <RegistrationList :registration="registration" />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
