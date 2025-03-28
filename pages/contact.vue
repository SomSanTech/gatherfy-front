<script setup lang="ts">
import { BrowserQRCodeReader } from '@zxing/browser';
import Phone from '~/components/icons/Phone.vue';
import Gmail from '~/components/icons/Gmail.vue';
import QrcodeVue from 'qrcode.vue';

let qrCodeReader: BrowserQRCodeReader;
const qrValues = ref<string>('');
const accessToken = useCookie('accessToken');
const isShowQR = ref<boolean>(false);
const video = ref<HTMLVideoElement | null>(null);
const contactData = ref();
const isClickShareContact = ref<boolean>(false);
const scannedValue = ref<string | null>(null);
const config = useRuntimeConfig();
const contactDeletedId = ref<number>(0);
// const isShowConfirm = ref<boolean>(false);
const handleConfirmPopup = () => {
  if (state.status === 'confirm') {
    deleteContact();
  } else {
    state.isVisible = false;
  }
};
const handleClickDeleteContact = (contactId: number) => {
  showPopup('Delete this contact?', 'confirm');
  contactDeletedId.value = contactId;
};

const generateQRCode = async () => {
  const token = await useFetchWithAuth(
    `v1/shareContact`,
    'POST',
    accessToken.value
  );
  if (token.status === 200) {
    if ('data' in token) {
      qrValues.value = await token.data;
      console.log('qrValues.value', qrValues.value);
      isShowQR.value = !isShowQR.value;
    }
  } else {
    console.log('wrong!!!');
  }
};

const getContact = async () => {
  const response = await useFetchWithAuth(
    'v1/contacts',
    'GET',
    accessToken.value
  );
  if ('data' in response) {
    contactData.value = response.data;
  }
};

