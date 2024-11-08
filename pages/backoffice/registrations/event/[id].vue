<script setup lang="ts">
import RegistrationList from '~/components/backoffice/RegistrationList.vue';
import type { Registration } from '~/models/registration';

definePageMeta({
  layout: 'backoffice',
});
const route = useRoute();
const param = route.params.id;
const registrationsData = ref<Registration[]>([]);
const isLoading = ref(true);

const fetchData = async () => {
  const fetchedData = await useFetchData(`v1/registrations/event/${param}`);
  registrationsData.value = fetchedData || [];
};

onMounted(() => {
  try {
    isLoading.value = true;
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
        <h1 class="t1">All Registrations</h1>
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
                class="h-14 w-52 px-4 text-base font-semibold text-lavender-gray"
              >
                Attendees Name
              </td>
              <td
                class="h-14 w-52 px-4 text-base font-semibold text-lavender-gray"
              >
                Phone Number
              </td>
              <td
                class="h-14 w-52 px-4 text-base font-semibold text-lavender-gray"
              >
                Email
              </td>
              <td
                class="h-14 w-64 px-4 text-base font-semibold text-lavender-gray"
              >
                Event
              </td>
              <td
                class="h-14 w-52 px-4 text-center text-base font-semibold text-lavender-gray"
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
              v-if="!isLoading && registrationsData.length === 0"
              class="text-center"
            >
              <td colspan="6" class="b1 py-20">No Registration</td>
            </tr>
            <tr
              v-else-if="!isLoading && registrationsData.length != 0"
              v-for="registration in registrationsData"
              class="border-default-300 border-b transition-colors"
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
