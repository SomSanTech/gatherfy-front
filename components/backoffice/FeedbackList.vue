<script setup lang="ts">
import PenEdit from '../icons/PenEdit.vue';
import Analytics from '../icons/Analytics.vue';
import View from '../icons/View.vue';

const props = defineProps<{
  event?: Event;
  responses: number;
  canEdit: boolean;
}>();

interface Event {
  eventId: number;
  eventName: string;
  eventLocation: string;
  eventStartDate: Date;
}

const emit = defineEmits(['previewFeedback']);
</script>

<template>
  <td class="b2 p-4 align-middle">
    {{ event?.eventName }}
  </td>
  <td class="b2 p-4 align-middle" :class="canEdit ? '' : 'text-burgundy'">
    {{ useFormatDateTime(event?.eventStartDate, 'date') }},
    {{ useFormatDateTime(event?.eventStartDate, 'time') }}
  </td>
  <td class="b2 p-4 text-center align-middle">
    {{ responses }}
  </td>
  <td>
    <div class="flex justify-center gap-5 text-xl text-gray-600">
      <div v-if="canEdit" class="flex items-center justify-center gap-2 p-4">
        <NuxtLink
          class="go-to-feedback"
          :to="{
            path: `/backoffice/feedback/${event?.eventId}`,
          }"
        >
          <PenEdit class="t3" />
        </NuxtLink>
      </div>
      <div v-else class="flex items-center justify-center gap-2 p-4">
        <PenEdit class="t3 cursor-not-allowed text-cool-gray" />
      </div>
      <div class="flex items-center justify-center gap-2 p-4">
        <NuxtLink
          class="go-to-response"
          :to="{
            path: `/backoffice/feedback/response/${event?.eventId}`,
          }"
        >
          <Analytics class="t3" />
        </NuxtLink>
      </div>
      <div
        @click="$emit('previewFeedback', event?.eventId)"
        class="flex items-center justify-center gap-2 p-4"
      >
        <View class="t3 cursor-pointer" />
      </div>
    </div>
  </td>
</template>
