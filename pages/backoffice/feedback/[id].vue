<script setup lang="ts">
import FeedbackForm from '~/components/backoffice/FeedbackForm.vue';
import FeedbackSurvey from '~/components/backoffice/FeedbackForm.vue';
import QuestionItem from '~/components/backoffice/QuestionItem.vue';
import Arrow from '~/components/icons/Arrow.vue';
import BubbleQuestion from '~/components/icons/BubbleQuestion.vue';
import Cancle from '~/components/icons/Cancle.vue';
import CheckCircle from '~/components/icons/CheckCircle.vue';
import type { Event } from '~/models/event';

definePageMeta({
  layout: 'backoffice',
});

const route = useRoute();
const param = route.params.id;
const error = useError();
const isLoading = ref(true);
const event = ref();
const isChangeStatusComplete = ref();
const indexDeleteQuestion = ref();
const indexConfirmDelete = ref();
const questionIdConfirmDelete = ref();
const previewFeedback = ref(false);
const deleteCompleted = ref(false);
const saveCompleted = ref(false);

const props = defineProps<{
  event?: Event;
}>();

interface CheckedInOption {
  name: string;
  urlSend: string;
}
interface FeedbackQuestion {
  eventId: string;
  questionText: string;
  questionType: string;
  questionTypeName: string;
  isDropdownOpen: boolean;
}
interface ExistingQuestion {
  questionId: string;
  eventId: string;
  questionText: string;
  questionType: string;
  questionTypeName: string;
  isDropdownOpen: boolean;
}
interface DefaultQuestion {
  questionText: string;
  questionType: string;
  questionTypeName: string;
}
const existQuestion = ref<ExistingQuestion[]>([]);
const compareExistQuestion = ref<ExistingQuestion[]>([]);
const questions = ref<FeedbackQuestion[]>([]);
const finalQuestion = ref<(FeedbackQuestion | DefaultQuestion)[]>([]);

const selectedEventTimeStyle = {
  active: 'text-light-grey font-semibold bg-burgundy',
  notActive: 'text-black',
};
const statusStyle = {
  success: {
    style: 'bg-[#16C098]/25 text-[#008767]',
    text: 'Status has been updated',
  },
  failed: {
    style: 'bg-[#ef4444]/25 text-[#ef4444]',
    text: 'Sorry, something went wrong',
  },
  noChange: {
    style: 'bg-[#E8E8E8] text-[#939393]',
    text: 'Sorry, nothing changed',
  },
};
const statusData = [
  {
    name: 'Text',
    urlSend: 'text',
  },
  {
    name: 'Rating (1-5)',
    urlSend: 'rating',
  },
];

const defaultQuestion = [
  {
    questionText: 'How satisfied are you after joining the event ?',
    questionType: 'rating',
    questionTypeName: 'Rating (1-5)',
  },
  { questionText: 'Comment', questionType: 'text', questionTypeName: 'Text' },
];

async function fetchData() {
  const fetchedEventData = await useFetchData(`v1/events/backoffice/${param}`);
  const fetchedQuestionData = await useFetchData(`v1/questions/event/${param}`);

  if (fetchedEventData.error || fetchedQuestionData.error) {
    error.value = fetchedEventData ? fetchedEventData : fetchedQuestionData;
  } else {
    event.value = fetchedEventData || [];
    existQuestion.value = fetchedQuestionData || [];
    // Create a deep copy of fetchedQuestionData for compareExistQuestion
    compareExistQuestion.value = fetchedQuestionData.map((item: any) => ({
      ...item,
    }));
  }
}
const createQuestion = async () => {
  const formattedQuestions = getFormattedQuestions('create');
  formattedQuestions.forEach(async (question) => {
    const fetchedData = await useFetchRegistration(
      `v1/questions`,
      'POST',
      question
    );
  });
};

async function editQuestion(difference: ExistingQuestion[]) {
  const formattedQuestions = getEditFormattedQuestions(difference);
  let createResult = true;
  difference.forEach(async (question, index) => {
    const fetchedData = await useFetchRegistration(
      `v1/questions/${question.questionId}`,
      'PUT',
      formattedQuestions[index]
    );
  });
}

const deleteQuestion = async (questionId: number) => {
  const fetchedDelete = await useFetchDelete(`v1/questions/${questionId}`);
  if (fetchedDelete === 200) {
    isChangeStatusComplete.value = true;
  } else {
    isChangeStatusComplete.value = false;
  }
};

function selectStatus(index: number, statusOption: CheckedInOption) {
  questions.value[index].questionType = statusOption.urlSend;
  questions.value[index].questionTypeName = statusOption.name;
  questions.value[index].isDropdownOpen =
    !questions.value[index].isDropdownOpen;
}

function getDifference<T>(array1: T[], array2: T[], ...keys: Array<keyof T>) {
  return array1.filter(
    (obj1) => !array2.some((obj2) => keys.every((k) => obj1[k] === obj2[k]))
  );
}

