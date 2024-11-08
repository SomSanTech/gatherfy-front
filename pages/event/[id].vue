<script setup lang="ts">
import Calendar from '~/components/icons/Calendar.vue';
import Location from '~/components/icons/Location.vue';
import Clock from '~/components/icons/Clock.vue';
import Cancle from '~/components/icons/Cancle.vue';
import UserProfile from '~/components/icons/UserProfile.vue';
import type { User } from '~/models/user';
const route = useRoute();
const param = route.params.id;
const isOpenPopup = ref(false);
const event = ref();
const userData = ref<User | null>(null);
const registrationBody = ref({});
const mockUserLogin = {
  userId: 2,
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
    alert('Register successfully');
  } else {
    alert('Failed!!');
  }
  isOpenPopup.value = false;
};

const fetchData = async () => {
  const fetchedData = await useFetchData(`v1/events/${param}`);
  event.value = fetchedData || [];
};

onMounted(() => {
  // Pretend to have authentication
  localStorage.setItem('user', JSON.stringify(mockUserLogin));
  const storedUser = localStorage.getItem('user');
  userData.value = storedUser ? JSON.parse(storedUser) : {};
  registrationBody.value = {
    eventId: 5, // Now it is Slug
    userId: userData.value?.userId,
    status: 'pending',
  };
  fetchData();
});

watchEffect(() => {
  if (param) {
    fetchData();
  }
});
</script>
<template>
  <div class="relative my-24 w-full">
    <div class="mx-auto my-20 w-full">
      <!-- header -->
      <div
        :style="{ backgroundImage: `url(${event?.image})` }"
        class="w-screen bg-opacity-75 bg-cover bg-center backdrop-blur-md"
      >
        <div
          class="relative z-10 bg-black bg-opacity-30 p-10 py-32 backdrop-blur-md"
        >
          <div class="mx-auto flex w-full max-w-4xl gap-12 text-white">
            <div class="h-[500px] w-[350px] bg-zinc-200">
              <img
                :src="event?.image"
                alt=""
                class="h-full w-full object-cover"
              />
            </div>

            <div class="flex w-fit flex-col justify-center gap-3">
              <div class="tag-group flex gap-2">
                <button class="bg-zin-200 rounded-md text-sm">Tag 1</button>
                <button class="bg-zin-200 rounded-md text-sm">Tag 2</button>
              </div>
              <p class="text-3xl font-semibold">{{ event?.name }}</p>
              <div class="flex items-center gap-2">
                <Calendar />
                <p v-if="event?.start_date && event?.end_date">
                  {{ useFormatDateTime(event?.start_date, 'date') }} -
                  {{ useFormatDateTime(event?.end_date, 'date') }}
                </p>
              </div>
              <div class="flex items-center gap-2">
                <Clock />
                <p v-if="event?.start_date && event?.end_date">
                  {{ useFormatDateTime(event?.start_date, 'time') }} -
                  {{ useFormatDateTime(event?.end_date, 'time') }}
                </p>
              </div>
              <div class="flex items-center gap-2">
                <Location />
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
      <div class="mx-auto mt-[100px] grid max-w-4xl grid-cols-5 gap-20">
        <div class="col-span-3 flex flex-col gap-4">
          <h1 class="t2 font-semibold">Event detail</h1>
          <p class="b2">
            {{ event?.detail }}
          </p>
          <div class="h-[500px] w-full bg-zinc-200">
            <img
              :src="event?.image"
              alt=""
              class="h-[500px] w-full object-cover"
            />
          </div>
        </div>
        <div class="col-span-2 flex flex-col gap-6">
          <div class="flex flex-col gap-5">
            <p>Event location</p>
            <div class="h-full w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30988.16801609143!2d100.55004526585483!3d13.867766604333376!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29c5a3a91d177%3A0x140b15ef77bd4508!2z4Lin4Lix4LiU4Lie4Lij4Liw4Lio4Lij4Li14Lih4Lir4Liy4LiY4Liy4LiV4Li44Lin4Lij4Lih4Lir4Liy4Lin4Li04Lir4Liy4Lij!5e0!3m2!1sth!2sth!4v1729251996890!5m2!1sth!2sth"
                width="370"
                height="370"
                style="border: 0"
                allowfullscreen="true"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
          <div class="flex flex-col gap-5">
            <p>Tags</p>
            <div class="flex gap-2">
              <button
                v-for="tag in event?.tags"
                class="b3 w-fit rounded-lg bg-light-grey px-10 py-2 text-center drop-shadow-md duration-100 hover:bg-grey"
              >
                {{ tag }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- pop up -->
    <div
      v-show="isOpenPopup"
      class="fixed right-1/2 top-1/2 z-50 w-[600px] -translate-y-1/2 translate-x-1/2 overflow-y-auto rounded-lg bg-white p-7 shadow-2xl"
    >
      <button @click="isOpenPopup = false" class="absolute right-0 top-0 p-3">
        <Cancle />
      </button>
      <div class="flex justify-between gap-5">
        <div>
          <div>
            <p class="b2 font-semibold">Registration</p>
            <h1 class="t3 py-2 text-2xl font-semibold">{{ event?.name }}</h1>
            <div class="b2 flex items-center gap-2 py-1">
              <Calendar />
              <p v-if="event?.start_date && event?.end_date">
                {{ useFormatDateTime(event?.start_date, 'date') }} -
                {{ useFormatDateTime(event?.end_date, 'date') }}
              </p>
            </div>
            <div class="b2 flex items-center gap-2 py-1">
              <Clock />
              <p v-if="event?.start_date && event?.end_date">
                {{ useFormatDateTime(event?.start_date, 'time') }} -
                {{ useFormatDateTime(event?.end_date, 'time') }}
              </p>
            </div>
            <div class="mt-2 flex items-center gap-2">
              <UserProfile class="b1" />
              <p class="b2">
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
