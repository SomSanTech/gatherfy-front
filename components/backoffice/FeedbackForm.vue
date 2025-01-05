<script setup lang="ts">
import type {
  AddQuestion,
  AnswerBody,
  DefaultQuestion,
  EditQuestion,
  ExistingQuestion,
  FeedbackBody,
} from '~/models/feedback';
import Cancle from '../icons/Cancle.vue';

const props = withDefaults(
  defineProps<{
    questions?: (
      | EditQuestion
      | AddQuestion
      | DefaultQuestion
      | ExistingQuestion
    )[];
    previewFeedback: boolean;
    answerField: (AnswerBody | FeedbackBody)[];
    existingQuestionCount: number;
    closePreview: Function;
    submitFeedback?: Function;
  }>(),
  {
    submitFeedback: () => {},
  }
);

function ratingAnswer(index: number, rating: number) {
  if (index < props.existingQuestionCount) {
    (props.answerField[index] as AnswerBody).answerText = rating;
  } else {
    (props.answerField[index + 1] as FeedbackBody).feedbackRating = rating;
  }
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
      <p class="t2 mb-5">Event Feedback</p>
      <p class="b1">Please share your feedback regarding the event</p>
      <div v-for="(question, index) in questions" :key="index" class="my-10">
        <p class="b3 text-cool-gray">Question {{ index + 1 }}</p>
        <p class="b1 mt-3">
          {{ question.questionText }}
        </p>
        <div
          v-if="
            question.questionType === 'text' && index < existingQuestionCount
          "
        >
          <textarea
            rows="3"
            required
            placeholder="Leave your answer"
            v-model="(props.answerField[index] as AnswerBody).answerText"
            class="b2 border-1 my-4 w-full rounded-lg bg-[#F8FBFF] px-4 py-2 shadow-inner focus:outline-none"
          ></textarea>
        </div>
        <div
          v-else-if="
            question.questionType === 'text' && index >= existingQuestionCount
          "
        >
          <textarea
            rows="3"
            required
            placeholder="Leave your answer"
            v-model="(props.answerField[index] as FeedbackBody).feedbackComment"
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
            :rating-value="0"
            @rating-selected="ratingAnswer(index, $event)"
          />
        </div>
      </div>
      <div class="pb-20">
        <button
          type="button"
          class="float-right rounded-md bg-burgundy px-6 py-2 font-semibold text-light-grey duration-200 hover:bg-[#A61010]"
          @click="submitFeedback()"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
