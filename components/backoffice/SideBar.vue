<script setup lang="ts">
import type { UserProfile } from '~/models/userProfile';
const signOut = useAuth().logout;
const profileData = useCookie<UserProfile>('profileData');
</script>
<template>
  <div
    class="fixed flex h-full w-80 flex-col justify-between bg-white px-8 py-16 drop-shadow-lg"
  >
    <div>
      <div class="oooh-baby-regular mb-10 px-14 text-center text-5xl">
        <NuxtLink to="/backoffice">Gatherfy</NuxtLink>
      </div>
      <div class="flex flex-col gap-3">
        <div class="b3">Main menu</div>
        <NuxtLink to="/backoffice/dashboard">
          <div
            class="flex items-center gap-3 rounded-lg p-4 px-2 text-gray-600 duration-200 hover:bg-burgundy hover:text-white"
          >
            <Dashboard class="t3" />
            <p class="b2 font-medium">Dashboard</p>
          </div>
        </NuxtLink>
        <NuxtLink to="/backoffice/events">
          <div
            class="flex items-center gap-3 rounded-lg p-4 px-2 text-gray-600 duration-200 hover:bg-burgundy hover:text-white"
          >
            <Calendar class="t3" />
            <p class="b2 font-medium">Events</p>
          </div>
        </NuxtLink>
        <div class="hs-accordion" id="registration-accordion">
          <button
            type="button"
            class="hs-accordion-toggle flex w-full items-center gap-3 rounded-lg p-4 px-2 text-gray-600 duration-200 hover:bg-[#E8E8E8] hover:text-black hs-accordion-active:text-black hs-accordion-active:hover:bg-[#E8E8E8]"
            aria-expanded="true"
            aria-controls="registration-accordion"
          >
            <User class="t3" />
            <p class="b2 font-medium">Registration</p>

            <svg
              class="ms-auto hidden size-4 text-gray-600 group-hover:text-gray-500 hs-accordion-active:block"
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
              class="ms-auto block size-4 text-gray-600 group-hover:text-gray-500 hs-accordion-active:hidden"
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
            class="hs-accordion-content hidden w-full overflow-hidden rounded-lg shadow-inner transition-[height] duration-300"
            role="region"
            aria-labelledby="registration-accordion"
          >
            <div class="ps-2 pt-2">
              <NuxtLink to="/backoffice/registrations/event">
                <div
                  class="flex items-center gap-x-3.5 rounded-lg px-2.5 py-3 text-sm text-gray-600 hover:bg-gray-100"
                >
                  <EventRegis class="t3" />
                  <p class="b2 font-medium">Event Registration</p>
                </div>
              </NuxtLink>
              <NuxtLink to="/backoffice/registrations">
                <div
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
            class="flex items-center gap-3 rounded-lg p-4 px-2 text-gray-600 duration-200 hover:bg-burgundy hover:text-white"
          >
            <Feedback class="t3" />
            <p class="b2 font-medium">Feedback</p>
          </div>
        </NuxtLink>
        <NuxtLink to="/backoffice/qrscan">
          <div
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
