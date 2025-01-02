<script setup lang="ts">
import * as d3 from 'd3';
import BtnComp from '~/components/BtnComp.vue';
import Arrow from '~/components/icons/Arrow.vue';
import Calendar from '~/components/icons/Calendar.vue';
import Clock from '~/components/icons/Clock.vue';
import Feedback from '~/components/icons/Feedback.vue';
import Location from '~/components/icons/Location.vue';
import StarRound from '~/components/icons/StarRound.vue';
import type { Event } from '~/models/event';
import type { User } from '~/models/user';

definePageMeta({
  layout: 'backoffice',
});
const route = useRoute();
const param = route.params.id;
const eventData = ref();
const feedbackData = ref<Feedback[]>([]);
const questionData = ref<Question[]>([]);
const filterFeedbackData = ref<Feedback[]>([]);
const isLoading = ref(true);
const activeStar = ref();
const activeEventId = ref();
const rating = ref([5, 4, 3, 2, 1]);
const adminData = ref<User | null>(null);
const previewFeedback = ref(false);
const closePreview = ref(false);
const feedbackResponse = ref();
const averageRating = ref();
const conicGradientStyle = ref();
const groupedByAnswerText = ref();
interface Feedback {
  // count: number,
  // feedback: {
  feedbackId: number;
  eventId: number;
  userId: number;
  feedbackRating: number;
  feedbackComment: string;
  createdAt: Date;
  // }
}

interface Question {
  questionId: number;
  eventId: number;
  questionText: string;
  questionType: string;
}

const colors = {
  5: '#989898',
  4: '#D71515',
  3: '#cccccc',
  2: '#989898',
  1: '#D71515',
};

const answers = [
  'Great event, very informative!',
  'Loved the interactive sessions.',
  'Well-organized but could improve time management.',
  'Networking opportunities were excellent.',
  'More detailed explanations would be helpful.',
  'Fantastic speakers, very engaging.',
  'The schedule felt a bit rushed.',
  'Venue was convenient and comfortable.',
  'Would love more hands-on activities.',
  'Great opportunity to connect with peers.',
  'Some sessions ran over time.',
  'Enjoyed the diverse topics covered.',
  'Better food options would be nice.',
  'The Q&A sessions were insightful.',
  'Would appreciate more breaks in between sessions.',
  'Loved the energy of the hosts!',
  'The event met my expectations overall.',
  'Workshops were very practical and useful.',
  'Appreciated the clear communication before the event.',
  'Looking forward to the next one!',
];

const fetchData = async () => {
  const fetchedData = await useFetchData(`v1/events/backoffice/${param}`);
  const fetchedQuestionData = await useFetchData(`v1/questions/event/${param}`);
  const fetchedFeedbackData = await useFetchData(`v1/feedbacks/event/${param}`);
  const fetchedAnswerData = await useFetchData(`v2/feedbacks/event/${param}`);
  eventData.value = fetchedData || [];
  questionData.value = fetchedQuestionData || [];
  feedbackData.value = fetchedFeedbackData || [];
  filterFeedbackData.value = fetchedFeedbackData || [];

  // wait for fetchedAnswerData
  groupedByAnswerText.value = Object.fromEntries(
    d3.rollup(
      feedbackData.value,
      (v) => v.length,
      (d) => d.feedbackRating // answer rate in the question
    )
  );
};

function getAverage() {
  const total = feedbackData.value.reduce(
    (sum, curr) => sum + curr.feedbackRating,
    0
  );
  const avg = total / feedbackData.value.length;
  averageRating.value = Math.round(avg * 10) / 10;
}
const filterRating = (star: number) => {
  if (activeStar.value === star) {
    activeStar.value = null;
    filterFeedbackData.value = feedbackData.value;
  } else {
    activeStar.value = star;
    filterFeedbackData.value = feedbackData.value.filter(
      (item) => item.feedbackRating === activeStar.value
    );
  }
};

