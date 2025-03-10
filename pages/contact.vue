<script setup lang="ts">
import Phone from '~/components/icons/Phone.vue';
import Gmail from '~/components/icons/Gmail.vue';
import { BrowserQRCodeReader } from '@zxing/browser';
import QrcodeVue from 'qrcode.vue';
const qrValues = ref<string>('');
const accessToken = useCookie('accessToken');
const isShowQR = ref<boolean>(false);
const generateQRCode = async () => {
  const token = await useFetchWithAuth(
    `v1/shareContact`,
    'POST',
    accessToken.value
  );
  if (token.status === 200) {
    qrValues.value = await token.data;
    console.log('qrValues.value', qrValues.value);
    isShowQR.value = !isShowQR.value;
  } else {
    alert('wrong!!!');
  }
};

const saveContact = () => {};

// function saveContact(contact) {
//   if (contact) {
//     alert(`Saving contact: ${contact.name}`);
//   } else {
//     alert('Saving your contact...');
//   }
// }

const userProfile = useCookie('profileData', { default: () => ({}) });
const isExploreContact = ref([]);

// function toggleExploreContact(index) {
//   if (isExploreContact.value.includes(index)) {
//     isExploreContact.value = isExploreContact.value.filter((i) => i !== index);
//   } else {
//     isExploreContact.value.push(index);
//   }
// }
// const video = ref<HTMLVideoElement | null>(null);
// const video2 = ref<HTMLVideoElement | null>(null);
const isLoading = ref(false);
const apiResponse = ref<string | null>(null);
let qrCodeReader: BrowserQRCodeReader;
// onMounted(async () => {
//   qrCodeReader = new BrowserQRCodeReader();
//   qrCodeReader.decodeFromVideoDevice(
//     null,
//     video.value,
//     async (result, error) => {
//       if (result) {
//       }
//     }
//   );
// });

const video = ref<HTMLVideoElement | null>(null);
const video2 = ref<HTMLVideoElement | null>(null);

const contactData = ref();
const getContact = async () => {
  const response = await useFetchWithAuth(
    'v1/contacts',
    'GET',
    accessToken.value
  );
  console.log(response.data);
  contactData.value = response.data;
};
const isClickShareContact = ref<boolean>(false);
const handleShareContact = () => {
  isClickShareContact.value = !isClickShareContact.value;
};
const isShowMyQRCode = ref<boolean>(false);
const scannedValue = ref<string | null>(null);
const config = useRuntimeConfig();

const deleteContact = async (contactId: number) => {
  console.log(contactId);

  const response = await useFetchWithAuth(
    `v1/contact/${contactId}`,
    'DELETE',
    accessToken.value
  );
  if (response.status === 200) {
    alert('delete');
    await getContact();
  } else {
    alert('smth broke');
  }
};
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
onMounted(async () => {
  await getContact();
  qrCodeReader = new BrowserQRCodeReader();

  if (video.value) {
    console.log('is video');

    qrCodeReader.decodeFromVideoDevice(
      null, // ใช้กล้องตัวแรกที่พบ
      video.value,
      (result, error) => {
        if (result) {
          scannedValue.value = result.getText();
          console.log('scannedValue:', scannedValue.value);

          const response = checkInFetch(
            'v1/saveContact',
            'POST',
            accessToken.value,
            {
              qrToken: scannedValue.value,
            }
          ).then((response) => {
            if (response.status === 401) {
              alert('QRCODE time out');
            } else {
              alert('checked in');
            }
          });
        }
        if (error) {
          console.error('QR Code scan error:', error);
        }
      }
    );
  } else {
    console.error('Video element is not available.');
  }
});
</script>

