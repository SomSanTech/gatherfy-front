<script setup lang="ts">
import { BrowserQRCodeReader } from '@zxing/browser';
import RegistrationList from '~/components/backoffice/RegistrationList.vue';

// const scannedValue = ref<string | null>(null);

// const onDecode = (result: string) => {
//   scannedValue.value = result;
// };

// const onInit = (error: any) => {
//   if (error) {
//     console.error('QR code scanner initialization failed', error);
//   } else {
//     console.error('QR code scanner initialized');
//   }
// };
definePageMeta({
  layout: 'backoffice',
});
const video = ref<HTMLVideoElement | null>(null);
const scannedValue = ref<string | null>(null);
const apiResponse = ref<string | null>(null);
let qrCodeReader: BrowserQRCodeReader;
const selectedOption = ref();
const eventsData = ref();
const accessToken = useCookie('accessToken');
const fetchData = async () => {
  const fetchedData = await useFetchWithAuth(
    `v1/backoffice/events`,
    'GET',
    accessToken.value
  );
  eventsData.value = fetchedData.data || [];
};

const registrationsData = ref();
const fetchRegisListData = async (eventId: string) => {
  const fetchedData = await useFetchWithAuth(
    `v2/registrations/event/${eventId}`,
    'GET',
    accessToken.value
  );
  registrationsData.value = fetchedData.data || [];
};

const selectedEventId = ref(0);
const handleSelectEvent = async () => {
  // try {
  const selectedEvent = eventsData.value.find(
    (event: any) => event.eventName === selectedOption.value
  );
  if (selectedEvent) {
    selectedEventId.value = selectedEvent.eventId;
    // alert(
    //   `Selected Event ID: ${selectedEvent.eventId}, Name: ${selectedEvent.eventName}`
    // );
  }
  // isLoading.value = true;
  await fetchRegisListData(selectedEvent.eventId);
  // } finally {
  //   isLoading.value = false;
  // }
};
const decodeToken = (token: any): any => {
  const arrayToken = token.split('.');
  const tokenPayload = JSON.parse(atob(arrayToken[1]));
  return tokenPayload;
};
const config = useRuntimeConfig();

const checkInFetch = async (
  url: string,
  method: string,
  token: any,
  body?: object
) => {
  const response = await fetch(`${config.public.baseUrl}/api/${url}`, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const status = response.status;

  const contentType = response.headers.get('content-type');
  let data = null;

  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  return { status, data };
};
const filteredEvents = computed(() => {
  return (
    eventsData.value?.filter(
      (e) =>
        new Date(e.eventStartDate).getTime() <= new Date().getTime() &&
        new Date(e.eventEndDate).getTime() >= new Date().setHours(0, 0, 0, 0)
    ) || []
  );
});
const { state, showPopup } = usePopup();
const isLoading = useState('isLoading');

onMounted(async () => {
  await fetchData();

  qrCodeReader = new BrowserQRCodeReader();
  qrCodeReader.decodeFromVideoDevice(
    null,
    video.value,
    async (result, error) => {
      if (result) {
        scannedValue.value = result.getText();
        if (scannedValue.value) {
          const decodedData = decodeToken(scannedValue.value);
          if (decodedData.eventId === selectedEventId.value) {
            const response = await checkInFetch(
              `v2/check-in`,
              'PUT',
              accessToken.value,
              {
                qrToken: scannedValue.value,
              }
            );

            if (response.status === 401) {
              showPopup('QRCODE time out', 'error');
            } else {
              showPopup('Checked in', 'complete');
            }
          } else {
            if (!selectedOption.value) {
              showPopup('Please select event first', 'warn');
            } else {
              showPopup(
                `QR code not match event ${selectedOption.value}`,
                'warn'
              );
            }
          }
        } else {
        }
      }
    }
  );
  setTimeout(() => {
    isLoading.value = false;
  }, 500);
});

onBeforeUnmount(() => {
  // if (qrCodeReader) {
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      stream.getTracks().forEach((track) => track.stop()); // Stop the camera
    })
    .catch((err) => console.error('Error stopping camera:', err));
  // }
});
</script>
<template>
  <CompleteModal
    :isShowCompleteModal="state.isVisible"
    :title="state.text"
    :status="state.status"
    @complete-action="state.isVisible = false"
  />
  <!-- <Loader v-if="isLoading" /> -->

  <div class="h-screen w-full bg-[#EEEEEE] lg:ml-80">
    <div
      class="justify- flex h-full flex-col items-center px-5 text-center lg:flex-row lg:gap-12"
    >
      <div class="my-auto flex aspect-square h-fit shrink-0">
        <video
          ref="video"
          width="400"
          height="400"
          class="rounded-lg object-cover"
        ></video>
      </div>
      <div class="bg-glass mb-5 h-2/4 w-full rounded-xl p-7 lg:my-32 lg:mr-10">
        <div class="flex w-full flex-col items-start gap-4">
          <p class="t3">Event Registration</p>
          <div class="flex items-center gap-3">
            <label for="dropdown" class="b2 font-semibold">Select Event </label>
            <select
              id="dropdown"
              v-model="selectedOption"
              class="b3 rounded border p-2"
              @change="handleSelectEvent()"
            >
              <!-- Default option -->
              <option value="" disabled>Please select an event</option>

              <template v-if="filteredEvents.length > 0">
                <option
                  v-for="event in filteredEvents"
                  :key="event.eventId"
                  :value="event.eventName"
                >
                  {{ event.eventName }}
                </option>
              </template>

              <option v-else value="" disabled>No event available</option>
            </select>
          </div>
        </div>

        <div v-if="registrationsData" class="h-3/4 w-full overflow-y-auto">
          <div
            v-if="registrationsData.length === 0"
            class="b2 flex h-full w-full items-center justify-center"
          >
            <p>No Registration</p>
          </div>
          <div v-else class="overflow-y-auto">
            <div
              v-for="registration in registrationsData"
              class="border-default-300 flex w-full cursor-default items-center border-b transition-colors"
            >
              <RegistrationList
                :registration="registration"
                :is-show-in-q-r-scan="true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>
