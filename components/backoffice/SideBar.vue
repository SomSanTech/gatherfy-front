<script setup lang="ts">
import type { UserProfile } from '~/models/userProfile';
import Cancle from '../icons/Cancle.vue';
const signOut = useAuth().logout;
const profileData = useCookie<UserProfile>('profileData');
const route = useRoute();
const isBackoffice = ref(route.fullPath.includes('backoffice'));
defineProps<{ isOpen: boolean }>(); // รับค่าเปิด-ปิด Sidebar
const emit = defineEmits(['close']); // ใช้ส่ง event กลับไปปิด Sidebar

const isOpen = ref(
  route.fullPath === '/backoffice/registrations/event' ||
    route.fullPath === '/backoffice/registrations'
);

watchEffect(() => {
  isOpen.value =
    route.fullPath === '/backoffice/registrations/event' ||
    route.fullPath === '/backoffice/registrations';
});
</script>
<template>
  <div
    :class="isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
    class="fixed flex h-full w-80 flex-col justify-between border border-white/90 bg-white/90 px-8 py-16 drop-shadow-md backdrop-blur-xl"
  >
    <button
      @click="$emit('close')"
      class="absolute right-4 top-4 z-50 text-gray-600 md:hidden"
    >
      <Cancle />
    </button>
    <div>
      <div class="oooh-baby-regular mb-10 px-14 text-center text-5xl">
        <NuxtLink to="/backoffice">Gatherfy</NuxtLink>
      </div>
      <div class="flex flex-col gap-3">
        <div class="b3">Main menu</div>
        <NuxtLink to="/backoffice/dashboard">
          <div
            :class="
              route.fullPath.includes('dashboard')
                ? 'bg-burgundy text-white'
                : ''
            "
            class="flex items-center gap-3 rounded-lg p-4 px-2 text-gray-600 duration-200 hover:bg-burgundy hover:text-white"
          >
            <Dashboard class="t3" />
            <p class="b2 font-medium">Dashboard</p>
          </div>
        </NuxtLink>
        <NuxtLink to="/backoffice/events">
          <div
            :class="
              route.fullPath.includes('events') ? 'bg-burgundy text-white' : ''
            "
            class="flex items-center gap-3 rounded-lg p-4 px-2 text-gray-600 duration-200 hover:bg-burgundy hover:text-white"
          >
            <Calendar class="t3" />
            <p class="b2 font-medium">Events</p>
          </div>
        </NuxtLink>
        <div class="hs-accordion" id="registration-accordion">
          <button
            type="button"
            class="hs-accordion-toggle flex w-full items-center gap-3 rounded-lg p-4 px-2 text-gray-600 duration-200 hover:bg-[#E8E8E8] hover:text-black"
            :class="{ 'hs-accordion-active text-black': isOpen }"
            aria-expanded="true"
            @click="isOpen = !isOpen"
          >
            <User class="t3" />
            <p class="b2 font-medium">Registration</p>

            <svg
              class="ms-auto hidden size-4 text-gray-600 group-hover:text-gray-500"
              :class="{ 'hs-accordion-active:block': isOpen }"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m18 15-6-6-6 6" />
            </svg>

            <svg
              class="ms-auto block size-4 text-gray-600 group-hover:text-gray-500"
              :class="{ 'hs-accordion-active:hidden': isOpen }"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
          <div
            id="registration-accordion"
            class="hs-accordion-content w-full overflow-hidden rounded-lg shadow-inner transition-[height] duration-300"
            :class="{ hidden: !isOpen }"
            role="region"
          >
            <div class="ps-2 pt-2">
              <NuxtLink to="/backoffice/registrations/event">
                <div
                  :class="
                    route.fullPath === '/backoffice/registrations/event'
                      ? 'bg-burgundy text-white'
                      : ''
                  "
                  class="flex items-center gap-x-3.5 rounded-lg px-2.5 py-3 text-sm text-gray-600 hover:bg-gray-100"
                >
                  <EventRegis class="t3" />
                  <p class="b2 font-medium">Event Registration</p>
                </div>
              </NuxtLink>
              <NuxtLink to="/backoffice/registrations">
                <div
                  :class="
                    route.fullPath === '/backoffice/registrations'
                      ? 'bg-burgundy text-white'
                      : ''
                  "
                  class="flex items-center gap-x-3.5 rounded-lg px-2.5 py-3 text-sm text-gray-600 hover:bg-gray-100"
                >
                  <User class="t3" />
                  <p class="b2 font-medium">All Registration</p>
                </div>
              </NuxtLink>
            </div>
          </div>
        </div>
        <NuxtLink to="/backoffice/feedback">
          <div
            :class="
              route.fullPath.includes('feedback')
                ? 'bg-burgundy text-white'
                : ''
            "
            class="flex items-center gap-3 rounded-lg p-4 px-2 text-gray-600 duration-200 hover:bg-burgundy hover:text-white"
          >
            <Feedback class="t3" />
            <p class="b2 font-medium">Feedback</p>
          </div>
        </NuxtLink>
        <NuxtLink to="/backoffice/qrscan">
          <div
            :class="
              route.fullPath.includes('qrscan') ? 'bg-burgundy text-white' : ''
            "
            class="flex items-center gap-3 rounded-lg p-4 px-2 text-gray-600 duration-200 hover:bg-burgundy hover:text-white"
          >
            <QrcodeScan class="t3" />
            <p class="b2 font-medium">Scan QR Code</p>
          </div>
        </NuxtLink>
        <!-- <div class="b3">General</div>
        <NuxtLink
          :to="{
            name: `backoffice-feedback-notification`,
          }"
        >
          <div
            class="flex items-center gap-3 rounded-lg p-4 px-2 text-gray-600 duration-200 hover:bg-burgundy hover:text-white"
          >
            <Feedback class="t3" />
            <p class="b2 font-medium">Feedback</p>
          </div>
        </NuxtLink> -->
      </div>
    </div>

    <div class="flex w-full items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <img
          v-if="profileData?.users_image"
          :src="profileData?.users_image"
          alt=""
          class="h-8 w-8 rounded-full"
        />
        <div
          v-else
          class="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-200 text-zinc-600"
        >
          <UserProfileImg />
        </div>
        <p class="b2">{{ profileData?.username }}</p>
      </div>
      <button @click="signOut">
        <SignOut class="text-xl" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.transition-transform {
  transition: transform 0.3s ease-in-out;
}
</style>
