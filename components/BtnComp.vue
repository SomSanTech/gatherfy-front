<script setup lang="ts">
const props = defineProps<{
  text?: string;
  color?: string;
}>();

const btnColor = computed(() => {
  if (props.color === 'red') {
    return 'bg-burgundy hover:bg-[#A61010] text-light-grey';
  } else if (props.color === 'outline-red') {
    return ' border-2 border-burgundy hover:bg-burgundy text-burgundy hover:text-light-grey';
  } else if (props.color === 'black') {
    return 'bg-black/90 hover:bg-dark-grey text-light-grey';
  } else if (props.color === 'green') {
    return 'bg-[#16C098]/25 text-[#008767]';
  } else if (props.color === 'status-red') {
    return 'bg-[#F25C5C]/25 text-[#D22F2F]';
  } else if (props.color === 'gray') {
    return 'bg-[#E8E8E8] text-[#939393]';
  } else if (props.color === 'blue') {
    return 'bg-[#0085DB]/15 text-[#0085DB] hover:bg-[#0085DB] hover:text-white';
  } else {
    return 'bg-light-grey hover:bg-grey text-black-1';
  }
});
</script>

<template>
  <button
    :class="`btn b3 w-fit rounded-md px-6 py-2 font-semibold duration-200 ${btnColor}`"
  >
    <p v-html="text"></p>
  </button>
</template>
