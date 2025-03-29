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
const isLoading = useState('isLoading', () => true);

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

  <div v-else class="flex h-screen w-screen bg-[#EEEEEE] lg:ml-80">
    <div class="bg-glass mx-20 mb-16 mt-32 h-fit w-full rounded-3xl">
      <div class="p-12">
        <h1 class="t1">Welcome to Backoffice</h1>
      </div>
    </div>
  </div>
</template>
