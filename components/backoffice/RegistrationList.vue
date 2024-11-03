<script setup lang="ts">
import type { Registration } from '~/models/registration';
import PenEdit from '../icons/PenEdit.vue';
import Trash from '../icons/Trash.vue';

const props = defineProps<{
  registration?: Registration;
}>();
</script>

<template>
  <td class="b2 p-4 align-middle">
    {{ registration?.firstName }} {{ registration?.lastName }}
  </td>
  <td class="b2 p-4 align-middle">
    {{ registration?.phone }}
  </td>
  <td class="b2 p-4 align-middle">
    {{ registration?.email }}
  </td>
  <td class="b2 p-4 align-middle font-medium">
    {{ registration?.eventName }}
  </td>
  <td class="b2 p-4 text-center align-middle">
    <BtnComp
      :text="registration?.status"
      :color="registration?.status == 'pending' ? 'gray' : 'green'"
    />
  </td>
  <td>
    <div class="flex justify-center gap-5 text-xl text-gray-600">
      <NuxtLink
        :to="{
          name: 'backoffice-registrations-id',
          params: { id: registration?.registrationId },
        }"
      >
        <PenEdit />
      </NuxtLink>
      <Trash />
    </div>
  </td>
</template>
