<script setup lang="ts">
import Calendar from '~/components/icons/Calendar.vue';
import Location from '~/components/icons/Location.vue';
import Clock from '~/components/icons/Clock.vue';
import Cancle from '~/components/icons/Cancle.vue';
import UserProfileIcon from '~/components/icons/UserProfile.vue';
import Organisation from '~/components/icons/Organisation.vue';
import Subscribe from '~/components/icons/Subscribe.vue';
import type { UserProfile } from '~/models/userProfile';

const route = useRoute();
const error = useError();
const param = route.params.id;
const isOpenPopup = ref(false);
const event = ref();
const isLoading: Ref<boolean> = ref(true);
const plsLoginPopUp = ref(false);
const userProfile = useCookie<UserProfile>('profileData');
const loginPopup = useState('loginPopup');
const isSignInCookie = useCookie('is_user_sign_in');
const token = useCookie('accessToken');
const checkIsAlreadyRegis = ref(false);
const userSubscribeTagData = ref([]);
const isHavePopupOpen = useState('isHavePopupOpen');
const handleGoSignIn = () => {
  loginPopup.value = true;
  isHavePopupOpen.value = true;
  plsLoginPopUp.value = false;
};
const userRegisHistory = useState('userRegisHistory');

const regis = async () => {
  if (event.value) {
    const regsitered = await useFetchWithAuth(
      `v2/registrations`,
      'POST',
      token.value,
      {
        eventId: event.value.eventId,
      }
    );

    if (regsitered.status === 200) {
      const regisData = await useFetchWithAuth(
        'v1/tickets',
        'GET',
        accessToken.value
      );

      userRegisHistory.value = regisData.data;
      isShowSuccessRegisPopup.value = true;
    }
    if (regsitered.error) {
      alert('Already Registered for the Event');
    }
    isOpenPopup.value = false;
  }
};

const fetchData = async () => {
  const fetchedData = await useFetchData(`v1/events/${param}`, 'GET');
  if (fetchedData.error) {
    error.value = fetchData;
  } else {
    event.value = (await fetchedData.data) || [];
  }
};
const isShowSuccessRegisPopup = ref(false);
const handleRegisPopup = (isEventAvaliable: boolean, ticketEndDate: string) => {
  const isEndSaleTicket =
    new Date(ticketEndDate).getTime() < new Date().getTime();

  if (userProfile.value && !isEventAvaliable) {
    isOpenPopup.value = true;
  } else {
    plsLoginPopUp.value = true;
  }
};
const accessToken = useCookie('accessToken');

