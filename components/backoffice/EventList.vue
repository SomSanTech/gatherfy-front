<script setup lang="ts">
import PenEdit from '../icons/PenEdit.vue';
import Trash from '../icons/Trash.vue';
import UserList from '../icons/UserList.vue';

const props = defineProps<{
  event?: Event;
  type?: string;
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
  <td>
    <div
      v-if="type === 'event'"
      class="flex justify-center gap-5 text-xl text-gray-600"
    >
      <NuxtLink
        :to="{
          name: '',
          params: { id: event?.eventId },
        }"
      >
        <PenEdit />
      </NuxtLink>
      <Trash />
    </div>
    <div
      v-else-if="type === 'registration'"
      class="flex= justify-center gap-5 text-xl text-gray-600"
    >
      <NuxtLink
        :to="{
          name: 'backoffice-registrations-event-id',
          params: { id: event?.eventId },
        }"
        class="flex items-center justify-center gap-2"
      >
        <UserList class="t3" />
        <p class="b3">Registration list</p>
      </NuxtLink>
    </div>
  </td>
</template>
