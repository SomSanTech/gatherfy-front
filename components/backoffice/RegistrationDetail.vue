<script setup lang="ts">
import type { Registration } from '~/models/registration';
import Arrow from '../icons/Arrow.vue';
import CheckCircle from '../icons/CheckCircle.vue';
const error = useError();
const route = useRoute();
const param = route.params.id;
const isLoading = ref(true);
const registration = ref();
const selectedStatus = ref({ status: '' });
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
const statusData = [
  {
    name: 'Unattended',
    urlSend: 'Unattended',
  },
  {
    name: 'Awaiting Check-in',
    urlSend: 'Awaiting Check-in',
  },
  {
    name: 'Checked in',
    urlSend: 'Checked in',
  },
];
// ENUM('Awaiting Check-in', 'Checked in', 'Unattended')
const props = defineProps<{
  registration?: Registration;
}>();

interface CheckedInOption {
  name: string;
  urlSend: string;
}

const selectStatus = (statusOption: CheckedInOption) => {
  selectedStatus.value.status = statusOption.urlSend;
  isShowStatusBy.value = !isShowStatusBy.value;
};

const fetchData = async () => {
  const fetchedData = await useFetchData(`v1/registrations/${param}`);

  if (fetchedData.error) {
    error.value = fetchData;
  } else {
    registration.value = fetchedData || [];
  }
};

const fetchRegistration = async () => {
  const fetchedData = await useFetchRegistration(
    `v1/registrations/${param}`,
    'PUT',
    selectedStatus.value
  );
  if (fetchedData === 200) {
    isChangeStatusComplete.value = true;
  } else {
    isChangeStatusComplete.value = false;
  }
};

onMounted(() => {
  try {
    isLoading.value = true;
    fetchData();
    isChangeStatusComplete.value = null;
  } finally {
    isLoading.value = false;
  }
});

watchEffect(() => {
  if (param) {
    fetchData();
    isChangeStatusComplete.value = null;
  }
});
</script>

<
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
      <div class="col-span-2">
        <p class="b1">Event</p>
        <input
          type="text"
          class="regis-detail-event-name b2 border-1 my-4 w-full rounded-lg bg-[#F8FBFF] px-4 py-2 text-[#818181] shadow-inner"
          :value="registration?.eventName"
          disabled
        />
      </div>
      <div class="col-start-1">
        <p class="b1">First name</p>
        <input
          type="text"
          class="regis-detail-firstname b2 border-1 my-4 w-full rounded-lg bg-[#F8FBFF] px-4 py-2 text-[#818181] shadow-inner"
          :value="registration?.firstName"
          disabled
        />
      </div>
      <div class="">
        <p class="b1">Last name</p>
        <input
          type="text"
          class="regis-detail-lastname b2 border-1 my-4 w-full rounded-lg bg-[#F8FBFF] px-4 py-2 text-[#818181] shadow-inner"
          :value="registration?.lastName"
          disabled
        />
      </div>
      <div class="">
        <p class="b1">Username</p>
        <input
          type="text"
          class="regis-detail-username b2 border-1 my-4 w-full rounded-lg bg-[#F8FBFF] px-4 py-2 text-[#818181] shadow-inner"
          :value="registration?.username"
          disabled
        />
      </div>
      <div class="">
        <p class="b1">Email</p>
        <input
          type="text"
          class="regis-detail-email b2 border-1 my-4 w-full rounded-lg bg-[#F8FBFF] px-4 py-2 text-[#818181] shadow-inner"
          :value="registration?.email"
          disabled
        />
      </div>
      <div class="">
        <p class="b1">Phone</p>
        <input
          type="text"
          class="regis-detail-phone b2 border-1 my-4 w-full rounded-lg bg-[#F8FBFF] px-4 py-2 text-[#818181] shadow-inner"
          :value="registration?.phone"
          disabled
        />
      </div>
      <div class="">
        <p class="b1">Gender</p>
        <input
          type="text"
          class="regis-detail-gender b2 border-1 my-4 w-full rounded-lg bg-[#F8FBFF] px-4 py-2 text-[#818181] shadow-inner"
          :value="registration?.gender"
          disabled
        />
      </div>
      <div class="">
        <p class="b1">Checked in</p>
        <div class="" v-show="isShowStatus">
          <div class="relative">
            <button
              @click="isShowStatusBy = !isShowStatusBy"
              class="regis-detail-status b2 border-1 my-4 flex w-full items-center justify-between gap-1 rounded-lg bg-[#F8FBFF] px-4 py-2 shadow-inner"
            >
              {{
                selectedStatus.status
                  ? selectedStatus.status
                  : registration?.status
              }}
              <Arrow
                :class="`${isShowStatusBy ? 'rotate-90' : '-rotate-90'} text-sm duration-200`"
              />
            </button>
            <div
              v-if="isShowStatusBy"
              class="absolute top-12 z-20 flex w-full flex-col items-start gap-1 rounded-xl bg-[#fdfdfd] p-3 text-start drop-shadow-lg"
            >
              <button
                v-for="statusOption in statusData"
                @click="selectStatus(statusOption)"
                :class="`status-choice w-full rounded-md px-4 py-1 text-start font-semibold ${selectedStatus.status === statusOption.name ? selectedEventTimeStyle?.active : 'duration-200 hover:bg-zinc-200'}`"
              >
                {{ statusOption.name }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-end gap-5">
      <BtnComp text="Save" @click="fetchRegistration" color="green" />
    </div>
  </div>
</template>
>
