<script setup lang="ts">
import PenEdit from '../icons/PenEdit.vue';
import Trash from '../icons/Trash.vue';

const props = defineProps<{
  event?: Event;
}>();

interface Event {
  eventId: number;
  eventName: string;
  eventLocation: string;
}
</script>

<template>
  <td class="b2 p-4 align-middle">
    {{ event?.eventName }}
  </td>
  <td class="b2 p-4 align-middle">
    {{ event?.eventLocation }}
  </td>
  <!-- <td class="b2 p-4 text-center align-middle">
    <BtnComp
      :text="event?.status"
      :color="event?.status == 'pending' ? 'gray' : 'green'"
    />
  </td> -->
  <td>
    <div class="flex justify-center gap-5 text-xl text-gray-600">
      <NuxtLink
        :to="{
          name: 'backoffice-registrations-event-id',
          params: { id: event?.eventId },
        }"
      >
        <PenEdit />
      </NuxtLink>
      <Trash />
    </div>
  </td>
</template>
