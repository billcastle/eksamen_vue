<script setup>
import { ref, reactive, watch } from 'vue';
import { useQuizStore } from '@/stores/quizStore';
import { z } from 'zod';

// Quiz data from props
const props = defineProps({
  quizDataProp: {
    type: Object,
    default: null
  }
})

// Quiz Data
const quizData = useQuizStore();
const quiz = reactive(props.quizDataProp || quizData.quiz);
const formData = ref({});

// Submission & Validation
const buttonIcon = ref('');
const buttonText = ref('Submit');
const isSubmitted = ref(false);
const isSubmitting = ref(false);
const errors = ref([]);
const score = ref(null);

const resetErrorMessage = () => {
  errors.value = [];
};

const validateAnswer = (options, questionId) => {
  const answer = formData.value[questionId];
  const { zod } = options;
  const validateSchema = zod.split('|');

  // const schema = z[validateSchema[0] + '()'];
  // console.log('z eval', z[validateSchema[0] + '()']);
  // const result = z['string']().safeParse(answer)
  const schema = z.union(validateSchema.map((schem) => z[schem]()));
  const result = schema.safeParse(answer);

  return result;
};

const onSubmit = async (values) => {
  isSubmitting.value = true;
  buttonText.value = 'Submitting';

  resetErrorMessage();

  quiz.questions.forEach((question) => {
    const options = getQuestionValidateObj(quizData.quiz, question.id);

    if (options.isOptional) {
      return;
    }

    const result = validateAnswer(options, question.id);
    console.log('result: ', result);

    if (!result.success) {
      // handle error then return
      const formatted = result.error.format();
      console.log('formatted: ', formatted);
      console.log('result.error: ', result.error);

      errors.value = formatted._errors;
      options.errorMessage = formatted._errors[0];
      // question.validation.errorMessage = formatted._errors[0]
    } else {
      options.errorMessage = '';
      // do something
      console.log('result.data: ', result.data);
    }
  });

  // Prevent submit to server if has client validation error
  if (errors.value.length > 0) {
    isSubmitting.value = false;
    buttonText.value = 'Submit';
    return;
  }

  const quizFormData = new FormData(values.target);
  const formObject = {};
  for (const [key, value] of quizFormData) {
    formObject[key] = value;
  }

  console.log('formObject: ', formObject);

  const { data } = await useFetch('/api/submitQuiz', {
    method: 'post',
    body: {
      formData: JSON.stringify(formObject)
    },
    onResponse({ request, response, options }) {
      console.log('options: ', options);
      console.log('🚀 ~ onResponse ~ response:', response._data);
      const result = response._data.result;
      console.log('onResponse result: ', result);
      for (const key in result) {
        const answerResult = result[key];

        if (!answerResult.isCorrect) {
          const question = quiz.questions.find((q) => q.id === key);
          question.validation.errorMessage = 'Wrong';
        }
      }
      // Process the response data
      // localStorage.setItem('token', response._data.token)

      score.value = response._data.score;
      isSubmitted.value = true;
    },
    onRequestError({ request, options, error }) {
      // Handle the request errors
      console.log('🚀 ~ onRequestError ~ onResponseError:', error);
      quiz.validation.errorMessage = 'Failed to submit quiz, please try again.';
    },
    onResponseError({ request, response, options }) {
      console.log('🚀 ~ onResponseError ~ onResponseError:', response);
      // Handle the response errors
    },
  });

  isSubmitting.value = false;
  buttonText.value = 'Submitted';
  buttonIcon.value = 'pi pi-check';
  console.log('🚀 ~ submitQuiz ~ data:', data);
};

// Watch for changes to reset the submission status
const onAnswerChange = (questionId, answerValue) => {
  if (!answerValue || formData[questionId] === answerValue) {
    return;
  }

  console.log('ans: ', answerValue);
  console.log('questionId: ', questionId);
  buttonText.value = 'Submit';
  buttonIcon.value = '';
  isSubmitted.value = false;
};
</script>

<template>
  <section
    class="bg-white dark:bg-gray-800 p-10 rounded-xl flex flex-col gap-8 max-w-3xl"
  >
    <h1 class="text-4xl text-black dark:text-white font-bold text-center">
      Tailwind CSS + PrimeVue
    </h1>

    <h1 class="text-3xl dark:text-white font-bold text-center">
      {{ quiz.quizName || '' }}
    </h1>

    <form @submit.prevent="onSubmit">
      <div class="card flex flex-col text-white">
        <template v-for="question in quiz.questions" :key="question.id">
          <div class="mb-10">
            <h3 class="mb-4 text-xl">
              <strong>{{ question.questionName }}</strong>
            </h3>

            <div class="card flex justify-content-center text-white">
              <div class="flex flex-col gap-3">
                <div
                  v-for="answer in question.answers"
                  :key="answer.id"
                  class="flex align-items-center"
                >
                  <RadioButton
                    @click="onAnswerChange(question.id, formData[question.id])"
                    v-model="formData[question.id]"
                    :inputId="answer.id"
                    :name="question.id"
                    :value="answer.value"
                  />
                  <label :for="answer.id" class="ml-2">{{
                    answer.label
                  }}</label>
                </div>
                <small class="text-lg text-red-400">
                  {{ question.validation.errorMessage }}
                </small>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Client validation quiz errors -->
      <template v-if="errors.length > 0">
        <div class="mb-4 text-lg text-red-400">
          <h4>{{ errors.length }} question(s) above needs attention</h4>
        </div>
      </template>

      <!-- Server errors -->
      <div class="mb-4 text-lg text-red-400">
        <h4>{{ quiz.validation.errorMessage }}</h4>
      </div>

      <Button
        type="submit"
        :label="buttonText"
        :icon="buttonIcon"
        :loading="isSubmitting"
        :disabled="isSubmitted"
      />
    </form>

    <template v-if="score">
      <div class="text-lg dark:text-white">
        <p>
          You scored: {{ score.scoreTemplate }} ({{ score.percentageTemplate }})
        </p>
      </div>
    </template>
  </section>
</template>
