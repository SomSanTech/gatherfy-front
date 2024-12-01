<script setup lang="ts">
import Calendar from '~/components/icons/Calendar.vue';
import Location from '~/components/icons/Location.vue';
import Clock from '~/components/icons/Clock.vue';
import Cancle from '~/components/icons/Cancle.vue';
import UserProfile from '~/components/icons/UserProfile.vue';
import Organisation from '~/components/icons/Organisation.vue';

import type { User } from '~/models/user';
const route = useRoute();
const error = useError();
const param = route.params.id;
const isOpenPopup = ref(false);
const event = ref();
const userData = ref<User | null>(null);
const registrationBody = ref({});
const isLoading = ref(true);
const mockUserLogin = {
  userId: 5,
  firstname: 'Michael',
  lastname: 'Brown',
  username: 'mikeb',
  gender: 'Male',
  email: 'mikeb@example.com',
  phone: '6677889900',
  role: 'Attendee',
};

const regis = async () => {
  const regsitered = await useFetchRegistration(
    `v1/registrations`,
    'POST',
    registrationBody.value
  );
  if (regsitered === 200) {
    alert('Thank you for registration');
  } else {
    alert('Already Registered for the Event');
  }
  isOpenPopup.value = false;
};

const fetchData = async () => {
  const fetchedData = await useFetchData(`v1/events/${param}`);
  if (fetchedData.error) {
    error.value = fetchData;
  } else {
    event.value = fetchedData || [];
  }
};

onMounted(async () => {
  try {
    isLoading.value = true;
    localStorage.setItem('user', JSON.stringify(mockUserLogin));
    const storedUser = localStorage.getItem('user');
    userData.value = storedUser ? JSON.parse(storedUser) : {};

    await fetchData();
    registrationBody.value = {
      eventId: event.value?.eventId,
      userId: userData.value?.userId,
      status: 'Awaiting Check-in',
    };
  } finally {
    isLoading.value = false;
  }
});

watchEffect(() => {
  if (param) {
    fetchData();
  }
});
</script>
<template>
  <div class="relative my-24 w-full">
    <div v-if="isLoading" class="my-52 flex items-center justify-center">
      <span class="loader"></span>
    </div>
    <div v-else class="mx-auto my-20 w-full">
      <!-- header -->
      <div
        :style="{ backgroundImage: `url(${event?.image})` }"
        class="w-screen bg-opacity-75 bg-cover bg-center backdrop-blur-md"
      >
        <div
          class="relative z-10 bg-black bg-opacity-30 p-10 py-32 backdrop-blur-md"
        >
          <div class="mx-auto flex w-full max-w-4xl gap-12 text-white">
            <div class="h-[500px] w-[400px] bg-zinc-200">
              <img
                :src="event?.image"
                alt=""
                class="detail-img h-full w-full object-cover"
              />
            </div>

            <div class="flex w-fit flex-col justify-center gap-3">
              <div class="flex gap-2">
                <div v-for="tag in event?.tags">
                  <NuxtLink :to="{ name: 'events', query: { tag: tag } }">
                    <button
                      class="detail-tag b3 rounded-md border border-light-grey px-4"
                    >
                      {{ tag }}
                    </button>
                  </NuxtLink>
                </div>
              </div>
              <p class="detail-name text-3xl font-semibold">
                {{ event?.name }}
              </p>
              <div class="flex items-center gap-2">
                <Organisation />
                <p class="detail-owner">
                  {{ event?.owner }}
                </p>
              </div>
              <div class="flex items-center gap-2">
                <Calendar />
                <p
                  class="detail-time"
                  v-if="event?.start_date && event?.end_date"
                >
                  {{ useFormatDateTime(event?.start_date, 'date') }} -
                  {{ useFormatDateTime(event?.end_date, 'date') }}
                </p>
              </div>
              <div class="flex items-center gap-2">
                <Clock />
                <p
                  class="detail-date"
                  v-if="event?.start_date && event?.end_date"
                >
                  {{ useFormatDateTime(event?.start_date, 'time') }} -
                  {{ useFormatDateTime(event?.end_date, 'time') }}
                </p>
              </div>
              <div class="detail-location flex items-center gap-2">
                <Location class="shrink-0" />
                <p>{{ event?.location }}</p>
              </div>
              <div class="flex gap-2">
                <BtnComp @click="isOpenPopup = true" text="Registor event" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- content -->
      <div
        id="content"
        class="mx-auto mt-[100px] grid max-w-4xl grid-cols-5 gap-20"
      >
        <div class="col-span-3 flex flex-col gap-4">
          <h1 class="t2 font-semibold">Event detail</h1>
          <p class="b2 detail-detail">
            {{ event?.detail }}
          </p>
          <div class="w-full bg-zinc-200">
            <img :src="event?.image" alt="" class="w-full object-cover" />
          </div>
        </div>
        <div class="col-span-2 flex flex-col gap-6">
          <div class="flex flex-col gap-5">
            <p class="t3 font-semibold">Event location</p>
            <div class="">
              <div v-html="event?.map" class="detail-map"></div>
            </div>
          </div>
          <div class="flex flex-col gap-5">
            <p class="t3 font-semibold">Tags</p>
            <div class="tag-group flex gap-2">
              <div v-for="tag in event?.tags">
                <NuxtLink :to="{ name: 'events', query: { tag: tag } }">
                  <button
                    class="b3 w-fit rounded-lg border border-dark-grey/60 px-10 py-2 text-center drop-shadow-md duration-300 hover:bg-grey"
                  >
                    {{ tag }}
                  </button>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- pop up -->
    <div
      v-show="isOpenPopup"
      class="regis-popup fixed right-1/2 top-1/2 z-50 w-[600px] -translate-y-1/2 translate-x-1/2 overflow-y-auto rounded-lg bg-white p-7 shadow-2xl"
    >
      <button
        @click="isOpenPopup = false"
        class="close-popup absolute right-0 top-0 p-3"
      >
        <Cancle />
      </button>
      <div class="flex justify-between gap-5">
        <div>
          <div>
            <p class="b2 font-semibold">Registration</p>
            <h1 class="regis-name t3 py-2 text-2xl font-semibold">
              {{ event?.name }}
            </h1>
            <div class="b2 flex items-center gap-2 py-1">
              <Calendar />
              <p v-if="event?.start_date && event?.end_date" class="regis-date">
                {{ useFormatDateTime(event?.start_date, 'date') }} -
                {{ useFormatDateTime(event?.end_date, 'date') }}
              </p>
            </div>
            <div class="regis-time b2 flex items-center gap-2 py-1">
              <Clock />
              <p v-if="event?.start_date && event?.end_date">
                {{ useFormatDateTime(event?.start_date, 'time') }} -
                {{ useFormatDateTime(event?.end_date, 'time') }}
              </p>
            </div>
            <div class="mt-2 flex items-center gap-2">
              <UserProfile class="b1" />
              <p class="regis-user b2">
                <span class="mr-3 font-semibold">{{ userData?.username }}</span
                >{{ userData?.email }}
              </p>
            </div>
            <button
              class="b3 mt-4 rounded-lg bg-black px-4 py-1 text-white"
              @click="regis"
            >
              One-click Register
            </button>
          </div>
        </div>

        <img
          :src="event?.image"
          class="max-w-[150px] self-end rounded-lg"
          alt=""
        />
      </div>
    </div>
  </div>
</template>
