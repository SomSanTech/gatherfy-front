<script setup lang="ts">
import type { Registration } from '~/models/registration';
import PenEdit from '../icons/PenEdit.vue';
import Trash from '../icons/Trash.vue';

const props = defineProps<{
  registration?: Registration;
  isShowInQRScan?: boolean;
}>();
</script>

<template>
  <td
    :class="isShowInQRScan ? 'col-span-4 flex items-center text-start' : ''"
    class="back-regis-name b2 p-4 align-middle"
  >
    {{ registration?.firstName }} {{ registration?.lastName }}
  </td>
  <td
    :class="isShowInQRScan ? 'col-span-4 flex items-center' : ''"
    class="back-regis-phone b2 p-4 align-middle"
  >
    {{ registration?.phone }}
  </td>
  <td v-if="!isShowInQRScan" class="back-regis-email b2 p-4 align-middle">
    {{ registration?.email }}
  </td>
  <td
    v-if="!isShowInQRScan"
    class="back-regis-event-name b2 p-4 align-middle font-medium"
  >
    {{ registration?.eventName }}
  </td>
  <td
    :class="
      isShowInQRScan ? 'col-span-2 flex w-full items-center justify-start' : ''
    "
    class="b2 p-4 text-center align-middle"
  >
    <BtnComp
      class="back-regis-status cursor-default"
      :text="
        registration?.status === 'Awaiting Check-in'
          ? 'Awaiting<br/>Check-in'
          : registration?.status
      "
      :color="
        registration?.status == 'Awaiting Check-in'
          ? 'gray'
          : registration?.status === 'Checked in'
            ? 'green'
            : 'status-red'
      "
    />
  </td>
  <td v-if="!isShowInQRScan">
    <div class="flex justify-center gap-5 text-xl text-gray-600">
      <NuxtLink
        class="regis-edit"
        :to="{
          name: 'backoffice-registrations-id',
          params: { id: registration?.registrationId },
        }"
      >
        <PenEdit />
      </NuxtLink>
      <!-- <Trash /> -->
    </div>
  </td>
</template>
