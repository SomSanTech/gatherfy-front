<script setup lang="ts">
import * as d3 from 'd3';
import Arrow from '~/components/icons/Arrow.vue';
import Calendar from '~/components/icons/Calendar.vue';
import Clock from '~/components/icons/Clock.vue';
import Location from '~/components/icons/Location.vue';
import StarRound from '~/components/icons/StarRound.vue';
import type { Answer, ExistingQuestion, Feedback } from '~/models/feedback';
import type { User } from '~/models/user';

definePageMeta({
  layout: 'backoffice',
});
const route = useRoute();
const param = route.params.id;
const eventData = ref();
const feedbackData = ref<Feedback[]>([]);
const questionData = ref<ExistingQuestion[]>([]);
const filterFeedbackData = ref<Feedback[]>([]);
const answerData = ref<GroupedAnswers>({});
const isLoading = ref(true);
const activeStar = ref();
const rating = ref([5, 4, 3, 2, 1]);
const adminData = ref<User | null>(null);
const averageRating = ref();
const nuxtRating = ref();
const conicGradientStyle = ref();
const groupedByAnswerText = ref<Record<string, number>>({});

export interface GroupedAnswers {
  [key: string]: Answer[];
}

const colors: Record<string, string> = {
  5: '#a0c15a',
  4: '#add633',
  3: '#ffd934',
  2: '#ffb234',
  1: '#ff8c5a',
};

async function fetchData() {
  const fetchedData = await useFetchData(`v1/events/backoffice/${param}`);
  const fetchedQuestionData = await useFetchData(`v1/questions/event/${param}`);
  const fetchedFeedbackData = await useFetchWithAuth(
    `v1/feedbacks/event/${param}`,
    'GET',
    token.value
  );
  eventData.value = fetchedData || [];
  questionData.value = fetchedQuestionData || [];
  feedbackData.value = fetchedFeedbackData || [];
  filterFeedbackData.value = fetchedFeedbackData || [];

  for (const question of questionData.value) {
    await getAnswerByQuestion(question.questionId);
  }
}
function getAverage() {
  const total = feedbackData.value.reduce(
    (sum, curr) => sum + curr.feedbackRating,
    0
  );
  const avg = total / feedbackData.value.length;
  nuxtRating.value = Math.round(avg * 10) / 10;
  averageRating.value =
    total === 0 ? 0 : (Math.round(avg * 10) / 10).toFixed(1);
}
function getRatingAnswer(questionKey: number) {
  groupedByAnswerText.value = Object.fromEntries(
    d3.rollup(
      answerData.value[questionKey],
      (v) => v.length,
      (d) => d.answerText // answer rate in the question
    )
  );
  // Update the specific key in the conicGradientStyle ref object
  conicGradientStyle.value = {
    [questionKey]: `conic-gradient(${generateConicGradient(groupedByAnswerText.value, colors)})`,
  };
}
function filterRating(star: number) {
  if (activeStar.value === star) {
    activeStar.value = null;
    filterFeedbackData.value = feedbackData.value;
  } else {
    activeStar.value = star;
    filterFeedbackData.value = feedbackData.value.filter(
      (item) => item.feedbackRating === activeStar.value
    );
  }
}

const token = useCookie('accessToken');

async function getAnswerByQuestion(questionId: number) {
  const fetchedAnswerData = await useFetchWithAuth(
    `v2/answers/question/${questionId}`,
    'GET',
    token.value
  );
  // Initialize an object to store grouped answers
  const groupedAnswers: { [key: string]: Answer[] } = {};
  if (Array.isArray(fetchedAnswerData)) {
    fetchedAnswerData.forEach((answer) => {
      // Create a custom key based on the questionId
      const questionKey = `${answer.questionId}`;

      // Initialize the array if it doesn't exist
      if (!groupedAnswers[questionKey]) {
        groupedAnswers[questionKey] = [];
      }
      // Add the answer to the corresponding array
      groupedAnswers[questionKey].push(answer);
    });
  }
  answerData.value = { ...answerData.value, ...groupedAnswers };
}

onMounted(async () => {
  try {
    isLoading.value = true;
    const storedUser = localStorage.getItem('admin');
    adminData.value = storedUser ? JSON.parse(storedUser) : {};
    await fetchData();
    await getAverage();
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
                class="dash-event-name t3 flex items-center justify-start gap-1 text-3xl font-semibold duration-300 hover:underline"
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
        v-if="averageRating"
        class="grid w-full grid-cols-6 gap-5 rounded-3xl bg-white p-10 drop-shadow-lg"
      >
        <div class="col-span-2 place-items-center content-center">
          <p class="t3 mb-5">Average Rating</p>
          <p class="t1">{{ averageRating }}</p>
          <p class="b1">out of 5</p>
          <NuxtRating :rating-value="nuxtRating" rating-size="20" />
          <p class="b2 mt-2 opacity-70">
            Based on {{ feedbackData.length }} ratings
          </p>
        </div>
        <div class="col-span-4">
          <div class="mb-3 flex gap-3">
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
          <div class="h-96 overflow-auto">
            <div v-if="filterFeedbackData.length == 0">
              <p class="t3 mt-10">There's no review with that rating</p>
            </div>
            <div v-else v-for="item in filterFeedbackData">
              <div class="my-2 flex gap-5 rounded-xl border p-5 pb-6">
                <div class="mt-4 flex items-start">
                  <img
                    src="/components/images/kornnaphat.png"
                    class="h-12 w-12 rounded-full object-cover"
                  />
                </div>
                <div class="flex flex-col gap-y-2">
                  <p class="b2 font-medium">
                    {{ item.username }}<span class="mx-5">·</span>
                    <span class="font-normal text-gray-600">{{
                      useFormatDateTime(item.createdAt, 'date')
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
      </div>
      <div
        v-else
        class="flex h-96 flex-col justify-center rounded-3xl bg-white p-10 text-center drop-shadow-lg"
      >
        <img
          src="/components/images/catch-feedback.png"
          class="h-64 object-contain"
        />
        <p class="b1 mb-3 font-normal">Awaiting feedback</p>
        <p class="b2">Once guests respond, you will see their feedback here.</p>
      </div>
      <div
        v-for="(question, index) in questionData"
        class="w-full rounded-3xl bg-white p-10 drop-shadow-lg"
      >
        <p class="b1 mb-3">{{ index + 1 }}. {{ question.questionText }}</p>
        <div v-if="answerData[question.questionId]">
          <p class="b2 mb-2">
            {{ answerData[question.questionId]?.length }} responses
          </p>
          <div class="h-72 overflow-auto">
            <div
              v-if="question.questionType === 'text'"
              v-for="answer in answerData[question.questionId]"
            >
              <div class="my-2 rounded-xl border px-4 py-2">
                <p class="b2">{{ answer.answerText }}</p>
              </div>
            </div>
            <div v-else-if="question.questionType === 'rating'" class="flex">
              {{ getRatingAnswer(question.questionId) }}
              <div class="w-80 pt-5">
                <div
                  class="relative flex h-full w-full items-center justify-center"
                >
                  <div
                    class="aspect-square w-3/4 rounded-full drop-shadow-lg"
                    :style="{
                      background: conicGradientStyle[question.questionId],
                    }"
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
        <div v-else class="flex flex-col justify-center text-center">
          <img
            src="/components/images/catch-feedback.png"
            class="h-64 object-contain"
          />
          <p class="b1 mb-3 font-normal">Awaiting feedback</p>
          <p class="b2">
            Once guests respond, you will see their feedback here.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
