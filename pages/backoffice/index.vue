<script setup lang="ts">
definePageMeta({
  layout: 'backoffice',
});

const mockAdminLogin = {
  userId: 2,
  firstname: 'Jane',
  lastname: 'Smith',
  username: 'Janesmith',
  gender: 'Female',
  email: 'janesmith@example.com',
  phone: '0987654321',
  role: 'Organization',
};

function parseJSONSafe(value: string | null) {
  try {
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    return null;
  }
}

const user = useState('user', () =>
  process.client ? parseJSONSafe(localStorage.getItem('admin')) || {} : {}
);

onMounted(() => {
  if (process.client) {
    const storedAdmin = localStorage.getItem('admin');
    if (!storedAdmin) {
      localStorage.setItem('admin', JSON.stringify(mockAdminLogin));
      user.value = mockAdminLogin;
    } else {
      user.value = parseJSONSafe(storedAdmin) || {};
    }
  }
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
