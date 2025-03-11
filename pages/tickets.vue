<script setup lang="ts">
import QrcodeVue from 'qrcode.vue';
import type {
  AnswerBody,
  DefaultQuestion,
  ExistingQuestion,
  FeedbackBody,
} from '~/models/feedback';

definePageMeta({
  layout: 'profile',
});
const tickets = ref();
const accessToken = useCookie('accessToken');
const profileData = useCookie('profileData');
const qrValues = ref<{ [key: string]: string }>({});

const previewFeedback = ref(false);
const finalQuestion = ref<(ExistingQuestion | DefaultQuestion)[]>([]);
const defaultQuestion: DefaultQuestion[] = [
  {
    questionText: 'How satisfied are you after joining the event ?',
    questionType: 'rating',
    questionTypeName: 'Rating (1-5)',
  },
  { questionText: 'Comment', questionType: 'text', questionTypeName: 'Text' },
];
const feedbackQuestion = ref<ExistingQuestion[]>([]);
const answers = ref<(AnswerBody | FeedbackBody)[]>([]);
const userAnswerFeedbackHistory = ref([]);
const getTokenForQR = async (eventId: string) => {
  const token = await useFetchWithAuth(
    `v1/check-in/${eventId}`,
    'POST',
    accessToken.value
  );
  return token.data?.qrToken;
};
const isStartCountDown = ref(false);
const generateQRCode = async (eventId: string) => {
  const tokenResponse = await getTokenForQR(eventId);

  if (tokenResponse) {
    qrValues.value[eventId] = `${tokenResponse}`;
  }
  isStartCountDown.value = true;
  startCountdown();
};
const isZoomed = ref(false);
const feedBackErrorResponse = ref();
function closePreview() {
  previewFeedback.value = false;
  document.body.style.overflow = '';
  feedBackErrorResponse.value = '';
}
function addAnswerField(questionId: number, eventId: number) {
  answers.value.push({
    feedbackId: 0,
    questionId: questionId,
    eventId: eventId,
    answerText: '',
  });
}
function addFeedbackField(eventId: number, userId: number) {
  answers.value.push({
    eventId: eventId,
    userId: userId,
    feedbackRating: 0,
    feedbackComment: '',
  });
}
const onReviewFeedback = async (eventId: string) => {
  const fetchedQuestionData = await useFetchData(
    `v1/questions/event/${eventId}`,
    'GET'
  );
  if (fetchedQuestionData.length === 0) {
    finalQuestion.value = [...defaultQuestion];
    feedbackQuestion.value = [];
    previewFeedback.value = true;
  } else {
    feedbackQuestion.value = fetchedQuestionData.data;
    finalQuestion.value = [...feedbackQuestion.value, ...defaultQuestion];
    previewFeedback.value = true;
  }
  document.body.style.overflow = 'hidden';
  for (const item of feedbackQuestion.value) {
    addAnswerField(item.questionId, parseInt(eventId));
  }
  for (const item of defaultQuestion) {
    addFeedbackField(parseInt(eventId), profileData.value?.users_id);
  }
};

async function submitFeedback() {
  const feedbackResponse = await useFetchWithAuth(
    `v2/feedbacks`,
    'POST',
    accessToken.value,
    answers.value[answers.value.length - 1]
  );
  console.log(feedbackResponse);
  if (feedbackResponse.status === 200) {
    const feedbackId = feedbackResponse.data.feedbackId; // Assuming `feedbackId` is in the response
    for (let i = 0; i < feedbackQuestion.value.length; i++) {
      (answers.value[i] as AnswerBody).feedbackId = await feedbackId;
      await useFetchWithAuth(
        `v2/answers`,
        'POST',
        accessToken.value,
        answers.value[i]
      );
    }
    const feedbacked = await useFetchWithAuth(
      'v1/feedbacked',
      'GET',
      accessToken.value
    );
    if ('data' in feedbacked) {
      userAnswerFeedbackHistory.value = feedbacked.data;
    }
    previewFeedback.value = false;
  } else {
    feedBackErrorResponse.value = 'Please answer all question';
    // isChangeStatusComplete.value = false;
  }
}

