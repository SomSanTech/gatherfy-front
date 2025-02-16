<script setup lang="ts">
import { BrowserQRCodeReader } from '@zxing/browser';
import RegistrationList from '~/components/backoffice/RegistrationList.vue';

// const scannedValue = ref<string | null>(null);

const onDecode = (result: string) => {
  scannedValue.value = result;
};

const onInit = (error: any) => {
  if (error) {
    console.error('QR code scanner initialization failed', error);
  } else {
    console.log('QR code scanner initialized');
  }
};
definePageMeta({
  layout: 'backoffice',
});
const video = ref<HTMLVideoElement | null>(null);
const scannedValue = ref<string | null>(null);
const isLoading = ref(false);
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
    `v1/registrations/event/${eventId}`,
    'GET',
    accessToken.value
  );
  registrationsData.value = fetchedData.data || [];
  console.log('registrationsData.value', registrationsData.value);
};

const selectedEventId = ref(0);
const handleSelectEvent = async () => {
  // try {
  const selectedEvent = eventsData.value.find(
    (event: any) => event.eventName === selectedOption.value
  );
  if (selectedEvent) {
    selectedEventId.value = selectedEvent.eventId;
    console.log('Selected Event ID:', selectedEvent.eventId);
    console.log('Selected Event Name:', selectedEvent.eventName);
    // alert(
    //   `Selected Event ID: ${selectedEvent.eventId}, Name: ${selectedEvent.eventName}`
    // );
  }
  console.log(selectedOption.value);
  // isLoading.value = true;
  await fetchRegisListData(selectedEvent.eventId);
  // } finally {
  //   isLoading.value = false;
  // }
};
const decodeToken = (token: any): any => {
  const arrayToken = token.split('.');
  const tokenPayload = JSON.parse(atob(arrayToken[1]));
  console.log('tokenPayload:', tokenPayload);
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
onMounted(async () => {
  await fetchData();
  qrCodeReader = new BrowserQRCodeReader();
  qrCodeReader.decodeFromVideoDevice(
    null,
    video.value,
    async (result, error) => {
      if (result) {
        scannedValue.value = result.getText(); // ดึงค่าจาก QR Code
        if (scannedValue.value) {
          console.log('scannedValue', decodeToken(scannedValue.value));
          const decodedData = decodeToken(scannedValue.value);
          if (decodedData.eventId === selectedEventId.value) {
            // apiResponse.value = scannedValue.value;
            // console.log(scannedValue.value);
            console.log('yes ja');

            // ส่งคำขอ PUT ไปที่ backend พร้อม Authorization header
            const response = await checkInFetch(
              `v2/check-in`,
              'PUT',
              accessToken.value,
              {
                qrToken: scannedValue.value,
              }
            );
            console.log('response', response);

            if (response.status === 401) {
              alert('QRCODE time out');
            } else {
              alert('checked in');
            }
          } else {
            if (!selectedOption.value) {
              alert(`Please select event first`);
            } else {
              alert(`QR code not match event ${selectedOption.value}`);
            }
          }
        } else {
          console.log('test');
        }
      }
      // if (error) console.error(error);
    }
  );
});

// onBeforeUnmount(() => {
//   qrCodeReader.reset(); // ปิดกล้องเมื่อออกจากหน้า
// });
</script>
<template>
  <div class="ml-80 h-screen w-full bg-ghost-white">
    <div class="justify- flex h-full gap-12 px-5 text-center">
      <div class="my-auto flex aspect-square h-fit w-[400px] shrink-0">
        <video
          ref="video"
          width="400"
          height="400"
          class="rounded-lg object-cover"
        ></video>
        <!-- <p v-if="scannedValue">Scanned Value: {{ scannedValue }}</p> -->
        <!-- <p v-if="apiResponse" class="mt-4 text-blue-600">
          API Response: {{ apiResponse }}
        </p> -->
      </div>
      <div class="my-32 mr-10 w-full rounded-lg bg-white p-7 drop-shadow-lg">
        <div class="flex w-full flex-col items-start gap-4">
          <p class="t3">Event Registration</p>
          {{ selectedOption }}
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

        <div v-if="registrationsData" class="h-full w-full">
          <div
            v-if="registrationsData.length === 0"
            class="b2 flex h-full w-full items-center justify-center"
          >
            <p>No Registration</p>
          </div>
          <div v-else class="overflow-y-auto">
            <div
              v-for="registration in registrationsData"
              class="border-default-300 jus flex cursor-default items-center border-b transition-colors"
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
