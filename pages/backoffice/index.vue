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

onMounted(() => {
  // if (process.client) {
  if (profileData.value) {
    user.value = profileData.value;
  }
  // }
});
</script>

<template>
  <div class="ml-80 flex h-full w-screen bg-ghost-white">
    <div class="mx-20 mb-16 mt-32 w-full rounded-3xl bg-white drop-shadow-lg">
      <div class="p-12">
        <h1 class="t1">Welcome to Backoffice</h1>
      </div>
    </div>
  </div>
</template>
