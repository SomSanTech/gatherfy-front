<script setup lang="ts">
const props = defineProps<{
  text?: string;
  btnText?: string;
  showPopup?: boolean;
}>();

const emit = defineEmits(['handleBasicPopAction']);

const handleAction = () => {
  emit('handleBasicPopAction');
};
</script>

<template>
  <div
    v-show="showPopup"
    class="fixed right-1/2 top-1/2 z-50 flex -translate-y-1/2 translate-x-1/2 flex-col items-center justify-center gap-5 overflow-y-auto rounded-lg bg-white p-3 shadow-2xl lg:w-[400px] lg:p-7"
  >
    <p class="b2 text-center" v-html="text"></p>
    <BtnComp @click="handleAction" :text="btnText" />
  </div>
</template>

<style scoped></style>
