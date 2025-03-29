<script setup lang="ts">
import FeedbackList from '~/components/backoffice/FeedbackList.vue';
import type { User } from '~/models/user';
import FeedbackForm from '~/components/backoffice/FeedbackForm.vue';
import type {
  AnswerBody,
  DefaultQuestion,
  ExistingQuestion,
  FeedbackBody,
} from '~/models/feedback';
import type { UserProfile } from '~/models/userProfile';

definePageMeta({
  layout: 'backoffice',
});

interface Event {
  eventId: number;
  eventName: string;
  eventLocation: string;
  eventStartDate: Date;
}
const profileData = useCookie('profileData');

const defaultQuestion = [
  {
    questionText: 'How satisfied are you after joining the event ?',
    questionType: 'rating',
    questionTypeName: 'Rating (1-5)',
  },
  { questionText: 'Comment', questionType: 'text', questionTypeName: 'Text' },
];

const eventsData = ref<Event[]>([]);
const feedbackQuestion = ref<ExistingQuestion[]>([]);
const finalQuestion = ref<(ExistingQuestion | DefaultQuestion)[]>([]);
const answers = ref<(AnswerBody | FeedbackBody)[]>([]);
const feedbacksCount = ref();
const previewFeedback = ref(false);
const token = useCookie('accessToken');

const fetchData = async () => {
  const fetchedData = await useFetchWithAuth(
    `v1/backoffice/events`,
    'GET',
    token.value
  );
  eventsData.value = fetchedData.data || [];
  // Initialize an empty array for feedback counts
  feedbacksCount.value = [];
  if (fetchedData) {
    // Using a for-of loop to handle async operations properly
    for (const item of fetchedData) {
      try {
        // Fetching feedback data for each event
        const fetchedFeedbackData = await useFetchWithAuth(
          `v2/feedbacks/event/${item.eventId}`,
          'GET',
          token.value
        );
        if (fetchedFeedbackData.data.count === undefined) {
          feedbacksCount.value.push(0);
        } else {
          feedbacksCount.value.push(fetchedFeedbackData.data.count);
        }
      } catch (error) {
        return;
      }
    }
  }
};

const compareDate = (startDate: Date) => {
  const now = new Date(Date.now());
  const event = new Date(startDate);
  return event > now;
};

const onPreviewFeedback = async (param: number) => {
  const fetchedQuestionData = await useFetchData(
    `v1/questions/event/${param}`,
    'GET'
  );
  if (fetchedQuestionData.error) {
    finalQuestion.value = [...defaultQuestion];
    previewFeedback.value = true;
    feedbackQuestion.value = [];
  } else {
    feedbackQuestion.value = fetchedQuestionData.data || [];
    finalQuestion.value = [...feedbackQuestion.value, ...defaultQuestion];
    previewFeedback.value = true;
  }
  for (const item of feedbackQuestion.value) {
    addAnswerField();
  }
  for (const item of defaultQuestion) {
    addFeedbackField();
  }
  document.body.style.overflow = 'hidden';
};
function addAnswerField() {
  answers.value.push({
    feedbackId: 0,
    questionId: 0,
    eventId: 0,
    answerText: '',
  });
}
function addFeedbackField() {
  answers.value.push({
    eventId: 0,
    userId: 0,
    feedbackRating: 0,
    feedbackComment: '',
  });
}
function closePreview() {
  previewFeedback.value = false;
  document.body.style.overflow = '';
}

const config = useRuntimeConfig();

async function downloadReport(eventId, eventName) {
  const response = await fetch(
    `${config.public.baseUrl}/api/v1/report/${eventId}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to download report');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');

  // ตั้งชื่อไฟล์จาก header "Content-Disposition"
  const contentDisposition = response.headers.get('Content-Disposition');
  let filename = `${eventName} response.xlsx`;
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="(.+)"/);
    if (match) {
      filename = match[1];
    }
  }

  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
const isLoading = useState('isLoading');

onMounted(async () => {
  try {
    isLoading.value = true;
    await fetchData();
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <Loader v-if="isLoading" />

  <div v-else class="flex h-full w-screen bg-[#EEEEEE] lg:ml-80">
    <div
      class="mx-3 mb-16 mt-32 w-full rounded-3xl bg-white drop-shadow-lg lg:mx-20"
    >
      <div class="p-3 lg:p-12">
        <h1 class="t1">Feedback list</h1>
        <div v-if="isLoading" class="my-16 flex items-center justify-center">
          <span class="loader"></span>
        </div>
        <table
          v-else
          class="mt-8 w-full table-auto caption-top overflow-scroll text-sm"
        >
          <thead class="">
            <tr class="border-default-300 border-b transition-colors">
              <td
                class="h-14 w-64 px-4 text-base font-semibold text-lavender-gray"
              >
                Event Name
              </td>
              <td
                class="h-14 w-48 px-4 text-base font-semibold text-lavender-gray"
              >
                Edit available until
              </td>
              <!-- <td
                class="h-14 w-24 px-4 text-center text-base font-semibold text-lavender-gray"
              >
                Responses
              </td> -->
              <td
                class="h-14 w-52 px-4 text-center text-base font-semibold text-lavender-gray"
              >
                Action
              </td>
            </tr>
          </thead>
          <tbody class="tbody-container overflow-y-auto">
            <tr v-if="eventsData.length === 0" class="text-center">
              <td colspan="3" class="b1 py-20">No Event</td>
            </tr>
            <tr
              v-else
              v-for="(event, index) in eventsData"
              class="border-default-300 cursor-default border-b transition-colors"
            >
              <FeedbackList
                :event="event"
                :responses="feedbacksCount[index]"
                :canEdit="compareDate(event.eventStartDate)"
                @preview-feedback="onPreviewFeedback"
                @export-feedback="downloadReport"
              />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <FeedbackForm
    v-if="previewFeedback"
    :questions="finalQuestion"
    :preview-feedback="previewFeedback"
    :close-preview="closePreview"
    :existing-question-count="feedbackQuestion.length"
    :answer-field="answers"
  />
</template>

<style scoped></style>
