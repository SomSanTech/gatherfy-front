<script setup lang="ts">
import Calendar from '~/components/icons/Calendar.vue';
import Location from '~/components/icons/Location.vue';
import Clock from '~/components/icons/Clock.vue';
import Cancle from '~/components/icons/Cancle.vue';
import UserProfileIcon from '~/components/icons/UserProfile.vue';
import Organisation from '~/components/icons/Organisation.vue';
import Subscribe from '~/components/icons/Subscribe.vue';
import type { UserProfile } from '~/models/userProfile';
import FavOutline from '~/components/icons/FavOutline.vue';

const route = useRoute();
const error = useError();
const param = route.params.id;
const isOpenPopup = ref(false);
const event = ref();
const userProfile = useCookie<UserProfile>('profileData');
const loginPopup = useState('loginPopup');
const checkIsAlreadyRegis = ref(false);
const userSubscribeTagData = ref([]);
const isHavePopupOpen = useState('isHavePopupOpen');
const userRegisHistory = useState('userRegisHistory');
const isShowSuccessRegisPopup = ref(false);
const subAction = ref('');
const isShowSubTagPopup = ref(false);
const accessToken = useCookie('accessToken');
const { state, showPopup } = usePopup();
const isLoading = useState('isLoading');
const isLoadRegis = ref<boolean>(false);
const isSelectDate = ref(true);

const handleGoSignIn = () => {
  loginPopup.value = true;
  isHavePopupOpen.value = true;
};
function toLocalISOString(date: Date): string {
  const offsetMs = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - offsetMs);
  return localDate.toISOString().slice(0, 19); // ตัด 'Z' และ milliseconds ทิ้ง
}

const regis = async () => {
  if (event.value) {
    isLoadRegis.value = true;
    const formattedDate = selectedDate.value
      ? toLocalISOString(selectedDate.value)
      : null;

    if (formattedDate === null) {
      isSelectDate.value = false;
      isLoadRegis.value = false;
    } else {
      const regsitered = await useFetchWithAuth(
        `v2/registrations`,
        'POST',
        accessToken.value,
        {
          eventId: event.value.eventId,
          regisDate: formattedDate,
        }
      );

      if (regsitered.status === 200) {
        const regisData = await useFetchWithAuth(
          'v1/tickets',
          'GET',
          accessToken.value
        );
        if ('data' in regisData) {
          userRegisHistory.value = regisData.data;
        }
        isShowSuccessRegisPopup.value = true;
        showPopup('Register success', 'complete');
      }
      if ('error' in regsitered) {
        showPopup(`${regsitered.error}`, 'warn');
      }
      isOpenPopup.value = false;
      isLoadRegis.value = false;
    }
  }
};

const fetchData = async () => {
  const fetchedData = await useFetchData(`v2/events/${param}`, 'GET');
  if (fetchedData.error) {
    error.value = fetchData;
  } else {
    event.value = (await fetchedData.data) || [];
  }
};

const handleRegisPopup = (isEventAvaliable: boolean, ticketEndDate: string) => {
  if (userProfile.value && !isEventAvaliable) {
    isOpenPopup.value = true;
  } else {
    handleGoSignIn();
  }
};

// const checkIsAlreadySubTag = (tagId: number) => {
//   let compareResult = false;
//   if (accessToken.value) {
//     if (userSubscribeTagData.value)
//       compareResult = userSubscribeTagData.value?.tagId.includes(tagId);
//   }
//   return compareResult;
// };

const checkIsAlreadySubTag = (tagId: number) => {
  let compareResult = false;
  if (accessToken.value && userSubscribeTagData.value) {
    const tagIds = userSubscribeTagData.value.tagId;
    if (Array.isArray(tagIds)) {
      compareResult = tagIds.includes(tagId);
    }
  }
  return compareResult;
};

