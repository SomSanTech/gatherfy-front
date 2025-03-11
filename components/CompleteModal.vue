<script setup lang="ts">
const props = defineProps<{
  title?: string;
  subTitle?: string;
  isShowCompleteModal?: boolean;
}>();

const emits = defineEmits(['confirmAction', 'cancleAction']);
</script>

<template>
  <div
    :class="
      isShowCompleteModal ? 'opacity-100' : 'pointer-events-none opacity-0'
    "
    class="fixed left-1/2 top-0 z-50 flex h-screen w-full -translate-x-1/2 items-center justify-center bg-black/40 duration-200"
  >
    <div
      class="flex w-fit gap-4 text-wrap rounded-lg bg-white p-6 drop-shadow-md"
    >
      <div
        class="flex h-fit w-fit shrink-0 items-center justify-center rounded-full border-[1px] border-black/60"
      >
        <Check class="text-2xl" />
      </div>
      <div class="">
        <p class="b2 font-semibold">{{ title }}</p>
        <div class="b3 w-fit whitespace-pre-wrap text-wrap break-words">
          {{ subTitle }}
        </div>
        <div class="flex w-fit gap-2 pt-4">
          <BtnComp text="Ok" @click="$emit('confirmAction')" />
          <!-- <BtnComp text="Cancle" @click="$emit('cancleAction')" /> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
