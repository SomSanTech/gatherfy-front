<script setup lang="ts">
import type { Registration } from '~/models/registration';
import PenEdit from './icons/PenEdit.vue';
import Trash from './icons/Trash.vue';

const props = defineProps<{
  registration?: Registration;
}>();
</script>

<template>
  <td
    class="text-default-600 p-4 align-middle last:text-right rtl:last:text-left"
  >
    {{ registration?.attendee }}
  </td>
  <td
    class="text-default-600 p-4 align-middle last:text-right rtl:last:text-left"
  >
    {{ registration?.phone }}
  </td>
  <td class="p-4 align-middle last:text-right">
    {{ registration?.email }}
  </td>
  <td class="text-default-600 p-4 align-middle font-semibold">
    {{ registration?.event }}
  </td>
  <td
    class="text-default-600 p-4 text-center align-middle text-sm font-normal last:text-right rtl:last:text-left"
  >
    <BtnComp
      :text="registration?.status"
      :color="registration?.status == 'Going' ? 'gray' : 'green'"
    />
  </td>
  <td>
    <div class="flex justify-center gap-5 text-xl text-gray-600">
      <PenEdit />
      <Trash />
    </div>
  </td>
</template>