const handleCompleteModal = () => {
  state.isVisible = false;
};
const handleSubscribeTag = async (tagId: number) => {
  if (!userProfile.value) {
    handleGoSignIn();
  } else {
    if (!checkIsAlreadySubTag(tagId)) {
      subAction.value = 'follow';
      const response = await useFetchWithAuth(
        'v1/subscribe',
        'POST',
        accessToken.value,
        {
          tagId: tagId,
        }
      );

      if (response.status === 200) {
        const subscribeTagData = await useFetchWithAuth(
          'v1/subscribed',
          'GET',
          accessToken.value
        );

        userSubscribeTagData.value = subscribeTagData.data;
        isShowSubTagPopup.value = true;
        showPopup(
          'Thank you for subscribing to this event tag! ',
          'complete',
          'Stay tuned for updates and announcements'
        );
      }

      if (response.error) {
        showPopup('You already follow this tag', 'warn');
      }
    } else {
      subAction.value = 'delete';

      const response = await useFetchWithAuth(
        `v1/subscribe/${tagId}`,
        'DELETE',
        accessToken.value
      );

      if (response.status === 200) {
        const subscribeTagData = await useFetchWithAuth(
          'v1/subscribed',
          'GET',
          accessToken.value
        );

        userSubscribeTagData.value = subscribeTagData.data;
        isShowSubTagPopup.value = true;
        showPopup(
          'You have successfully unsubscribed from this event tag',
          'complete'
        );
      }

      if (response.error) {
        showPopup('Can not unsubscribed try again later', 'error');
      }
    }
  }
};
const favEvent = ref();
const getFavEvent = async () => {
  const favData = await useFetchWithAuth(
    'v1/favorites',
    'GET',
    accessToken.value
  );
  if ('data' in favData) favEvent.value = favData.data;
};
const handleFavEvent = async () => {
  if (!userProfile.value) {
    handleGoSignIn();
  } else {
    let isFav = favEvent.value.find((f) => f.eventId === event.value.eventId);

    let fav;
    if (isFav) {
      fav = await useFetchWithAuth(
        `v1/favorites/${event.value.eventId}`,
        'DELETE',
        accessToken.value
      );
    } else {
      fav = await useFetchWithAuth('v1/favorites', 'POST', accessToken.value, {
        eventId: event.value.eventId,
      });
    }
    if (fav.status === 200) {
      getFavEvent();
    } else {
      showPopup('Can not fav this event try again later', 'error');
    }
  }
};
const availableDates = ref();