<template>
  <div class="mx-auto my-28 flex w-screen max-w-6xl gap-9">
    <ProfileSidebar @shareContact="handleShareContact" />
    <div class="w-full">
      <div class="flex w-full flex-wrap gap-4">
        <div
          v-for="contact in contactData"
          :key="contact?.contactId"
          class="b2 w- relative flex h-fit flex-col gap-3 rounded-xl border border-zinc-500/10 p-5 shadow-md shadow-zinc-300/30"
        >
          <div class="absolute right-3 top-3">
            <button @click="deleteContact(contact?.contactId)">
              <Trash />
            </button>
          </div>
          <div class="flex flex-col items-start gap-4">
            <div class="h-14 w-14 rounded-full bg-zinc-200">
              <img
                class="h-14 w-14 shrink-0 rounded-full object-cover"
                :src="`${contact?.userProfile?.users_image}`"
              />
            </div>
            <div class="flex flex-col">
              <div class="font-semibold">
                {{ contact?.userProfile?.username }}
              </div>
              <div class="text-black/70">
                {{ contact?.userProfile?.users_firstname }}
                {{ contact?.userProfile?.users_lastname }}
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-2">
            <div
              v-for="social in contact?.userSocials"
              class="flex items-center gap-2"
            >
              <a
                :href="social?.socialLink"
                target="_blank"
                class="b3 flex items-center gap-2"
              >
                <X v-if="social?.socialPlatform === 'X'" />
                <Facebook v-else-if="social?.socialPlatform === 'Facebook'" />
                <Instagram v-else-if="social?.socialPlatform === 'Instagram'" />
                <Linkedin v-else-if="social?.socialPlatform === 'LinkIn'" />
                <LinkSocial v-else />
                {{ social?.socialLink.split('/').pop() }}
              </a>
            </div>
          </div>
          <div
            class="b3 flex w-full flex-col gap-2 rounded-md border border-dashed p-2 transition-all duration-700 ease-in-out"
          >
            <div class="w-full">
              <div class="flex items-center gap-1">
                <Phone class="fill-black text-[15px]" />
                <p>{{ contact?.userProfile?.users_phone }}</p>
              </div>
              <div class="flex items-center gap-1">
                <Gmail class="fill-black text-[15px]" />
                <p>{{ contact?.userProfile?.users_email }}</p>
              </div>
            </div>
          </div>
          <div class="b3 flex gap-2">
            <p v-if="contact?.mutualEvents?.length > 0">Mutual events:</p>
            <p v-else>No mutual events</p>
            <div
              v-for="(event, index) in contact?.mutualEvents"
              class="flex items-center gap-2 text-blue-400"
            >
              <NuxtLink
                :to="{ name: 'event-id', params: { id: event?.eventSlug } }"
              >
                <p>
                  {{ event?.eventName }}
                  <span v-if="index !== contact?.mutualEvents?.length - 1"
                    >,</span
                  >
                </p>
              </NuxtLink>
            </div>
          </div>
          <!-- <button @click="toggleExploreContact(contact)">click</button> -->

          <!-- <div
        :class="[
          'flex flex-col gap-2 overflow-hidden rounded-md border border-dashed p-2 transition-all duration-700 ease-in-out',
          isExploreContact.includes(contact)
            ? 'mt-2 max-h-40'
            : 'mt-0 max-h-0 border-0 p-0',
        ]"
      >
        <div v-if="isExploreContact.includes(contact)">
          <div class="flex items-center gap-1">
            <Phone class="fill-black text-[15px]" />
            <p>{{ contact?.userProfile?.users_phone }}</p>
          </div>
          <div class="flex items-center gap-1">
            <Gmail class="fill-black text-[15px]" />
            <p>{{ contact?.userProfile?.users_email }}</p>
          </div>
        </div>
      </div> -->
        </div>
      </div>
      <div
        v-show="isClickShareContact"
        class="absolute left-1/2 top-5 -translate-x-1/2"
      >
        <!-- วิดีโอซ้อนทับ -->
        <div class="relative h-[400px] w-[400px] overflow-hidden">
          <video
            ref="video"
            width="400"
            height="400"
            class="absolute left-1/2 top-1/2 z-50 aspect-square h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 object-cover"
          ></video>
          <!-- <div
            class="absolute left-0 top-0 z-50 h-[400px] w-[400px] border-[90px] border-black/20"
          ></div> -->
          <button
            @click="generateQRCode"
            class="absolute bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-black/70 px-3 py-1 text-light-grey"
          >
            My QR code
          </button>

          <div
            v-if="isShowQR"
            class="rounded-g absolute left-1/2 top-8 z-50 flex h-full w-full -translate-x-1/2 cursor-pointer flex-col items-center rounded-t-xl bg-white p-2 pt-20 transition-transform duration-300 ease-in-out"
          >
            <qrcode-vue :size="200" :value="qrValues" />
            <p class="b3 max-w-[200px] pt-2 text-center text-black/70">
              Show this QR code to who you want to shre contact
            </p>
            <button
              @click="isShowQR = !isShowQR"
              class="absolute right-4 top-4 text-2xl text-black"
            >
              <Cancle />
            </button>
          </div>
        </div>

        <!-- QrScanner อยู่ตรงกลาง -->
        <!-- <div
          class="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <QrScanner class="h-[200px] w-[200px] fill-white" />
        </div> -->
      </div>

      <div
        v-if="false"
        class="b2 w-f\ull translate-t-1/2 absolute left-1/2 top-1/2 z-50 flex w-fit translate-x-1/2 flex-col gap-5 rounded-xl border border-zinc-500/10 bg-[#E9E9E9]/40 p-8 shadow-md shadow-zinc-300/30"
      >
        QR code reader
      </div>
    </div>
  </div>
</template>

<style scoped></style>
