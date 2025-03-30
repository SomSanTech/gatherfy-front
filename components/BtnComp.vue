<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    text?: string;
    color?: string;
    isLoading?: boolean;
    isBold?: boolean;
    size?: 'small' | 'mini';
  }>(),
  {
    text: 'Default Text',
    color: '#000000',
    isLoading: false,
    isBold: true,
  }
);

const btnColor = computed(() => {
  if (props.color === 'red') {
    return 'bg-burgundy hover:bg-burgundy-dark text-light-grey';
  } else if (props.color === 'outline-red') {
    return ' border-2 border-burgundy hover:bg-burgundy text-burgundy hover:text-light-grey';
  } else if (props.color === 'black') {
    return 'bg-dark hover:bg-dark-grey text-light-grey';
  } else if (props.color === 'green') {
    return 'bg-green-light/25 text-green-dark';
  } else if (props.color === 'status-red') {
    return 'bg-red-light/25 text-burgundy';
  } else if (props.color === 'gray') {
    return 'bg-mist-grey text-lavender-gray';
  } else if (props.color === 'blue') {
    return 'bg-bright-blue/15 text-bright-blue hover:bg-bright-blue hover:text-white';
  } else {
    return 'bg-light-grey hover:bg-grey text-dark';
  }
});
</script>

<template>
  <button
    :class="`btn ${size === 'small' ? 'b4 rounded-md px-3 py-1' : size === 'mini' ? 'b4 rounded-sm px-2' : 'b3 rounded-lg px-5 py-2'} flex w-fit items-center gap-2 ${isBold ? 'font-semibold' : 'font-normal'} duration-200 ${btnColor}`"
  >
    <p v-html="text"></p>
    <div v-if="isLoading" class="load h-3 w-3"></div>
  </button>
</template>