const handleShareContact = () => {
  isClickShareContact.value = !isClickShareContact.value;
  handleScan();
};
const { state, showPopup } = usePopup();
const deleteContact = async () => {
  if (contactDeletedId.value) {
    console.log(contactDeletedId.value);

    const response = await useFetchWithAuth(
      `v1/contact/${contactDeletedId.value}`,
      'DELETE',
      accessToken.value
    );
    if (response.status === 200) {
      showPopup('Delete contact succeessful', 'complete');
      // isShowConfirm.value = false;
      // alert('delete');

      await getContact();
    } else {
      showPopup('Cannot delete contact', 'error');
    }
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
const isLoading = useState('isLoading', () => true);
const handleScan = () => {
  qrCodeReader = new BrowserQRCodeReader();

  if (video.value) {
    console.log('is video');

    qrCodeReader.decodeFromVideoDevice(null, video.value, (result, error) => {
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
            showPopup('QRCODE time out', 'error');
          } else {
            showPopup('Add contact successful', 'complete');
          }
        });
      }
      // if (error) {
      //   console.error('QR Code scan error:', error);
      // }
    });
  } else {
    console.error('Video element is not available.');
  }
};
onMounted(async () => {
  try {
    await getContact();
    // qrCodeReader = new BrowserQRCodeReader();

    // if (video.value) {
    //   console.log('is video');

    //   qrCodeReader.decodeFromVideoDevice(null, video.value, (result, error) => {
    //     if (result) {
    //       scannedValue.value = result.getText();
    //       console.log('scannedValue:', scannedValue.value);

    //       const response = checkInFetch(
    //         'v1/saveContact',
    //         'POST',
    //         accessToken.value,
    //         {
    //           qrToken: scannedValue.value,
    //         }
    //       ).then((response) => {
    //         if (response.status === 401) {
    //           showPopup('QRCODE time out', 'error');
    //         } else {
    //           showPopup('Add contact successful', 'complete');
    //         }
    //       });
    //     }
    //     // if (error) {
    //     //   console.error('QR Code scan error:', error);
    //     // }
    //   });
    // } else {
    //   console.error('Video element is not available.');
    // }
  } catch (error) {
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <Loader v-if="isLoading" />

  <div v-else class="relative mx-auto my-28 flex w-screen max-w-6xl gap-9">
    <CompleteModal
      :isShowCompleteModal="state.isVisible"
      :title="state.text"
      :status="state.status"
      @completeAction="handleConfirmPopup"
      @cancleAction="state.isVisible = false"
    />
    <ProfileSidebar @shareContact="handleShareContact" />
    <div class="w-full">
      <div class="grid w-full grid-cols-2 gap-4">
        <div
          v-for="contact in contactData"
          :key="contact?.contactId"
          class="b2 relative grid aspect-square h-full grid-rows-12 gap-3 rounded-xl border border-zinc-500/10 p-5 shadow-md shadow-zinc-300/30"
        >
          <div class="absolute right-3 top-3">
            <button @click="handleClickDeleteContact(contact?.contactId)">
              <Trash />
            </button>
          </div>
          <div class="row-span-4 flex flex-col items-start gap-4">
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
          <div class="row-span-3 flex flex-col justify-end gap-1">
            <div
              v-for="social in contact?.userSocials"
              class="flex items-center gap-2"
            >
              <a
                :href="social?.socialLink"
                target="_blank"
                class="b3 flex items-center gap-1"
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
            class="b3 row-span-3 flex w-full flex-col justify-center gap-2 rounded-md border border-dashed p-2"
          >
            <div class="flex items-center gap-1">
              <Phone class="fill-black text-[15px]" />
              <p>{{ contact?.userProfile?.users_phone }}</p>
            </div>
            <div class="flex items-center gap-1">
              <Gmail class="fill-black text-[15px]" />
              <p>{{ contact?.userProfile?.users_email }}</p>
            </div>
          </div>
          <div class="b3 row-span-2 flex flex-wrap items-end gap-2">
            <p v-if="contact?.mutualEvents?.length > 0">Mutual events:</p>
            <p v-else>No mutual events</p>
            <div
              v-for="(event, index) in contact?.mutualEvents"
              class="flex items-center text-blue-400"
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
        </div>
      </div>
      <div
        v-show="isClickShareContact"
        class="fixed inset-0 flex items-center justify-center bg-black/50"
      >
        <!-- Mask -->
        <div class="relative h-full w-full">
          <!-- ทำให้พื้นหลังรอบๆ เบลอ -->
          <div class="absolute inset-0 backdrop-blur-md" />

          <!-- ช่องว่างโปร่งแสงที่มีขอบมน -->
          <div
            class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <button
              @click="isClickShareContact = !isClickShareContact"
              class="absolute right-4 top-4 z-50 text-2xl text-black"
            >
              <Cancle />
            </button>
            <video
              ref="video"
              width="400"
              height="400"
              autoplay
              playsinline
              class="absolute left-1/2 top-1/2 z-40 aspect-square h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-[20px] object-cover"
            ></video>
            <div
              class="relative h-[400px] w-[400px] overflow-hidden rounded-3xl border-4 border-white/50"
            >
              <!-- วิดีโอซ้อนทับ -->

              <button
                @click="generateQRCode"
                class="b2 absolute bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-black/70 px-3 py-1 text-light-grey"
              >
                My QR code
              </button>

              <!-- QR Code Panel -->
              <div
                :class="isShowQR ? 'translate-y-12' : 'translate-y-[400px]'"
                class="absolute left-1/2 z-50 flex h-full w-full -translate-x-1/2 cursor-pointer flex-col items-center rounded-t-2xl bg-white p-2 pt-20 transition-transform duration-700 ease-in-out"
              >
                <qrcode-vue :size="200" :value="qrValues" />
                <p class="b3 max-w-[200px] pt-2 text-center text-black/70">
                  Show this QR code to who you want to share contact
                </p>
                <button
                  @click="isShowQR = !isShowQR"
                  class="absolute right-4 top-4 text-2xl text-black"
                >
                  <Cancle />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