const checkIsAlreadySubTag = (tagId: number) => {
  let compareResult = false;
  if (accessToken.value) {
    compareResult = userSubscribeTagData.value.tagId.includes(tagId);
  }
  return compareResult;
};
const subAction = ref('');
const isShowSubTagPopup = ref(false);
const handleSubscribeTag = async (tagId: number) => {
  if (!userProfile.value) {
    alert('Please login first');
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
      }

      if (response.error) {
        alert('u follow this tag leaw na');
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
      }

      if (response.error) {
        alert('cant log try again later na');
      }
    }
  }
};
onMounted(async () => {
  try {
    isLoading.value = true;

    await fetchData();
    if (event.value) {
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
        console.error('Fetch failed:', subscribeTagData.error);
      }
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
</script>
<template>
  <div class="relative w-full lg:my-24">
    <div v-if="isLoading" class="my-52 flex items-center justify-center">
      <span class="loader"></span>
    </div>
    <div v-else class="mx-auto my-16 w-full lg:my-20">
      <!-- header -->
      <div
        :style="{ backgroundImage: `url(${event?.image})` }"
        class="w-screen bg-opacity-75 bg-cover bg-center backdrop-blur-md"
      >
        <div
          class="relative z-10 bg-black bg-opacity-30 p-10 backdrop-blur-md lg:py-32"
        >
          <div
            class="mx-auto flex w-full max-w-4xl flex-col items-center gap-12 text-white lg:flex-row"
          >
            <div
              class="h-[330px] w-[220px] bg-zinc-200 lg:h-[500px] lg:w-[350px]"
            >
              <img
                :src="event?.image"
                alt=""
                class="detail-img h-full w-full object-cover"
              />
            </div>
            <div class="flex w-fit flex-col justify-center gap-3">
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
                  {{ useFormatDateTime(event?.start_date, 'date') }} -
                  {{ useFormatDateTime(event?.end_date, 'date') }}
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
                    checkIsAlreadyRegis
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
                  :text="
                    checkIsAlreadyRegis
                      ? 'You’re already registered for this event'
                      : new Date(event?.ticket_start_date).getTime() >
                          new Date().getTime()
                        ? 'Comming soon'
                        : new Date(event?.ticket_end_date).getTime() <
                            new Date().getTime()
                          ? 'Sale close'
                          : 'Registor event'
                  "
                />
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
            <div v-html="event?.map" class="detail-map"></div>
          </div>
          <div class="flex flex-col gap-2 lg:gap-5">
            <p class="t3 font-semibold">Tags</p>
            <div class="tag-group flex gap-2">
              <div
                v-for="tag in event?.tags"
                class="flex h-full items-center justify-center"
              >
                <NuxtLink
                  :to="{ name: 'events', query: { tag: tag.tag_title } }"
                >
                  <button
                    class="b3 flex w-fit items-center gap-1 rounded-l-lg border border-dark-grey/60 px-10 py-2 text-center drop-shadow-md duration-300 hover:bg-grey"
                  >
                    {{ tag.tag_title }}
                  </button>
                </NuxtLink>
                <div
                  class="flex h-full w-full items-center justify-center rounded-r-lg border-y border-r border-dark-grey/60 px-2 duration-300 hover:bg-burgundy hover:text-light-grey"
                >
                  <button @click="handleSubscribeTag(tag.tag_id)" class=" ">
                    <Check
                      v-if="checkIsAlreadySubTag(tag.tag_id)"
                      class="text-3xl"
                    />
                    <Subscribe v-else class="text-xl" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- pop up -->
    <BasicPopup
      :showPopup="plsLoginPopUp"
      text="Please Sign in before Registor event"
      btn-text="Go Sign in"
      @handleBasicPopAction="handleGoSignIn"
    />
    <BasicPopup
      :showPopup="isShowSubTagPopup"
      :text="
        subAction === 'follow'
          ? 'Thank you for subscribing to this event tag! Stay tuned for updates and announcements'
          : 'You have successfully unsubscribed from this event tag'
      "
      btn-text="Continue"
      @handleBasicPopAction="isShowSubTagPopup = false"
    />
    <BasicPopup
      :showPopup="isShowSuccessRegisPopup"
      text="Thank you for registration"
      btn-text="Continue"
      @handleBasicPopAction="isShowSuccessRegisPopup = false"
    />
    <div
      v-show="isOpenPopup"
      class="regis-popup fixed right-1/2 top-1/2 z-50 -translate-y-1/2 translate-x-1/2 overflow-y-auto rounded-lg bg-white p-3 shadow-2xl lg:w-[600px] lg:p-7"
    >
      <button
        @click="isOpenPopup = false"
        class="close-popup absolute right-0 top-0 p-3"
      >
        <Cancle />
      </button>
      <div class="flex justify-between gap-3 lg:gap-5">
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
              <UserProfileIcon class="b1" />
              <p class="regis-user b2">
                <span class="mr-3 font-semibold">{{
                  userProfile?.username
                }}</span
                >{{ userProfile?.users_email }}
              </p>
            </div>
            <div
              class="mt-4 flex items-start gap-2 rounded-lg bg-burgundy/20 p-4 text-sm text-burgundy"
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
              <p>
                By registering for this event, you agree to receive event
                updates, announcements, and important information via your
                registered email.
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
          class="max-w-[120px] self-end rounded-lg lg:max-w-[150px]"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-map iframe {
  width: 100px;
}
</style>
