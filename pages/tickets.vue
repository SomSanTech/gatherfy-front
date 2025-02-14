<script setup lang="ts">
import QrcodeVue from 'qrcode.vue';
import type {
  AnswerBody,
  DefaultQuestion,
  ExistingQuestion,
  FeedbackBody,
} from '~/models/feedback';

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

const getTokenForQR = async (eventId: string) => {
  const token = await useFetchWithAuth(
    `v1/check-in/${eventId}`,
    'POST',
    accessToken.value
  );
  return token.data?.qrToken;
};

const generateQRCode = async (eventId: string) => {
  const tokenResponse = await getTokenForQR(eventId);

  if (tokenResponse) {
    qrValues.value[eventId] = `${tokenResponse}`;
  }
};
function closePreview() {
  previewFeedback.value = false;
  document.body.style.overflow = '';
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
    `v1/questions/event/${eventId}`
  );
  if (fetchedQuestionData.length === 0) {
    finalQuestion.value = [...defaultQuestion];
    feedbackQuestion.value = [];
    previewFeedback.value = true;
  } else {
    feedbackQuestion.value = fetchedQuestionData;
    finalQuestion.value = [...feedbackQuestion.value, ...defaultQuestion];
    previewFeedback.value = true;
  }
  document.body.style.overflow = 'hidden';
  console.log(feedbackQuestion.value);
  for (const item of feedbackQuestion.value) {
    addAnswerField(item.questionId, parseInt(eventId));
  }
  for (const item of defaultQuestion) {
    addFeedbackField(parseInt(eventId), profileData.value?.users_id);
  }
  console.log(answers.value);
};
async function submitFeedback() {
  const feedbackResponse = await useFetchWithAuth(
    `v2/feedbacks`,
    'POST',
    accessToken.value,
    answers.value[answers.value.length - 1]
  );
  console.log(feedbackResponse);
  if (feedbackResponse) {
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
  } else {
    // isChangeStatusComplete.value = false;
  }
  previewFeedback.value = false;
}
onMounted(async () => {
  const response = await useFetchWithAuth(
    'v1/tickets',
    'GET',
    accessToken.value
  );
  tickets.value = response.data;
  console.log(tickets.value);
  console.log('test', accessToken.value);
});
</script>

<template>
  <div class="mx-auto my-28 flex w-screen max-w-6xl gap-9">
    <div class="bg- w-[280px] rounded-xl border border-black/70"></div>
    <div class="w-full">
      <p class="t3">My Ticket</p>
      <div
        class="flex w-full items-center justify-between rounded-xl border border-black-1 p-1 lg:p-2 lg:pr-4"
      >
        <div
          :class="`flex gap-2 ${isShowSort ? 'pointer-events-none opacity-0' : ''}`"
        >
          <button
            @click="selectTime('today')"
            :class="`btn b3 rounded-md px-2 py-2 lg:px-4 ${selectedEventTime === 'today' ? selectedEventTimeStyle?.active : 'duration-200 hover:bg-zinc-200'}`"
          >
            Upcoming events
          </button>
          <button
            @click="selectTime('upcome')"
            :class="`btn b3 rounded-md px-2 py-2 lg:px-4 ${selectedEventTime === 'upcome' ? selectedEventTimeStyle?.active : 'duration-200 hover:bg-zinc-200'}`"
          >
            Past events
          </button>
        </div>
      </div>
      <div>
        <div
          v-for="ticket in tickets"
          class="relative mt-4 overflow-hidden bg-[#d13732]"
        >
          <div class="relative z-10 flex h-full p-4 backdrop-blur-xl">
            <div
              class="aspect-square w-[260px] shrink-0 border-r-[1px] border-dashed border-black pr-4"
            >
              <img
                :src="ticket.image"
                class="aspect-square object-cover"
                alt=""
              />
              <p class="b3 pt-2">Powered by Gatherfy</p>
            </div>
            <div class="w-full">
              <div
                class="flex h-full w-full flex-col justify-between rounded-[5px] pl-5"
              >
                <div class="pb-5">
                  <h1 class="t2">{{ ticket.name }}</h1>
                  <div class="flex items-center gap-2">
                    <p v-for="tag in ticket.tags" class="b3">{{ tag }}</p>
                  </div>
                </div>
                <div class="flex items-end justify-between">
                  <div>
                    <div class="">
                      <p class="b3 font-semibold">Co-Working Space</p>
                      <p class="b3">Chiang Mai, Thailand</p>
                    </div>
                    <div class="mt-4">
                      <p class="b2 font-semibold">25.12.2025</p>
                      <p class="b2">Sunday 7PM - 11PM</p>
                    </div>
                  </div>
                  <div class="w- flex flex-col items-end gap-3 self-end">
                    <div class="w-full">
                      <button
                        @click="onReviewFeedback(ticket.eventId)"
                        class="b3 w-full rounded-md bg-white px-2 py-1"
                      >
                        Review event
                      </button>
                    </div>
                    <div
                      class="b3 relative flex aspect-square w-[120px] items-center justify-center text-center"
                    >
                      <button
                        v-if="!qrValues[ticket.eventId]"
                        @click="generateQRCode(ticket.eventId)"
                        class="h-full w-full border-[1px] border-dashed border-black"
                      >
                        Click to view <br />
                        QR Code
                      </button>
                      <div
                        v-if="qrValues[ticket.eventId]"
                        class="rounded-g bg-white p-2"
                      >
                        <qrcode-vue
                          :value="qrValues[ticket.eventId]"
                          size="100"
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
    <FeedbackForm
      v-if="previewFeedback"
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
