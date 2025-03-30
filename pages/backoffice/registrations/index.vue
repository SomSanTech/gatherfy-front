<script setup lang="ts">
import RegistrationList from '~/components/backoffice/RegistrationList.vue';
import type { Registration } from '~/models/registration';
import type { User } from '~/models/user';

definePageMeta({
  layout: 'backoffice',
});
const registrationsData = ref<Registration[]>([]);
const adminData = ref<User | null>(null);
const isLoading = useState('isLoading');

const accessToken = useCookie('accessToken');

const fetchData = async () => {
  const fetchedData = await useFetchWithAuth(
    `v2/registrations`,
    'GET',
    accessToken.value
  );
  if ('data' in fetchedData) registrationsData.value = fetchedData.data || [];
  // registrationsData.value =  [];
};

onMounted(() => {
  try {
    const storedUser = localStorage.getItem('admin');
    adminData.value = storedUser ? JSON.parse(storedUser) : {};
    fetchData();
  } finally {
    setTimeout(() => {
      isLoading.value = false;
    }, 900);
  }
});
</script>

<template>
  <Loader v-if="isLoading" />

  <div v-else class="flex w-screen bg-[#EEEEEE] lg:ml-80">
    <div
      class="mx-3 mb-16 mt-32 h-fit w-full rounded-3xl bg-white drop-shadow-lg lg:mx-20"
    >
      <div class="p-3 lg:p-12">
        <h1 class="back-regis-title t1">All Registrations</h1>

        <div
          v-if="registrationsData.error || registrationsData.length === 0"
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
              <RegistrationList
                @deleteRegis="handleDeleteRegis"
                :registration="registration"
              />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
