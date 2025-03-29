<script setup lang="ts">
import BtnComp from '~/components/BtnComp.vue';
import Feedback from '~/components/icons/Feedback.vue';
import StarRound from '~/components/icons/StarRound.vue';
import type { Event } from '~/models/event';
import type { User } from '~/models/user';

definePageMeta({
  layout: 'backoffice',
});

const eventsData = ref<Event[]>([]);
const feedbackData = ref<Feedback[]>([]);
const filterFeedbackData = ref<Feedback[]>([]);
const isLoading = ref(true);
const activeStar = ref();
const activeEventId = ref();
const rating = ref([5, 4, 3, 2, 1]);
const adminData = ref<User | null>(null);
const previewFeedback = ref(false);
const closePreview = ref(false);
const feedbackResponse = ref();

interface Feedback {
  feedbackId: number;
  eventId: number;
  eventName: string;
  userId: number;
  feedbackRating: number;
  feedbackComment: string;
  createdAt: Date;
}
const feedbacks = ref([
  {
    rating: 5,
    comment:
      'ฉันเป็นสาวกของค่าย GHIBLI อยู่แล้วบอกได้คำเดียวว่า ห้ามพลาด เพราะ เราจะได้เห็นบางฉากในหนังแบบสมจริง! เรียกได้ว่าเหมือนหลุดออกไปในโลกของอนิเมะเลยก็ว่าได้',
  },
  {
    rating: 3,
    comment: 'ก็ดีแต่ดีได้อีก',
  },
  {
    rating: 3,
    comment: 'Birthday but with me',
  },
]);

const filterFeedback = ref([
  {
    rating: 5,
    comment:
      'ฉันเป็นสาวกของค่าย GHIBLI อยู่แล้วบอกได้คำเดียวว่า ห้ามพลาด เพราะ เราจะได้เห็นบางฉากในหนังแบบสมจริง! เรียกได้ว่าเหมือนหลุดออกไปในโลกของอนิเมะเลยก็ว่าได้',
  },
  {
    rating: 3,
    comment: 'ก็ดีแต่ดีได้อีก',
  },
  {
    rating: 3,
    comment: 'Birthday but with me',
  },
]);

const fetchData = async () => {
  const fetchedEventData = await useFetchData(
    `v1/events/owner/${adminData.value?.userId}`,
    'GET'
  );
  const fetchedFeedbackData = await useFetchData(
    `v1/feedbacks/owner/${adminData.value?.userId}`,
    'GET'
  );
  eventsData.value = fetchedEventData.data || [];
  feedbackData.value = fetchedFeedbackData.data || [];
  filterFeedbackData.value = fetchedFeedbackData.data || [];
};

// const filterRating = (star: number) => {

//   if (activeStar.value === star) {
//     // If the same star is clicked again, reset the filter
//     activeStar.value = null;
//     filterFeedbackData.value = feedbackData.value; // Reset to original feedbacks
//   } else {
//     // Apply the filter
//     activeStar.value = star;
//     const filter = feedbackData.value.filter((item) => item.feedbackRating === star);
//     filterFeedbackData.value = filter;
//   }
// };

// const filterEvent = (eventId: number) => {

//   if (activeEventId.value === eventId) {
//     // If the same star is clicked again, reset the filter
//     activeEventId.value = null;
//     filterFeedbackData.value = feedbackData.value; // Reset to original feedbacks
//   } else {
//     // Apply the filter
//     activeEventId.value = eventId;
//     const filter = feedbackData.value.filter((item) => item.eventId === eventId);
//     if(filter.length === 0){

//     }
//     filterFeedbackData.value = filter;
//   }
// };

const filterRating = (star: number) => {
  if (activeStar.value === star) {
    activeStar.value = null;
  } else {
    activeStar.value = star;
  }
  goToFilter();
};

const filterEvent = (eventId: number) => {
  if (activeEventId.value === eventId) {
    activeEventId.value = null;
  } else {
    activeEventId.value = eventId;
  }
  goToFilter();
};

