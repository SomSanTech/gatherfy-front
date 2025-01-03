<script setup lang="ts">
import FeedbackList from '~/components/backoffice/FeedbackList.vue';
import type { User } from '~/models/user';
import FeedbackForm from '~/components/backoffice/FeedbackForm.vue';
import type { DefaultQuestion, ExistingQuestion } from '~/models/question';

definePageMeta({
  layout: 'backoffice',
});

interface Event {
  eventId: number;
  eventName: string;
  eventLocation: string;
  eventStartDate: Date;
}

const mockAdminLogin = {
  userId: 2,
  firstname: 'Jane',
  lastname: 'Smith',
  username: 'Janesmith',
  gender: 'Female',
  email: 'janesmith@example.com',
  phone: '0987654321',
  role: 'Organization',
};

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
const adminData = ref<User | null>(null);
const isLoading = ref(true);
const feedbacksCount = ref();
const previewFeedback = ref(false);

const fetchData = async () => {
  const fetchedData = await useFetchData(
    `v1/events/owner/${adminData.value?.userId}`
  );
  eventsData.value = fetchedData || [];
  // Initialize an empty array for feedback counts
  feedbacksCount.value = [];
  if (fetchedData) {
    // Using a for-of loop to handle async operations properly
    for (const item of fetchedData) {
      try {
        // Fetching feedback data for each event
        const fetchedFeedbackData = await useFetchData(
          `v2/feedbacks/event/${item.eventId}`
        );
        if (fetchedFeedbackData.count === undefined) {
          feedbacksCount.value.push(0);
        } else {
          feedbacksCount.value.push(fetchedFeedbackData.count);
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
  const fetchedQuestionData = await useFetchData(`v1/questions/event/${param}`);
  if (fetchedQuestionData.error) {
    finalQuestion.value = [...defaultQuestion];
    previewFeedback.value = true;
    feedbackQuestion.value = [];
  } else {
    feedbackQuestion.value = fetchedQuestionData || [];
    finalQuestion.value = [...feedbackQuestion.value, ...defaultQuestion];
    previewFeedback.value = true;
  }
  document.body.style.overflow = 'hidden';
};

function closePreview() {
  previewFeedback.value = false;
  document.body.style.overflow = '';
}

onMounted(async () => {
  try {
    isLoading.value = true;
    localStorage.setItem('admin', JSON.stringify(mockAdminLogin));
    const storedUser = localStorage.getItem('admin');
    adminData.value = storedUser ? JSON.parse(storedUser) : {};
    await fetchData();
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="ml-80 flex h-full w-screen bg-ghost-white">
    <div class="mx-20 mb-16 mt-32 w-full rounded-3xl bg-white drop-shadow-lg">
      <div class="p-12">
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
                Edit avalaiable until
              </td>
              <td
                class="h-14 w-24 px-4 text-base font-semibold text-lavender-gray"
              >
                Status
              </td>
              <td
                class="h-14 w-24 px-4 text-center text-base font-semibold text-lavender-gray"
              >
                Responses
              </td>
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
  />
</template>

<style scoped></style>
