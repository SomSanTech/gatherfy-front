<script setup lang="ts">
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

onMounted(() => {
  localStorage.setItem('admin', JSON.stringify(mockAdminLogin));
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