const goToFilter = () => {
  if (activeEventId.value && activeStar.value) {
    filterFeedbackData.value = feedbackData.value
      .filter((item) => item.eventId === activeEventId.value)
      .filter((item) => item.feedbackRating === activeStar.value);
  } else if (activeEventId.value && !activeStar.value) {
    filterFeedbackData.value = feedbackData.value.filter(
      (item) => item.eventId === activeEventId.value
    );
  } else if (!activeEventId.value && activeStar.value) {
    filterFeedbackData.value = feedbackData.value.filter(
      (item) => item.feedbackRating === activeStar.value
    );
  } else if (!activeEventId.value && !activeStar.value) {
    filterFeedbackData.value = feedbackData.value;
  }
};

const goToResponse = async (feedbackId: number) => {
  const fetchedFeedbackData = await useFetchData(
    `v1/answers/feedback/${feedbackId}`
  );
  feedbackResponse.value = fetchedFeedbackData;
  previewFeedback.value = true;
};

onMounted(async () => {
  try {
    isLoading.value = true;
    const storedUser = localStorage.getItem('admin');
    adminData.value = storedUser ? JSON.parse(storedUser) : {};
    await fetchData();
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="ml-80 flex h-full w-screen bg-[#EEEEEE]">
    <div class="mx-20 mb-16 mt-32 w-full rounded-3xl bg-white drop-shadow-lg">
      <div class="p-12">
        <h1 class="t1 flex items-center">
          <Feedback class="mr-2" />Recent Feedback 1928<span class="b3"
            >feedback</span
          >
        </h1>
        <div class="mt-5 flex gap-3">
          <div v-for="event in eventsData">
            <div
              :class="
                event.eventId === activeEventId ? 'bg-burgundy text-white' : ''
              "
              @click="filterEvent(event.eventId)"
              class="flex cursor-pointer items-center gap-1 rounded-full border px-3 py-1 duration-200"
            >
              <p
                class="b2"
                :class="event.eventId === activeEventId ? 'text-white' : ''"
              >
                {{ event?.eventName }}
              </p>
            </div>
          </div>
        </div>
        <div class="mt-5 flex gap-3">
          <div v-for="star in rating" :key="star">
            <div
              class="b1 flex w-fit cursor-pointer items-center gap-1 rounded-full border px-3 py-1 duration-200"
              :class="star === activeStar ? 'bg-burgundy text-white' : ''"
              @click="filterRating(star)"
            >
              {{ star }}
              <StarRound :class="star === activeStar ? 'text-white' : ''" />
            </div>
          </div>
        </div>
        <div v-if="isLoading" class="my-16 flex items-center justify-center">
          <span class="loader"></span>
        </div>
        <div v-if="filterFeedbackData.length == 0">
          <p class="t3 mt-10">No feedback with this filter</p>
        </div>
        <div v-else v-for="item in filterFeedbackData">
          <div
            class="my-8 flex gap-5 rounded-xl border border-black/25 p-5 pb-6"
            @click="goToResponse(item.feedbackId)"
          >
            <div class="mt-4 flex items-start">
              <img
                src="/components/images/kornnaphat.png"
                class="h-12 w-12 rounded-full object-cover"
              />
            </div>
            <div class="mt-4 flex flex-col gap-y-2">
              <p class="b2 font-medium">
                Kornnaphat Sethratanapong <span class="mx-5">·</span>
                <span class="font-normal text-gray-600">{{
                  useFormatDateTime(item.createdAt, 'time')
                }}</span>
              </p>
              <p class="b2 w-fit text-dark-grey">{{ item.eventName }}</p>
              <NuxtRating
                :read-only="true"
                :rating-value="item.feedbackRating"
                :rating-size="20"
              />
              <p class="b2">{{ item.feedbackComment }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div
    :class="
      previewFeedback
        ? 'translate-y-0 opacity-100'
        : 'translate-y-full opacity-0'
    "
    class="fixed right-0 top-1/4 rounded-xl border bg-white px-20 py-3 shadow-xl duration-500"
  >
    <p class="t2 mb-5">Feedback Response</p>
    <div v-for="answer in feedbackResponse" class="my-3">
      <p class="b1">{{ answer.questionText }}</p>
      <p class="b1">{{ answer.answerText }}</p>
    </div>
  </div>
</template>

<style scoped></style>
