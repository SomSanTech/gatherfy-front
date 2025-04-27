<script setup lang="ts">
import RegistrationList from '~/components/backoffice/RegistrationList.vue';
import Arrow from '~/components/icons/Arrow.vue';
import type { Registration } from '~/models/registration';

definePageMeta({
  layout: 'backoffice',
});
const route = useRoute();
const param = route.params.id;
const registrationsData = ref<Registration[]>([]);
const isLoading = ref(true);
const accessToken = useCookie('accessToken');

const fetchData = async () => {
  const fetchedData = await useFetchWithAuth(
    `v2/registrations/event/${param}`,
    'GET',
    accessToken.value
  );
  registrationsData.value = fetchedData.data || [];
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
  <div class="flex w-screen bg-mist-grey px-3 lg:ml-80 lg:px-0">
    <div
      class="mb-16 mt-32 h-fit w-full rounded-3xl bg-white drop-shadow-lg lg:mx-20"
    >
      <div class="p-5 lg:p-12">
        <NuxtLink
          to="/backoffice/registrations/event"
          class="mb-5 flex items-center gap-2 text-dark-grey duration-200 hover:-ml-3"
        >
          <Arrow />
          <p class="b2">Back to event list</p>
        </NuxtLink>
        <h1 class="back-regis-title t1">Event Registration</h1>
        <div v-if="isLoading" class="my-16 flex items-center justify-center">
          <span class="loader"></span>
        </div>
        <div v-else class="w-full overflow-x-auto">
          <table
            class="mt-8 w-full table-auto caption-top overflow-scroll text-sm"
          >
            <thead class="">
              <tr class="border-default-300 border-b transition-colors">
                <td
                  class="regis-list-name h-14 w-52 px-4 text-base font-semibold text-lavender-gray"
                >
                  Name
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
                v-if="!isLoading && registrationsData.length === 0"
                class="text-center"
              >
                <td colspan="6" class="b1 py-20">No Registration</td>
              </tr>
              <tr
                v-else-if="!isLoading && registrationsData.length != 0"
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
  </div>
</template>

<style scoped></style>
