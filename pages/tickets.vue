<script setup lang="ts">
import QrcodeVue from 'qrcode.vue';

const tickets = ref();
const accessToken = useCookie('accessToken');
const refreshToken = useCookie('refreshToken');
const getTokenForQR = async (eventId: string) => {
  const token = await useFetchWithAuth(
    `v1/check-in/${eventId}`,
    'POST',
    accessToken.value
  );
  return token.data?.qrToken;
};
const qrValues = ref<{ [key: string]: string }>({});
const generateQRCode = async (eventId: string) => {
  const tokenResponse = await getTokenForQR(eventId);

  if (tokenResponse) {
    qrValues.value[eventId] = `${tokenResponse}`;
  }
};
onMounted(async () => {
  const response = await useFetchWithAuth(
    'v1/tickets',
    'GET',
    accessToken.value
  );
  tickets.value = response.data;
  console.log(tickets.value);
  console.log('test', accessToken.value);
});
</script>

<template>
  <div class="mx-auto my-28 flex w-screen max-w-6xl gap-9">
    <div class="bg- w-[280px] rounded-xl border border-black/70"></div>
    <div class="w-full">
      <p class="t3">My Ticket</p>
      <div
        class="flex w-full items-center justify-between rounded-xl border border-black-1 p-1 lg:p-2 lg:pr-4"
      >
        <div
          :class="`flex gap-2 ${isShowSort ? 'pointer-events-none opacity-0' : ''}`"
        >
          <button
            @click="selectTime('today')"
            :class="`btn b3 rounded-md px-2 py-2 lg:px-4 ${selectedEventTime === 'today' ? selectedEventTimeStyle?.active : 'duration-200 hover:bg-zinc-200'}`"
          >
            Upcoming events
          </button>
          <button
            @click="selectTime('upcome')"
            :class="`btn b3 rounded-md px-2 py-2 lg:px-4 ${selectedEventTime === 'upcome' ? selectedEventTimeStyle?.active : 'duration-200 hover:bg-zinc-200'}`"
          >
            Past events
          </button>
        </div>
      </div>
      <div>
        <div
          v-for="ticket in tickets"
          class="relative mt-4 overflow-hidden rounded-lg"
          :style="{
            backgroundImage: `url(${ticket?.image})`,
            borderRadius: '12px',
          }"
        >
          <div
            class="relative z-10 flex h-full rounded-xl bg-white bg-opacity-50 p-2 backdrop-blur-xl"
          >
            <div class="aspect-square w-[290px] shrink-0 rounded-[5px]">
              <img
                :src="ticket.image"
                class="aspect-square rounded-[6px] object-cover"
                alt=""
              />
            </div>
            <div
              class="flex w-full flex-col justify-between rounded-[5px] p-3 px-5"
            >
              <div class="pb-5">
                <h1 class="t2">{{ ticket.name }}</h1>
                <div class="flex items-center gap-2">
                  <p v-for="tag in ticket.tags" class="b3">{{ tag }}</p>
                </div>
                <div class="mt-4">
                  <p class="b2 font-semibold">25.12.2025</p>
                  <p class="b2">Sunday 7PM - 11PM</p>
                </div>
              </div>

              <div class="">
                <p class="b3 font-semibold">Co-Working Space</p>
                <p class="b3">Chiang Mai, Thailand</p>
              </div>
            </div>
            <div
              class="b3 relative flex w-1/3 items-center justify-center border-l-[1px] border-dashed border-black/80 pl-2 text-center"
            >
              <div
                class="absolute -top-5 left-0 z-50 h-7 w-7 -translate-x-1/2 rounded-full bg-white"
              ></div>
              <div
                class="absolute -bottom-5 left-0 z-50 h-7 w-7 -translate-x-1/2 rounded-full bg-white"
              ></div>
              <button
                v-if="!qrValues[ticket.eventId]"
                @click="generateQRCode(ticket.eventId)"
                class="mx-auto"
              >
                Click to view <br />
                QR Code
              </button>
              <div
                v-if="qrValues[ticket.eventId]"
                class="rounded-lg bg-white p-2"
              >
                <qrcode-vue :value="qrValues[ticket.eventId]" size="100" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