const checkIsAlreadyReview = (eventId: number) => {
  let compareResult = false;
  if (accessToken.value) {
    compareResult = userAnswerFeedbackHistory.value.eventId.includes(eventId);
  }
  return compareResult;
};

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

const countdown = ref(600);
const isResendDisabled = ref(false);
let countdownInterval: number | null = null;
const startCountdown = () => {
  isResendDisabled.value = false;
  countdown.value = 600; // รีเซ็ตกลับไป 10 นาที

  countdownInterval = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(countdownInterval as number);
      qrValues.value = {};
      isResendDisabled.value = true;
    }
  }, 1000);
};
const selectedEventTime = ref('today');
const handleSelectTime = (time: string) => {
  selectedEventTime.value = time;
};
const filteredTicketData = ref();
const filterTimeEventData = (time: string) => {
  let filter;
  if (time === 'today') {
    filter = tickets.value.filter((e) => {
      const start = new Date(e?.start_date)?.getTime();
      const today = new Date().getTime();
      const end = new Date(e?.end_date)?.getTime();
      return start <= today && end >= today;
    });
  } else if (time === 'upcome') {
    filter = tickets.value.filter((e) => {
      return new Date(e?.start_date)?.getTime() > new Date().getTime();
    });
  } else if (time === 'past') {
    filter = tickets.value.filter((e) => {
      const today = new Date().getTime();
      const end = new Date(e?.end_date)?.getTime();
      return today > end;
    });
  }

  filteredTicketData.value = filter;
  console.log(time);

  console.log('filteredTicketData.value', filteredTicketData.value);
};

onMounted(async () => {
  const response = await useFetchWithAuth(
    'v1/tickets',
    'GET',
    accessToken.value
  );
  tickets.value = response.data;
  const feedbacked = await useFetchWithAuth(
    'v1/feedbacked',
    'GET',
    accessToken.value
  );
  if ('data' in feedbacked) {
    userAnswerFeedbackHistory.value = feedbacked.data;
  }

  filterTimeEventData(selectedEventTime.value);
});