onMounted(async () => {
  try {
    isLoading.value = true;
    const storedUser = localStorage.getItem('admin');
    adminData.value = storedUser ? JSON.parse(storedUser) : {};
    await fetchData();
    await getAverage();
    conicGradientStyle.value = `conic-gradient(${generateConicGradient(groupedByAnswerText.value, colors)})`;
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="ml-80 flex h-full w-screen bg-ghost-white">
    <div
      v-if="isLoading"
      class="my-16 flex h-screen w-full items-center justify-center"
    >
      <span class="loader"></span>
    </div>
    <div v-else class="mx-20 my-24 flex w-full flex-col gap-3">
      <NuxtLink
        to="/backoffice/feedback"
        class="mb-1 flex items-center gap-2 text-dark-grey duration-200 hover:-ml-3"
      >
        <Arrow />
        <p class="b2">Back to feedback list</p>
      </NuxtLink>
      <div class="w-full rounded-3xl bg-white p-10 drop-shadow-lg">
        <div class="flex items-center gap-5">
          <img
            :src="eventData?.image"
            alt=""
            class="h-[180px] rounded-lg object-cover"
          />
          <div class="flex w-fit flex-col justify-center gap-2">
            <div class="tag-group b4 flex gap-2">
              <button
                v-for="tag in eventData?.tags"
                class="bg-zin-200 rounded-md border border-dark-grey/60 px-3"
              >
                {{ tag }}
              </button>
            </div>
            <NuxtLink
              v-if="eventData?.slug"
              :to="{ name: 'event-id', params: { id: eventData?.slug } }"
            >
              <button
                class="dash-event-name flex items-center justify-start gap-1 text-3xl font-semibold duration-300 hover:underline"
              >
                {{ eventData?.name }}
                <Arrow class="t3 rotate-180" />
              </button>
            </NuxtLink>
            <div class="dash-event-date b2 flex items-center gap-2">
              <Calendar />
              <p v-if="eventData?.start_date && eventData?.end_date">
                {{ useFormatDateTime(eventData?.start_date, 'date') }} -
                {{ useFormatDateTime(eventData?.end_date, 'date') }}
              </p>
            </div>
            <div class="dash-event-time b2 flex items-center gap-2">
              <Clock />
              <p v-if="eventData?.start_date && eventData?.end_date">
                {{ useFormatDateTime(eventData?.start_date, 'time') }} -
                {{ useFormatDateTime(eventData?.end_date, 'time') }}
              </p>
            </div>
            <div class="dash-event-location b2 flex items-center gap-2">
              <Location />
              <p>{{ eventData?.location }}</p>
            </div>
          </div>
        </div>
      </div>
      <div
        class="grid w-full grid-cols-6 gap-5 rounded-3xl bg-white p-10 drop-shadow-lg"
      >
        <div class="col-span-2 place-items-center content-center">
          <p class="t3 mb-5">Average Rating</p>
          <p class="t1">{{ averageRating }} <span class="b1">out of 5</span></p>
          <p class="b2">{{ feedbackData.length }} ratings</p>
          <NuxtRating :rating-value="averageRating" rating-size="20" />
        </div>
        <!-- <div class="col-span-1">
          <div class="flex">
            <NuxtRating :rating-value="5" />
            <div class="bg-lavender-gray  h-3">
              <div class="bg-burgundy w-10 h-3"></div>
            </div>
          </div>
          <NuxtRating :rating-value="4" />
          <NuxtRating :rating-value="3" />
          <NuxtRating :rating-value="2" />
          <NuxtRating :rating-value="1" />
        </div> -->
        <div class="col-span-4 h-96 overflow-auto">
          <div class="flex gap-3">
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
          <div v-if="filterFeedbackData.length == 0">
            <p class="t3 mt-10">There's no review with that rating</p>
          </div>
          <div v-else v-for="item in filterFeedbackData">
            <div class="my-2 flex gap-5 rounded-xl border p-5 pb-6">
              <!-- <div class="flex items-start mt-4">
              <img src="/components/images/kornnaphat.png" class="w-12 h-12 object-cover rounded-full" />
            </div> -->
              <div class="flex flex-col gap-y-2">
                <p class="b2 font-medium">
                  Kornnaphat Sethratanapong<span class="mx-5">·</span>
                  <span class="font-normal text-gray-600">{{
                    useFormatDateTime(item.createdAt, 'time')
                  }}</span>
                </p>
                <NuxtRating
                  :read-only="true"
                  :rating-value="item.feedbackRating"
                  :rating-size="20"
                />
                <p class="b3">{{ item.feedbackComment }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-for="(question, index) in questionData"
        class="w-full rounded-3xl bg-white p-10 drop-shadow-lg"
      >
        <p class="b1 mb-3">{{ index + 1 }}. {{ question.questionText }}</p>
        <p class="b2 mb-2">{{ answers.length }} responses</p>
        <div class="h-72 overflow-auto">
          <div
            v-if="question.questionType === 'text'"
            v-for="answer in answers"
          >
            <div class="my-2 rounded-xl border px-4 py-2">
              <p class="b2">{{ answer }}</p>
            </div>
          </div>
          <div v-else-if="question.questionType === 'rating'" class="flex">
            <div class="w-80 pt-5">
              <div
                class="relative flex h-full w-full items-center justify-center"
              >
                <div
                  class="aspect-square w-3/4 rounded-full drop-shadow-lg"
                  :style="{ background: conicGradientStyle }"
                ></div>
                <div
                  class="absolute left-1/2 top-1/2 aspect-square w-2/4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white drop-shadow-sm"
                ></div>
              </div>
            </div>

            <div class="flex items-center">
              <ul class="" v-if="groupedByAnswerText">
                <li
                  v-for="(data, index) in Object.keys(
                    groupedByAnswerText
                  ).sort()"
                  :key="index"
                  class="b2 flex items-center gap-2"
                >
                  <span
                    v-if="colors"
                    :style="{ backgroundColor: colors[data] }"
                    class="h-3 w-3 rounded-full drop-shadow-sm"
                  ></span>
                  {{ data }}
                  <StarRound />
                  [{{ groupedByAnswerText[data] }}]
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