const selectedDate = ref<Date | null>(null);
function generateDatesInRange(start: Date, end: Date): Date[] {
  const dates: Date[] = [];
  const current = new Date(start);

  // Set time to 00:00:00 to avoid hour mismatch
  current.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  while (current <= end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}
function selectDate(date: Date) {
  selectedDate.value = date;
}
function formatDate(date: Date) {
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${date.getFullYear()}`;
}
onMounted(async () => {
  isLoading.value = true;
  try {
    await fetchData();
    if (event.value) {
      availableDates.value = generateDatesInRange(
        new Date(event.value.start_date),
        new Date(event.value.end_date)
      );
      await useFetchCreateUpdate(
        `v1/countView/${event.value?.eventId}`,
        'POST'
      );
    }
    if (accessToken.value) {
      const regisData = await useFetchWithAuth(
        'v1/tickets',
        'GET',
        accessToken.value
      );
      if ('data' in regisData) {
        userRegisHistory.value = regisData.data;
      } else {
        if ('error' in regisData)
          console.error('Fetch failed:', regisData.error);
      }

      const subscribeTagData = await useFetchWithAuth(
        'v1/subscribed',
        'GET',
        accessToken.value
      );
      if ('data' in subscribeTagData) {
        userSubscribeTagData.value = subscribeTagData.data;
      } else {
        if ('error' in subscribeTagData)
          console.error('Fetch failed:', subscribeTagData.error);
      }

      getFavEvent();
    }
  } finally {
    isLoading.value = false;
  }
});

watchEffect(() => {
  if (!event.value || !userRegisHistory.value) return;

  checkIsAlreadyRegis.value = userRegisHistory.value.some((regis) => {
    return regis.eventId === event.value.eventId;
  });
});

watchEffect(() => {
  if (param) {
    fetchData();
  }
});

function removeWidthHeightAttributes(htmlString) {
  if (htmlString) return htmlString.replace(/\s(width|height)="\d+"/g, '');
}

function formatDateCheck(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // เดือนนับจาก 0 ต้อง +1
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

watchEffect(() => {
  if (selectedDate.value) {
    isSelectDate.value = true;
  }
});

const value = ref(new Date(2022, 2, 3));
</script>
<template>
  <CompleteModal
    :isShowCompleteModal="state.isVisible"
    :title="state.text"
    :status="state.status"
    :sub-title="state.subTitle"
    @complete-action="handleCompleteModal"
  />
  <Loader v-if="isLoading" />

  <div v-else class="relative w-full">
    <div class="my-16 w-full lg:my-24">
      <!-- header -->
      <div
        :style="{ backgroundImage: `url(${event?.image})` }"
        class="w-full bg-opacity-75 bg-cover bg-center backdrop-blur-md"
      >
        <div
          class="relative z-10 bg-black bg-opacity-30 p-10 backdrop-blur-md lg:py-32"
        >
          <div
            class="mx-auto flex w-full max-w-6xl grid-cols-5 flex-col items-center gap-10 text-white lg:grid"
          >
            <div
              class="relative col-span-3 flex max-h-[500px] w-full items-center justify-center overflow-hidden"
            >
              <!-- แถบคาด -->
              <div
                v-if="
                  event?.date?.every((d) => {
                    const key = Object.keys(d)[0];
                    return d[key] === 'full';
                  })
                "
                class="absolute -left-0 top-0 w-[110px] -translate-x-6 translate-y-4 -rotate-45 overflow-hidden rounded-br-lg bg-red-600 px-3 py-1 text-center text-xs font-bold text-white"
              >
                FULL
              </div>

              <img
                :src="event?.image"
                alt=""
                class="max-h-[300px] w-auto object-contain lg:max-h-[500px]"
              />
            </div>

            <div class="col-span-2 flex w-fit flex-col justify-center gap-3">
              <div class="flex gap-2">
                <div v-for="tag in event?.tags">
                  <NuxtLink
                    :to="{ name: 'events', query: { tag: tag.tag_title } }"
                  >
                    <button
                      class="detail-tag b3 rounded-md border border-light-grey px-4"
                    >
                      {{ tag.tag_title }}
                    </button>
                  </NuxtLink>
                </div>
              </div>
              <p class="detail-name t1 font-semibold">
                {{ event?.name }}
              </p>
              <div class="flex items-center gap-2">
                <Organisation />
                <p class="detail-owner b2">
                  {{ event?.owner }}
                </p>
              </div>
              <div class="b2 flex items-center gap-2">
                <Calendar />
                <p
                  class="detail-time"
                  v-if="event?.start_date && event?.end_date"
                >
                  {{ useFormatDateTime(event?.start_date, 'date') }}
                  <span
                    v-if="
                      useFormatDateTime(event?.start_date, 'date') !==
                      useFormatDateTime(event?.end_date, 'date')
                    "
                  >
                    - {{ useFormatDateTime(event?.end_date, 'date') }}
                  </span>
                </p>
              </div>
              <div class="b2 flex items-center gap-2">
                <Clock />
                <p
                  class="detail-date"
                  v-if="event?.start_date && event?.end_date"
                >
                  {{ useFormatDateTime(event?.start_date, 'time') }} -
                  {{ useFormatDateTime(event?.end_date, 'time') }}
                </p>
              </div>
              <div class="detail-location b2 flex items-center gap-2">
                <Location class="shrink-0" />
                <p>{{ event?.location }}</p>
              </div>
              <div class="flex gap-2">
                <BtnComp
                  :class="
                    new Date(event?.ticket_start_date).getTime() >
                      new Date().getTime() ||
                    new Date(event?.ticket_end_date).getTime() <
                      new Date().getTime() ||
                    checkIsAlreadyRegis ||
                    event?.date?.every((d) => {
                      const key = Object.keys(d)[0];
                      return d[key] === 'full';
                    })
                      ? 'pointer-events-none'
                      : ''
                  "
                  @click="
                    handleRegisPopup(
                      new Date(event?.ticket_start_date).getTime() >
                        new Date().getTime(),
                      event.ticket_end_date
                    )
                  "
                  :color="
                    checkIsAlreadyRegis
                      ? 'gray'
                      : new Date(event?.ticket_start_date).getTime() >
                          new Date().getTime()
                        ? 'gray'
                        : new Date(event?.ticket_end_date).getTime() <
                              new Date().getTime() ||
                            event?.date?.every((d) => {
                              const key = Object.keys(d)[0];
                              return d[key] === 'full';
                            })
                          ? 'gray'
                          : ''
                  "
                  :text="
                    checkIsAlreadyRegis
                      ? 'You’re registered'
                      : new Date(event?.ticket_start_date).getTime() >
                          new Date().getTime()
                        ? 'Opening soon'
                        : new Date(event?.ticket_end_date).getTime() <
                            new Date().getTime()
                          ? 'Registration closed'
                          : event?.date?.every((d) => {
                                const key = Object.keys(d)[0];
                                return d[key] === 'full';
                              })
                            ? 'Fully booked'
                            : 'Register now'
                  "
                />
                <button @click="handleFavEvent" class="rounded-md bg-white p-2">
                  <FavFill
                    v-if="
                      favEvent &&
                      favEvent.find((a) => {
                        return a.eventId === event.eventId;
                      })
                    "
                    class="text-xl text-burgundy"
                  />
                  <FavOutline v-else class="fill-dark text-xl text-dark" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- content -->
      <div
        id="content"
        class="mx-auto mt-[50px] flex grid-cols-5 flex-col gap-20 px-12 lg:mt-[100px] lg:grid lg:max-w-6xl lg:px-0"
      >
        <div class="col-span-3 flex flex-col gap-2 lg:gap-4">
          <h1 class="t2 font-semibold">Event detail</h1>
          <p
            class="b2 detail-detail"
            v-html="event?.detail.replace(/\n/g, '<br/>')"
          ></p>
          <div class="w-full bg-zinc-200">
            <img :src="event?.image" alt="" class="w-full object-cover" />
          </div>
        </div>
        <div class="col-span-2 flex flex-col gap-6">
          <div class="flex flex-col gap-5">
            <p class="t3 font-semibold">Event location</p>
            <div class="">
              <div
                v-html="removeWidthHeightAttributes(event?.map)"
                class="h-full w-full"
              ></div>
            </div>
          </div>
          <div class="flex flex-col gap-2 lg:gap-5">
            <p class="t3 font-semibold">Tags</p>
            <div class="tag-group flex flex-wrap gap-2">
              <div
                v-for="tag in event?.tags"
                class="flex h-full items-center justify-center gap-2 rounded-lg border border-dark-grey/60 p-2 px-4"
              >
                <NuxtLink
                  :to="{ name: 'events', query: { tag: tag.tag_title } }"
                >
                  <button
                    class="b3 flex h-full w-fit items-center gap-1 rounded-l-lg border-dark-grey/60 text-center drop-shadow-md duration-300 hover:text-burgundy"
                  >
                    {{ tag.tag_title }}
                  </button>
                </NuxtLink>

                <button
                  @click="handleSubscribeTag(tag.tag_id)"
                  class="flex h-full w-full flex-auto items-center justify-center rounded-r-lg border-dark-grey/60 duration-300 hover:text-burgundy"
                >
                  <Check
                    v-if="checkIsAlreadySubTag(tag.tag_id)"
                    class="text-lg"
                  />
                  <Subscribe v-else class="text-lg" />
                </button>
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-2 lg:gap-5">
            <p class="t3 font-semibold">Organized by</p>
            <div
              class="flex w-full items-center justify-center rounded-lg border border-dark-grey/60 py-12 text-center"
            >
              {{ event?.owner }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Regis popup -->
    <!-- isOpenPopup -->
    <div
      v-show="isOpenPopup"
      class="regis-popup fixed right-1/2 top-1/2 z-50 max-h-[500px] w-3/4 -translate-y-1/2 translate-x-1/2 overflow-y-auto rounded-xl bg-white p-5 shadow-2xl lg:w-[600px] lg:p-7"
    >
      <button
        @click="isOpenPopup = false"
        class="close-popup absolute right-0 top-0 p-3"
      >
        <Cancle />
      </button>
      <div class="flex flex-col justify-between gap-3 lg:flex-row lg:gap-5">
        <div>
          <div>
            <p class="b2 font-semibold">Registration</p>
            <h1 class="regis-name t3 py-2 text-2xl font-semibold">
              {{ event?.name }}
            </h1>
            <!-- <div class="b2 flex items-center gap-2 py-1">
              <Calendar />
              <p v-if="event?.start_date && event?.end_date" class="regis-date">
                {{ useFormatDateTime(event?.start_date, 'date') }} -
                {{ useFormatDateTime(event?.end_date, 'date') }}
              </p>
            </div> -->
            <div class="regis-time b2 flex items-center gap-2 py-1">
              <Clock />
              <p v-if="event?.start_date && event?.end_date">
                {{ useFormatDateTime(event?.start_date, 'time') }} -
                {{ useFormatDateTime(event?.end_date, 'time') }}
              </p>
            </div>
            <div class="flex items-center gap-2 py-1">
              <UserProfileIcon class="b1" />
              <p class="regis-user b2">
                <span class="mr-2 font-semibold">{{
                  userProfile?.username
                }}</span
                ><br class="lg:hidden" /><span class="text-dark-grey">
                  {{ userProfile?.users_email }}
                </span>
              </p>
            </div>
            <div class="mt-3">
              <p class="b3 flex items-center gap-2 font-semibold">
                <Calendar /> Select date
                <span v-if="!isSelectDate" class="text-burgundy"
                  >Please select date</span
                >
              </p>
              <div class="b3 grid grid-cols-2 gap-1 py-2 lg:gap-2">
                <button
                  v-for="date in availableDates"
                  :key="date"
                  @click="selectDate(date)"
                  :class="[
                    'rounded-lg border py-1 transition lg:px-3 lg:py-2',
                    selectedDate?.toDateString() === date.toDateString()
                      ? 'bg-ble-600 border-burgundy text-gray-800'
                      : event?.date?.find(
                            (d) => d[formatDateCheck(date)] === 'full'
                          )
                        ? 'cursor-not-allowed border-gray-400 bg-gray-300 text-gray-500'
                        : 'border-gray-300 bg-white text-gray-800 hover:bg-gray-100',
                  ]"
                >
                  {{ useFormatDateTime(date, 'date') }}
                </button>
              </div>
            </div>
            <div
              class="mt-2 flex items-start gap-2 rounded-lg bg-burgundy/20 p-2 text-sm text-burgundy lg:p-4"
            >
              <svg
                class="h-5 w-5 flex-shrink-0 text-burgundy"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10A8 8 0 112 10a8 8 0 0116 0zM9 8a1 1 0 112 0v3a1 1 0 11-2 0V8zm1 6a1 1 0 100-2 1 1 0 000 2z"
                  clip-rule="evenodd"
                />
              </svg>
              <p class="b3">
                By registering for this event, you agree to receive event
                updates, announcements, and important information via your
                registered email.
              </p>
            </div>

            <button
              class="b3 mt-4 flex items-center gap-2 rounded-md bg-black px-4 py-1 text-white lg:rounded-lg"
              @click="regis"
            >
              One-click Register
              <div v-if="isLoadRegis" class="load h-3 w-3"></div>
            </button>
          </div>
        </div>

        <img
          :src="event?.image"
          class="hidden max-w-[120px] self-end rounded-lg lg:block lg:max-w-[150px]"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-map {
  @apply flex w-full justify-center;
}

.map-container iframe {
  @apply h-full w-full;
}
</style>
