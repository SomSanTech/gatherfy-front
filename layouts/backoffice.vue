<!-- layouts/backoffice.vue -->
<template>
  <!-- <div class="backoffice-layout">
    
    <SideBar />
    <slot />
  </div> -->
  <div class="relative flex">
    <!-- Burger Button -->
    <button
      @click="isSidebarOpen = !isSidebarOpen"
      class="fixed left-4 top-4 z-50 rounded-lg bg-gray-200 p-2 shadow-lg md:hidden"
    >
      <Cancle v-if="!isSidebarOpen" />
      <Trash v-else />
    </button>

    <!-- Sidebar (แสดงซ่อนตาม isSidebarOpen) -->
    <SideBar
      v-if="!isLoading"
      :is-open="isSidebarOpen"
      @close="isSidebarOpen = false"
    />

    <slot />
  </div>
</template>

<script setup>
import SideBar from '~/components/backoffice/SideBar.vue';
import Cancle from '~/components/icons/Cancle.vue';

const route = useRoute();
const error = useError();

const isErrorPage = computed(() => {
  return error.value !== null || route.path.includes('error');
});

const isSidebarOpen = ref(false); // ค่าดีฟอลต์ปิดอยู่
const isLoading = useState('isLoading', () => true);
</script>

<style scoped>
.backoffice-layout {
  display: flex;
}
</style>
