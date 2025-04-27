<script setup lang="ts">
definePageMeta({
  layout: 'backoffice',
});
const profileData = useCookie('profileData');

function parseJSONSafe(value: string | null) {
  try {
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return null;
  }
}

const user = ref();
const isLoading = useState('isLoading');

onMounted(() => {
  // if (process.client) {
  if (profileData.value) {
    user.value = profileData.value;
  }
  isLoading.value = false;

  // }
});
</script>

<template>
  <Loader v-if="isLoading" />

  <div v-else class="flex w-screen bg-mist-grey lg:ml-80">
    <div class="bg-glas mb-16 mt-32 h-fit w-full rounded-3xl p-8 lg:mx-20">
      <div class="p-5 lg:p-12">
        <h1 class="t1 mb-8">Welcome to Backoffice</h1>

        <div
          class="grid grid-cols-1 gap-2 md:grid-cols-2 lg:gap-6 xl:grid-cols-3"
        >
          <div
            class="rounded-2xl bg-white p-4 shadow-md transition hover:shadow-lg lg:p-6"
          >
            <h2 class="b1 mb-2 font-semibold text-gray-700">
              Event Management
            </h2>
            <p class="b2 mb-4 text-gray-500">
              Create, edit, and manage your events easily.
            </p>
            <NuxtLink to="/backoffice/events">
              <button class="b2 font-medium hover:underline">
                Go to Events
              </button>
            </NuxtLink>
          </div>

          <div
            class="rounded-2xl bg-white p-4 shadow-md transition hover:shadow-lg lg:p-6"
          >
            <h2 class="b1 mb-2 font-semibold text-gray-700">
              Registration List
            </h2>
            <p class="b2 mb-4 text-gray-500">
              View and manage participant registrations.
            </p>
            <NuxtLink to="/backoffice/registrations/event">
              <button class="b2 font-medium hover:underline">
                Go to Registrations
              </button>
            </NuxtLink>
          </div>

          <div
            class="rounded-2xl bg-white p-4 shadow-md transition hover:shadow-lg lg:p-6"
          >
            <h2 class="b1 mb-2 font-semibold text-gray-700">Feedback</h2>
            <p class="b2 mb-4 text-gray-500">
              Analyze event feedback and improve experiences.
            </p>
            <NuxtLink to="/backoffice/feedback">
              <button class="b2 font-medium hover:underline">
                Go to Feedback
              </button>
            </NuxtLink>
          </div>

          <div
            class="rounded-2xl bg-white p-4 shadow-md transition hover:shadow-lg lg:p-6"
          >
            <h2 class="b1 mb-2 font-semibold text-gray-700">Check-In System</h2>
            <p class="b2 mb-4 text-gray-500">
              Manage attendee check-ins at your events.
            </p>
            <NuxtLink to="/backoffice/qrscan">
              <button class="b2 font-medium hover:underline">
                Go to Check-In
              </button>
            </NuxtLink>
          </div>

          <div
            class="rounded-2xl bg-white p-4 shadow-md transition hover:shadow-lg lg:p-6"
          >
            <h2 class="b1 mb-2 font-semibold text-gray-700">Dashboard</h2>
            <p class="b2 mb-4 text-gray-500">
              Get an overview of your event statistics and activity.
            </p>
            <NuxtLink to="/backoffice/dashboard">
              <button class="b2 font-medium hover:underline">
                Go to Dashboard
              </button>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
