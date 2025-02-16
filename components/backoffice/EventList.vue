<script setup lang="ts">
import PenEdit from '../icons/PenEdit.vue';
import Trash from '../icons/Trash.vue';
import UserList from '../icons/UserList.vue';
import Dashboard from '../icons/Dashboard.vue';
import FlagOutline from '../icons/FlagOutline.vue';

const props = defineProps<{
  event?: Event;
  type?: string;
}>();

interface Event {
  eventId: number;
  eventName: string;
  eventLocation: string;
  eventStartDate: Date;
}
const emit = defineEmits(['handleDeleteEvent']);
</script>

<template>
  <td class="b2 p-4 align-middle">
    {{ event?.eventName }}
  </td>
  <td v-if="type === 'feedback'" class="b2 p-4 align-middle">
    {{ useFormatDateTime(event?.eventStartDate, 'date') }},
    {{ useFormatDateTime(event?.eventStartDate, 'time') }}
  </td>
  <td v-else class="b2 p-4 align-middle">
    {{ event?.eventLocation }}
  </td>
  <td>
    <div
      v-if="type === 'event'"
      class="flex justify-center gap-5 text-xl text-gray-600"
    >
      <NuxtLink
        :to="{
          name: `backoffice-events-id`,
          params: { id: event?.eventId },
        }"
      >
        <PenEdit />
      </NuxtLink>
      <Trash
        class="cursor-pointer"
        @click="$emit('handleDeleteEvent', event)"
      />
    </div>
    <div
      v-else-if="type === 'registration'"
      class="flex justify-center gap-5 text-xl text-gray-600"
    >
      <div class="flex items-center justify-center gap-2 p-4">
        <UserList class="t3" />
        <p class="b3">Registration list</p>
      </div>
    </div>
    <div
      v-else-if="type === 'dashboard'"
      class="flex justify-center gap-5 text-xl text-gray-600"
    >
      <NuxtLink
        class="go-to-dashboard"
        :to="{
          path: `/backoffice/dashboard/${event?.eventId}`,
        }"
      >
        <div class="flex items-center justify-center gap-2 p-4">
          <Dashboard class="t3" />
          <p class="b3">View dashboard</p>
        </div>
      </NuxtLink>
    </div>
    <!-- <div v-else-if="type === 'feedback'" class="flex justify-center gap-5 text-xl text-gray-600">
      <NuxtLink class="go-to-feedback" :to="{
        path: `/backoffice/feedback/${event?.eventId}`,
      }">
        <div class="flex items-center justify-center gap-2 p-4">
          <FlagOutline class="t3" />
          <p class="b3">Manage feedback</p>
        </div>
      </NuxtLink>
      <NuxtLink class="go-to-feedback" :to="{
        path: `/backoffice/feedback/${event?.eventId}`,
      }">
        <div class="flex items-center justify-center gap-2 p-4">
          <FlagOutline class="t3" />
          <p class="b3">Response</p>
        </div>
      </NuxtLink>
    </div> -->
  </td>
</template>