async function toSave() {
  let processResult = true;
  try {
    isLoading.value = true;
    let difference = getDifference(
      existQuestion.value,
      compareExistQuestion.value,
      'questionText',
      'questionType'
    );
    console.log(difference);
    if (questions.value.length >= 1 && difference.length !== 0) {
      await createQuestion();
      await editQuestion(difference);
    } else if (questions.value.length >= 1 && difference.length === 0) {
      await createQuestion();
    } else if (questions.value.length === 0 && difference.length !== 0) {
      await editQuestion(difference);
    }
  } catch {
    processResult = false;
  } finally {
    saveCompleted.value = true;
    questions.value.splice(0);
    await fetchData();
    setTimeout(() => {
      saveCompleted.value = false;
    }, 3000);
    isLoading.value = false;
  }
}

function addField() {
  const param = Array.isArray(route.params.id)
    ? route.params.id[0]
    : route.params.id;
  questions.value.push({
    eventId: param,
    questionText: '',
    questionType: '',
    questionTypeName: '',
    isDropdownOpen: false,
  });
}

function getFormattedQuestions(type: string) {
  if (type === 'create') {
    return questions.value.map(({ eventId, questionText, questionType }) => ({
      eventId,
      questionText,
      questionType,
    }));
  } else if (type === 'edit') {
    return existQuestion.value.map(
      ({ eventId, questionText, questionType }) => ({
        eventId,
        questionText,
        questionType,
      })
    );
  }
  return [];
}

function getEditFormattedQuestions(data: ExistingQuestion[]) {
  return data.map(({ eventId, questionText, questionType }) => ({
    eventId,
    questionText,
    questionType,
  }));
}

// Function to remove a field by index
function removeField(indexName: string, index: number, questionId: number) {
  const array = indexName.split('-');
  if (indexName.includes('existing')) {
    indexDeleteQuestion.value = array[1];
    indexConfirmDelete.value = indexName;
    questionIdConfirmDelete.value = questionId;
  } else {
    indexDeleteQuestion.value = array[1];
    indexConfirmDelete.value = indexName;
  }
}

async function confirmRemoveField(indexName: string, confirm: boolean) {
  const array = indexName.split('-');
  console.log(questionIdConfirmDelete.value);

  if (array[0] === 'existing' && confirm) {
    deleteCompleted.value = true;
    deleteQuestion(questionIdConfirmDelete.value);
    existQuestion.value.splice(indexDeleteQuestion.value, 1);
    indexDeleteQuestion.value = null;
    questionIdConfirmDelete.value = null;
    setTimeout(() => {
      deleteCompleted.value = false;
    }, 1500);
    indexConfirmDelete.value = null;
  } else if (array[0] === 'custom' && confirm) {
    deleteCompleted.value = true;
    questions.value.splice(indexDeleteQuestion.value, 1);
    indexDeleteQuestion.value = null;
    indexConfirmDelete.value = null;
    setTimeout(() => {
      deleteCompleted.value = false;
    }, 1500);
  } else {
    indexConfirmDelete.value = null;
  }
}
function combineQuestion() {
  finalQuestion.value = [
    ...existQuestion.value,
    ...questions.value,
    ...defaultQuestion,
  ];
  previewFeedback.value = true;
  document.body.style.overflow = 'hidden';
  console.log(finalQuestion.value);
}
function closePreview() {
  previewFeedback.value = false;
  document.body.style.overflow = '';
}

onMounted(() => {
  try {
    isLoading.value = true;
    fetchData();
    isChangeStatusComplete.value = null;
    indexConfirmDelete.value = null;
  } finally {
    isLoading.value = false;
  }
});

watchEffect(() => {
  if (param) {
    isChangeStatusComplete.value = null;
    indexConfirmDelete.value = null;
  }
});
</script>

