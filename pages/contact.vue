<script setup lang="ts">
import Phone from '~/components/icons/Phone.vue';
import Gmail from '~/components/icons/Gmail.vue';
import { BrowserQRCodeReader } from '@zxing/browser';
definePageMeta({
  layout: 'profile',
});
const contacts = [
  { id: 1, name: 'Alice Smith', phone: '+1 987 654 321' },
  { id: 2, name: 'Bob Johnson', phone: '+1 555 666 777' },
  { id: 3, name: 'Charlie Brown', phone: '+1 444 333 222' },
];

function shareContact() {
  alert('Sharing your contact...');
}

function saveContact(contact) {
  if (contact) {
    alert(`Saving contact: ${contact.name}`);
  } else {
    alert('Saving your contact...');
  }
}

const userProfile = useCookie('profileData', { default: () => ({}) });
const isExploreContact = ref([]);

function toggleExploreContact(index) {
  if (isExploreContact.value.includes(index)) {
    isExploreContact.value = isExploreContact.value.filter((i) => i !== index);
  } else {
    isExploreContact.value.push(index);
  }
}
const video = ref<HTMLVideoElement | null>(null);
const scannedValue = ref<string | null>(null);
const isLoading = ref(false);
const apiResponse = ref<string | null>(null);
let qrCodeReader: BrowserQRCodeReader;
onMounted(async () => {
  qrCodeReader = new BrowserQRCodeReader();
  qrCodeReader.decodeFromVideoDevice(
    null,
    video.value,
    async (result, error) => {
      if (result) {
      }
    }
  );
});
</script>

<template>
  <div class="grid w-full grid-cols-3 flex-wrap gap-4">
    <div
      v-for="n in 10"
      :key="n"
      class="b2 flex h-fit w-full flex-col gap-5 rounded-xl border border-zinc-500/10 p-5 shadow-md shadow-zinc-300/30"
    >
      <div class="flex items-center gap-4">
        <div class="h-14 w-14 rounded-full bg-zinc-200">
          <!-- <img src=""/> -->
        </div>
        <div class="flex flex-col">
          <div>Username</div>
          <div>Fullname naaaa</div>
        </div>
      </div>

      <button @click="toggleExploreContact(n)">click</button>

      <div
        :class="[
          'flex flex-col gap-2 overflow-hidden rounded-md border border-dashed p-2 transition-all duration-700 ease-in-out',
          isExploreContact.includes(n)
            ? 'mt-2 max-h-40'
            : 'mt-0 max-h-0 border-0 p-0',
        ]"
      >
        <div v-if="isExploreContact.includes(n)">
          <div class="flex items-center gap-1">
            <Phone class="fill-black text-[15px]" />
            <p>{{ userProfile.users_phone }}</p>
          </div>
          <div class="flex items-center gap-1">
            <Gmail class="fill-black text-[15px]" />
            <p>{{ userProfile.users_email }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="absolute w-full bg-zinc-300">
    <video
      ref="video"
      width="400"
      height="400"
      class="rounded-lg object-cover"
    ></video>
  </div>
  <div
    v-if="false"
    class="b2 w-f\ull translate-t-1/2 absolute left-1/2 top-1/2 z-50 flex w-fit translate-x-1/2 flex-col gap-5 rounded-xl border border-zinc-500/10 bg-[#E9E9E9]/40 p-8 shadow-md shadow-zinc-300/30"
  >
    QR code reader
  </div>
</template>

<style scoped></style>
