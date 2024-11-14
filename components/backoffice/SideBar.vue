<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Calendar from '../icons/Calendar.vue';
import Dashboard from '../icons/Dashboard.vue';
import User from '../icons/User.vue';
import UserList from '../icons/UserList.vue';
import UserScreen from '../icons/UserScreen.vue';

onMounted(() => {});
</script>
<template>
  <div class="fixed h-full w-80 bg-white px-8 py-16 drop-shadow-lg">
    <div class="oooh-baby-regular mb-10 px-14 text-center text-5xl">
      <NuxtLink to="/backoffice">Gatherfy</NuxtLink>
    </div>
    <div class="flex flex-col gap-3">
      <NuxtLink to="">
        <div
          class="flex items-center gap-3 rounded-lg p-4 px-2 text-gray-600 duration-200 hover:bg-burgundy hover:text-white"
        >
          <Dashboard class="t2" />
          <p class="font-semibold">Dashboard</p>
        </div>
      </NuxtLink>
      <NuxtLink to="/backoffice/events">
        <div
          class="flex items-center gap-3 rounded-lg p-4 px-2 text-gray-600 duration-200 hover:bg-burgundy hover:text-white"
        >
          <Calendar class="t2" />
          <p class="font-semibold">Events</p>
        </div>
      </NuxtLink>
      <div class="hs-accordion" id="registration-accordion">
        <button
          type="button"
          class="hs-accordion-toggle flex w-full items-center gap-3 rounded-lg p-4 px-2 text-gray-600 duration-200 hover:bg-[#E8E8E8] hover:text-black hs-accordion-active:text-black hs-accordion-active:hover:bg-[#E8E8E8]"
          aria-expanded="true"
          aria-controls="registration-accordion"
        >
          <User class="t2" />
          <p class="font-semibold">Registration</p>

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
                class="flex items-center gap-x-3.5 rounded-lg px-2.5 py-2 text-sm text-gray-600 hover:bg-gray-100"
              >
                <UserScreen class="t2" />
                <p class="font-semibold">Event Registration</p>
              </div>
            </NuxtLink>
            <NuxtLink to="/backoffice/registrations">
              <div
                class="flex items-center gap-x-3.5 rounded-lg px-2.5 py-2 text-sm text-gray-600 hover:bg-gray-100"
              >
                <UserList class="t2" />
                <p class="font-semibold">All Registration</p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
