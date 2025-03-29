<script setup lang="ts">
const props = defineProps<{
  title?: string;
  subTitle?: string;
  isShowConfirmModal?: boolean;
}>();

const emits = defineEmits(['confirmAction', 'cancleAction']);
</script>

<template>
  <div
    :class="
      isShowConfirmModal ? 'opacity-100' : 'pointer-events-none opacity-0'
    "
    class="fixed left-1/2 top-0 z-50 flex h-screen w-full -translate-x-1/2 items-center justify-center bg-black/40 duration-200"
  >
    <div
      class="ite flex w-fit gap-4 text-wrap rounded-lg bg-white p-6 drop-shadow-md"
    >
      <div
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-light-grey"
      >
        <Trash />
      </div>
      <div class="">
        <p class="b2 font-semibold">{{ title }}</p>
        <!-- <p class="b3 text-wrap">
          {{ subTitle }}
        </p> -->
        <div class="flex w-fit gap-2 pt-4">
          <BtnComp text="Confirm" @click="$emit('confirmAction')" />
          <BtnComp text="Cancle" @click="$emit('cancleAction')" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
