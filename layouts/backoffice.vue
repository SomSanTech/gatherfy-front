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
      class="fixed left-4 top-4 z-50 p-2 md:hidden"
    >
      <button v-if="!isSidebarOpen && !isLoading">
        <Burger class="text-2xl" />
      </button>
      <button v-else :class="!isLoading ? '' : 'hidden'"><Cancle /></button>
    </button>

    <!-- Sidebar (แสดงซ่อนตาม isSidebarOpen) -->
    <SideBar
      v-if="!isLoading"
      :class="isSidebarOpen ? '' : 'hidden lg:flex'"
      :isOpen="isSidebarOpen"
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
