<script setup lang="ts">
import Warning from './icons/Warning.vue';

const props = defineProps<{
  title?: string;
  subTitle?: string;
  isShowCompleteModal?: boolean;
  status?: string;
}>();

const emits = defineEmits(['completeAction', 'cancleAction']);
</script>

<template>
  <div
    :class="
      isShowCompleteModal ? 'opacity-100' : 'pointer-events-none opacity-0'
    "
    class="fixed left-0 top-0 z-50 flex h-screen w-full items-center justify-center bg-dark/40 duration-200"
  >
    <div
      class="absolute flex w-3/4 max-w-[500px] flex-col items-center justify-center gap-4 text-wrap rounded-lg bg-white p-6 drop-shadow-md lg:w-1/3"
    >
      <div class="flex items-center gap-4">
        <div
          class="flex h-fit w-fit shrink-0 items-center justify-center rounded-full border-[1px] border-dark/60 p-2"
        >
          <Trash v-if="status === 'confirm'" class="text-lg" />
          <Cancle v-else-if="status === 'error'" class="text-xl" />
          <Warning v-else-if="status === 'warn'" class="text-xl" />
          <Check v-else class="text-2xl" />
        </div>
        <div class="w-full">
          <div class="b2 break-words font-semibold">{{ title }}</div>
          <p class="b3 break-words">
            {{ subTitle }}
          </p>
        </div>
      </div>
      <div class="flex w-fit gap-2">
        <BtnComp text="OK" @click="$emit('completeAction')" />
        <BtnComp
          v-if="status === 'confirm'"
          text="Cancle"
          @click="$emit('cancleAction')"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
