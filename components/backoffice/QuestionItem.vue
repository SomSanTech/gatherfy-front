<script setup lang="ts">
import Arrow from '../icons/Arrow.vue';
import Trash from '../icons/Trash.vue';

const isShowStatus = ref(true);
const selectedEventTimeStyle = {
  active: 'text-light-grey font-semibold bg-burgundy',
  notActive: 'text-black',
};
const prop = defineProps<{
  type: string;
  question: ExistingQuestion | NewQuestion;
  index: number;
  indexName: string;
  startIndex: number;
  indexConfirmDelete: string | null;
  selectedEventTimeStyle: Object;
  removeField: Function;
  confirmRemoveField: Function;
  selectStatus: Function;
}>();

interface ExistingQuestion {
  questionId: string;
  eventId: string;
  questionText: string;
  questionType: string;
  questionTypeName: string;
  isDropdownOpen: boolean;
}

interface NewQuestion {
  eventId: string;
  questionText: string;
  questionType: string;
  questionTypeName: string;
  isDropdownOpen: boolean;
}

const questionType = [
  {
    name: 'Text',
    urlSend: 'text',
  },
  {
    name: 'Rating (1-5)',
    urlSend: 'rating',
  },
];
interface QuestionTypeOption {
  name: string;
  urlSend: string;
}
const selectType = (typeOption: QuestionTypeOption) => {
  prop.question.questionType = typeOption.urlSend;
  prop.question.questionTypeName = typeOption.name;
  prop.question.isDropdownOpen = !prop.question.isDropdownOpen;
  console.log(typeOption);
};
</script>

<template>
  <div class="grid grid-cols-4 gap-x-5 gap-y-3">
    <div class="relative col-span-1 mt-10 flex gap-5">
      <p class="b1 font-medium">
        Question {{ type === 'existing' ? index + 1 : index + startIndex + 1 }}
      </p>
      <Trash
        class="b1 mt-1 cursor-pointer"
        @click="
          removeField(indexName, (question as ExistingQuestion).questionId)
        "
      />
      <div
        v-if="indexConfirmDelete == indexName"
        class="absolute top-8 z-50 flex translate-x-1/3 items-center justify-center bg-opacity-50"
      >
        <div
          class="w-full max-w-sm overflow-hidden rounded-lg border bg-white shadow-xl"
        >
          <div class="px-6 pb-6 pt-4 text-center">
            <h3 class="b2 mb-6 mt-5 font-normal text-gray-500">
              Are you sure you want to delete this question?
            </h3>
            <button
              @click="confirmRemoveField(indexName, true)"
              class="b3 mr-2 inline-flex items-center rounded-lg bg-red-600 px-3 py-2.5 text-center font-medium text-white hover:bg-red-800 focus:ring-4 focus:ring-red-300"
            >
              Yes, I'm sure
            </button>
            <button
              @click="confirmRemoveField(indexName, false)"
              class="b3 inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-center font-medium text-gray-900 hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200"
            >
              No, cancel
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="col-span-2 col-start-2 mt-10">
      <p class="b2 font-medium">Question text</p>
      <input
        type="text"
        required
        placeholder="Type your question"
        v-model="question.questionText"
        class="b2 border-1 my-4 w-full rounded-lg bg-[#F8FBFF] px-4 py-2 shadow-inner focus:outline-none"
      />
    </div>
    <div class="col-span-2 col-start-2">
      <p class="b2 font-medium">Select your question type</p>
      <div class="z-30" v-show="isShowStatus">
        <div class="relative">
          <button
            @click="question.isDropdownOpen = !question.isDropdownOpen"
            class="regis-detail-status b2 border-1 my-4 flex w-full items-center justify-between gap-1 rounded-lg bg-[#F8FBFF] px-4 py-2 shadow-inner"
          >
            {{
              // question.questionTypeName
              // ? question.questionTypeName
              // : 'Please select your question type'
              question.questionTypeName
                ? question.questionTypeName
                : question.questionType
                  ? questionType.find(
                      (x) => x.urlSend === question.questionType
                    )?.name
                  : 'Please select your question type'
            }}
            <Arrow
              :class="`${question.isDropdownOpen ? 'rotate-90' : '-rotate-90'} text-sm duration-200`"
            />
          </button>
          <div
            v-if="question.isDropdownOpen"
            class="absolute top-12 flex w-full flex-col items-start gap-1 rounded-xl bg-[#fdfdfd] p-3 text-start drop-shadow-lg"
          >
            <button
              v-for="typeOption in questionType"
              @click="selectType(typeOption)"
              :class="`status-choice w-full rounded-md px-4 py-1 text-start font-semibold ${question.questionTypeName === typeOption.name ? selectedEventTimeStyle?.active : 'duration-200 hover:bg-zinc-200'}`"
            >
              {{ typeOption.name }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="question.questionType" class="col-span-2 col-start-2">
      <p class="b2 font-medium">Your answer box look like</p>
      <div v-if="question.questionType === 'text'">
        <textarea
          rows="3"
          required
          placeholder="Leave your answer"
          disabled
          class="b2 border-1 my-4 w-full rounded-lg bg-[#F8FBFF] px-4 py-2 shadow-inner focus:outline-none"
        />
      </div>
      <div v-else-if="question.questionType === 'rating'" class="mx-3 my-4">
        <NuxtRating :read-only="true" :rating-value="3" rating-size="30" />
      </div>
    </div>
    <hr class="col-span-4 text-black/25" />
  </div>
</template>

<style scoped></style>