<template>
  <div class="ml-80 flex h-fit w-screen bg-ghost-white">
    <div
      class="mx-20 mb-16 mt-32 h-fit w-full rounded-3xl bg-white drop-shadow-lg"
    >
      <div class="p-12">
        <NuxtLink
          :to="{
            name: `backoffice-events-id`,
            params: { id: param },
          }"
          class="mb-5 flex items-center gap-2 text-dark-grey duration-200 hover:-ml-3"
        >
          <Arrow />
          <p class="b2">Back to event detail</p>
        </NuxtLink>

        <h1 class="regis-detail-title t1">Manage Feedback</h1>
        <div v-if="isLoading" class="my-16 flex items-center justify-center">
          <span class="loader"></span>
        </div>
        <div v-else>
          <div
            v-if="indexConfirmDelete !== null"
            class="absolute inset-0"
          ></div>
          <div class="mb-10 mt-10 grid grid-cols-4 gap-x-16 gap-y-5">
            <div
              v-if="isChangeStatusComplete != null"
              :class="`col-span-3 flex items-center gap-2 rounded-lg px-4 py-2 ${isChangeStatusComplete === true ? statusStyle.success.style : statusStyle.failed.style}`"
            >
              <CheckCircle />
              <p class="alert-text b2">
                {{
                  isChangeStatusComplete === true
                    ? statusStyle.success.text
                    : statusStyle.failed.text
                }}
              </p>
            </div>
            <div class="col-span-4">
              <p class="b1">Craete feedback for event {{ event?.name }}</p>
            </div>
            <div class="col-span-4 my-6">
              <p class="t3">General Feedback</p>
              <p class="b2 mt-3 italic">
                These are essential feedback questions that must be included in
                every event.
              </p>
            </div>
            <div class="col-span-1">
              <p class="b1 font-medium">Rating</p>
              <p class="b3 mt-3 italic text-burgundy">
                You can not edit this question
              </p>
            </div>
            <div class="col-span-2 col-start-2">
              <p class="b2 font-medium">Question text</p>
              <p class="b2 my-4 px-4 py-2">
                How satisfied are you after joining the event ?
              </p>
            </div>
            <div class="col-span-2 col-start-2">
              <p class="b2 font-medium">Answer type</p>
              <p class="b2 my-4 px-4 py-2">Rating (1-5)</p>
            </div>
            <div class="col-span-2 col-start-2">
              <p class="b2 font-medium">Your answer box look like</p>
              <div class="mx-3 my-4">
                <NuxtRating
                  :read-only="true"
                  :rating-value="3"
                  rating-size="30"
                />
              </div>
            </div>
            <hr class="col-span-4 mb-4" />
            <div class="col-span-1 col-start-1">
              <p class="b1 font-medium">General comment</p>
              <p class="b3 mt-3 italic text-burgundy">
                You can not edit this question
              </p>
            </div>
            <div class="col-span-2 col-start-2">
              <p class="b2 font-medium">Question text</p>
              <p class="b2 my-4 px-4 py-2">What's your overall experience ?</p>
            </div>
            <div class="col-span-2 col-start-2">
              <p class="b2 font-medium">Answer type</p>
              <p class="b2 my-4 px-4 py-2">Text</p>
            </div>
            <div class="col-span-2 col-start-2">
              <p class="b2 font-medium">Your answer box look like</p>
              <div>
                <textarea
                  rows="3"
                  required
                  placeholder="Leave your answer"
                  disabled
                  class="b2 border-1 my-4 w-full rounded-lg bg-[#F8FBFF] px-4 py-2 shadow-inner focus:outline-none"
                />
              </div>
            </div>
          </div>
          <div class="col-span-3">
            <p class="t3">Custom Questions</p>
            <p class="b2 mt-3 italic">
              Add questions specific to this event to gather additional
              insights.
            </p>
          </div>
          <div class="">
            <!-- Existing Questions -->
            <div
              v-for="(question, index) in existQuestion"
              :key="`existing-${index}`"
              class="grid grid-cols-4 gap-x-5 gap-y-3"
            >
              <QuestionItem
                class="duration-200"
                :type="'existing'"
                :question="question"
                :index="index"
                :index-name="`existing-${index}`"
                :startIndex="index"
                :indexConfirmDelete="indexConfirmDelete"
                :selectedEventTimeStyle="selectedEventTimeStyle"
                :removeField="removeField"
                :confirmRemoveField="confirmRemoveField"
                :selectStatus="selectStatus"
              />
            </div>
            <div
              v-for="(question, index) in questions"
              :key="`custom-${index}`"
              class="grid grid-cols-4 gap-x-5 gap-y-3"
            >
              <QuestionItem
                class="fade-leave-active"
                :type="'custom'"
                :question="question"
                :index="index"
                :index-name="`custom-${index}`"
                :startIndex="existQuestion.length"
                :indexConfirmDelete="indexConfirmDelete"
                :selectedEventTimeStyle="selectedEventTimeStyle"
                :removeField="removeField"
                :confirmRemoveField="confirmRemoveField"
                :selectStatus="selectStatus"
              />
            </div>
            <div
              @click="addField"
              class="b3 my-8 flex cursor-pointer items-center justify-center gap-3 rounded-md bg-[#0085DB]/15 px-6 py-2 font-semibold text-[#0085DB] duration-150 hover:bg-[#0085DB]/75 hover:text-white"
            >
              <p>Add Question</p>
              <BubbleQuestion class="b1" />
            </div>
          </div>
          <div class="flex justify-end gap-5">
            <BtnComp text="Preview" @click="combineQuestion" color="blue" />
            <BtnComp text="Save" @click="toSave" color="green" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <FeedbackForm
    :questions="finalQuestion"
    :preview-feedback="previewFeedback"
    :close-preview="closePreview"
  />

  <div
    :class="
      deleteCompleted
        ? 'translate-y-0 opacity-100'
        : 'translate-y-full opacity-0'
    "
    class="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-xl border border-red-400 bg-red-100 px-20 py-3 text-red-700 duration-500"
    role="alert"
  >
    <p class="b2">Question is removed</p>
  </div>
  <div
    :class="
      saveCompleted ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
    "
    class="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-xl bg-[#16C098]/25 px-20 py-3 text-[#008767] duration-500"
    role="alert"
  >
    <p class="b2">Your change are saved</p>
  </div>
</template>

<style scoped></style>