watch(selectedEventTime, (newValue) => {
  if (newValue) {
    selectedEventTime.value = newValue;
    filterTimeEventData(newValue);
  }
});
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
function formatTimeRange(start, end) {
  const startTime = new Date(start).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const endTime = new Date(end).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${startTime} - ${endTime}`;
}
</script>

<template>
  <div class="flex w-full gap-9">
    <div class="w-full">
      <p class="t3 pb-2">My Ticket</p>
      <ExploreBar
        :is-show-sort="false"
        @handle-select-time="handleSelectTime"
        :selectedEventTime
        :isShowPastEventBtn="true"
      />
      <div
        class="w-full pt-14 text-center"
        v-if="filteredTicketData?.length === 0"
      >
        <p class="no-card-message b2 py-32">No Tickets</p>
      </div>
      <div v-else>
        <div
          v-for="(ticket, index) in filteredTicketData"
          :class="[
            'relative mt-4 overflow-hidden drop-shadow-lg',
            index % 3 === 0
              ? 'bg-[#C33D32]'
              : index % 3 === 1
                ? 'bg-[#fff6f6] text-[#C33D32]'
                : 'bg-[#e7e8eb]',
          ]"
        >
          <div
            class="relative z-10 flex h-full flex-col p-4 backdrop-blur-xl lg:flex-row"
          >
            <div
              class="shrink-0 border-b-[1px] border-r-0 border-dashed border-black pr-4 lg:border-b-0 lg:border-r-[1px]"
            >
              <img
                :src="ticket.image"
                class="aspect-square w-[120px] object-cover lg:w-[260px]"
                alt=""
              />
              <p class="b3 w-full pb-2 pt-2 lg:pb-0">Powered by Gatherfy</p>
            </div>
            <div class="w-full">
              <div
                class="flex h-full w-full flex-col justify-between rounded-[5px] pt-5 lg:pl-5 lg:pt-0"
              >
                <div class="pb-5">
                  <h1 class="t2">{{ ticket.name }}</h1>
                  <p class="b2 pl-1 pt-2 text-black/70">
                    Hosted by:
                    <span class="font-semibold">{{ ticket.owner }}</span>
                  </p>
                  <!-- <div class="b3 mt-2 flex items-center gap-2">
                    <p
                      v-for="tag in ticket.tags"
                      class=" text-[11px] rounded-md  border-black/40 border-[1px] px-2 py-1"
                    >
                      {{ tag }}
                    </p>
                  </div> -->
                </div>
                <div class="flex items-end justify-between">
                  <div>
                    <p class="b2 font-semibold">{{ ticket.location }}</p>

                    <div class="mt-4">
                      <p class="b2 font-semibold">
                        {{ formatDate(ticket.start_date) }} -
                        {{ formatDate(ticket.end_date) }}
                      </p>
                      <p class="b2">
                        {{
                          formatTimeRange(ticket.start_date, ticket.end_date)
                        }}
                      </p>
                    </div>
                  </div>
                  <div class="w- flex flex-col items-end gap-3 self-end">
                    <div
                      class="w-full"
                      v-if="
                        new Date().getTime() >
                        new Date(ticket.end_date).getTime()
                      "
                    >
                      <button
                        @click="onReviewFeedback(ticket.eventId)"
                        :class="
                          checkIsAlreadyReview(ticket.eventId)
                            ? 'pointer-events-none opacity-55'
                            : ''
                        "
                        class="b3 w-full rounded-md bg-white px-2 py-1 drop-shadow-sm"
                      >
                        {{
                          checkIsAlreadyReview(ticket.eventId)
                            ? 'Reviewed'
                            : 'Review event'
                        }}
                      </button>
                    </div>
                    <div>
                      <p
                        v-if="qrValues[ticket.eventId]"
                        class="b3 w-full text-center"
                      >
                        {{ formatTime(countdown) }}
                      </p>
                      <div
                        v-if="
                          new Date().getTime() <
                          new Date(ticket.end_date).getTime()
                        "
                        class="b3 relative flex aspect-square w-[120px] items-center justify-center text-center"
                      >
                        <div
                          v-if="!qrValues[ticket.eventId]"
                          class="relative h-full w-full border-[1px] border-dashed border-black/50 bg-white"
                        >
                          <button
                            @click="generateQRCode(ticket.eventId)"
                            class="absolute left-1/2 top-1/2 z-40 h-fit w-max -translate-x-1/2 -translate-y-1/2 rounded-md bg-burgundy px-3 py-1 text-[12px] text-light-grey drop-shadow-sm"
                          >
                            <p v-if="!isResendDisabled">
                              Click to view <br />
                              QR Code
                            </p>
                            <p v-else>
                              Renew<br />
                              QR Code
                            </p>
                          </button>

                          <img
                            src="../components/images/qrcode.svg"
                            alt=""
                            class="blur-sm"
                          />
                        </div>

                        <div
                          @click="isZoomed = !isZoomed"
                          v-if="qrValues[ticket.eventId] && !isResendDisabled"
                          class="rounded-g cursor-pointer bg-white p-2 transition-transform duration-300 ease-in-out"
                          :class="{
                            'fixed inset-0 z-50 flex items-center justify-center bg-black/50':
                              isZoomed,
                            '': !isZoomed,
                            'scale-105': isZoomed,
                          }"
                        >
                          <qrcode-vue
                            :value="qrValues[ticket.eventId]"
                            :size="isZoomed ? 300 : 100"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <FeedbackForm
      v-if="previewFeedback"
      :feedBackErrorResponse="feedBackErrorResponse"
      :questions="finalQuestion"
      :preview-feedback="previewFeedback"
      :close-preview="closePreview"
      :answer-field="answers"
      :submit-feedback="submitFeedback"
      :existing-question-count="feedbackQuestion.length"
    />
  </div>
</template>

<style scoped></style>
