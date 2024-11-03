<script setup lang="ts">
import type { Event } from '~/models/event';
import PenEdit from '../icons/PenEdit.vue';
import Trash from '../icons/Trash.vue';

const props = defineProps<{
  event?: Event;
}>();
</script>

<template>
  <td class="b2 p-4 align-middle">
    {{ event?.name }}
  </td>
  <td class="b2 p-4 align-middle">
    {{ event?.organizer }}
  </td>
  <td class="b2 p-4 align-middle">
    {{ event?.location }}
  </td>
  <!-- <td class="b2 p-4 text-center align-middle">
    <BtnComp
      :text="event?.status"
      :color="event?.status == 'pending' ? 'gray' : 'green'"
    />
  </td> -->
  <td>
    <div class="flex justify-center gap-5 text-xl text-gray-600">
      <!-- <NuxtLink
        :to="{
          name: 'backoffice-registrations-event-id',
          params: { id: event?.slug },
        }"
      >
        <PenEdit />
      </NuxtLink> -->
      <Trash />
    </div>
  </td>
</template>
