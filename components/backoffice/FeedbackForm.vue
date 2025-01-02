<script setup lang="ts">
import Cancle from '../icons/Cancle.vue';

const props = defineProps<{
  questions?:
    | FeedbackQuestion[]
    | NewQuestion[]
    | DefaultQuestion[]
    | ExistingQuestion[];
  previewFeedback: boolean;
  closePreview: Function;
}>();

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
}
interface DefaultQuestion {
  questionText: string;
  questionType: string;
  questionTypeName: string;
}
interface NewQuestion {
  eventId: string;
  questionText: string;
  questionType: string;
  questionTypeName: string;
  isDropdownOpen: boolean;
}
</script>

<template>
  <div
    v-if="previewFeedback"
    :class="previewFeedback ? 'scale-100 opacity-100' : 'scale-0 opacity-0'"
    class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm duration-500"
  >
    <div
      class="relative max-h-[80%] w-[60%] overflow-auto rounded-xl border border-opacity-5 bg-white px-14 pt-12 shadow-lg"
    >
      <div
        @click="closePreview()"
        class="b1 absolute right-7 top-7 cursor-pointer"
      >
        <Cancle />
      </div>
      <p class="t2">Event Feedback</p>
      <p class="b1">Please share your feedback regarding the event</p>
      <div v-for="(question, index) in questions" :key="index" class="my-10">
        <p class="b3 text-cool-gray">Question {{ index + 1 }}</p>
        <p class="b1 mt-3">{{ question.questionText }}</p>
        <div v-if="question.questionType === 'text'">
          <textarea
            rows="3"
            required
            placeholder="Leave your answer"
            class="b2 border-1 my-4 w-full rounded-lg bg-[#F8FBFF] px-4 py-2 shadow-inner focus:outline-none"
          ></textarea>
        </div>
        <div
          v-else-if="question.questionType === 'rating'"
          class="mb-10 mt-5 flex"
        >
          <NuxtRating
            :read-only="false"
            rating-size="50"
            :rating-step="1"
            :rating-spacing="15"
          />
        </div>
      </div>
      <div class="pb-16">
        <BtnComp text="Send" color="red" class="float-right" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
