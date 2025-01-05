<script setup lang="ts">
import Arrow from '../icons/Arrow.vue';
import CheckCircle from '../icons/CheckCircle.vue';
import type { Event } from '~/models/event';
const error = useError();
const route = useRoute();
const param = route.params.id;
const isLoading = ref(true);
const event = ref();
const eventBody = ref();
const isShowStatus = ref(true);
const isChangeStatusComplete = ref();
const isShowStatusBy = ref(false);

const selectedEventTimeStyle = {
  active: 'text-light-grey font-semibold bg-burgundy',
  notActive: 'text-black',
};
const statusStyle = {
  success: {
    style: 'bg-[#16C098]/25 text-[#008767]',
    text: 'Status has been updated',
  },
  failed: {
    style: 'bg-[#ef4444]/25 text-[#ef4444]',
    text: 'Sorry, something went wrong',
  },
  noChange: {
    style: 'bg-[#E8E8E8] text-[#939393]',
    text: 'Sorry, nothing changed',
  },
};

// ENUM('Awaiting Check-in', 'Checked in', 'Unattended')
const props = defineProps<{
  event?: Event;
}>();

// const fetchData = async () => {
//     const fetchedData = await useFetchData(`v1/events/backoffice/${param}`);

//     if (fetchedData.error) {
//         error.value = fetchData;
//     } else {
//         event.value = fetchedData || [];
//         console.log(event.value)
//     }
// };

const fetchEvent = async () => {
  //   const fetchedData = await useFetchCreateUpdate(
  //     `v1/events/backoffice/${param}`,
  //     'PUT',
  //     eventBody.value
  //   );
  //   if (fetchedData === 200) {
  //     isChangeStatusComplete.value = true;
  //   } else {
  //     isChangeStatusComplete.value = false;
  //   }
};

onMounted(() => {
  try {
    isLoading.value = true;
    // fetchData();
    isChangeStatusComplete.value = null;
  } finally {
    isLoading.value = false;
  }
});

watchEffect(() => {
  if (param) {
    // fetchData();
    isChangeStatusComplete.value = null;
  }
});
</script>

<template>
  <div v-if="isLoading" class="my-16 flex items-center justify-center">
    <span class="loader"></span>
  </div>
  <div v-else>
    <div class="mt-10 grid grid-cols-3 gap-x-16 gap-y-5">
      <div
        v-if="isChangeStatusComplete != null"
        :class="`col-span-3 flex items-center gap-2 rounded-lg px-4 py-2 ${isChangeStatusComplete === true ? statusStyle.success.style : statusStyle.failed.style}`"
      >
        <CheckCircle />
        <p class="alert-text b2">
          {{
            isChangeStatusComplete === true
              ? statusStyle.success.text
              : statusStyle.failed.text
          }}
        </p>
      </div>
      <div class="col-span-3">
        <p class="b1">Event Name</p>
        <input
          type="text"
          class="event-detail-event-name b2 border-1 my-4 w-full rounded-lg bg-[#F8FBFF] px-4 py-2 shadow-inner focus:outline-none"
          :value="props.event?.name"
        />
      </div>
      <div class="col-span-3">
        <p class="b1">Event Description</p>
        <input
          type="text"
          class="event-detail-desc b2 border-1 my-4 w-full rounded-lg bg-[#F8FBFF] px-4 py-2 shadow-inner focus:outline-none"
          :value="props.event?.description"
        />
      </div>
      <div class="col-span-3">
        <p class="b1">Event Detail</p>
        <textarea
          rows="8"
          type="text"
          class="event-detail-detail b2 border-1 my-4 w-full rounded-lg bg-[#F8FBFF] px-4 py-2 shadow-inner focus:outline-none"
          :value="props.event?.detail"
        />
      </div>
    </div>
    <div class="flex justify-end gap-5">
      <BtnComp text="Save" @click="fetchEvent" color="green" />
    </div>
  </div>
</template>
