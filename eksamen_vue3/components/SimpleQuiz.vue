<script setup>
import { ref, reactive } from 'vue';
import { useQuizStore } from '@/stores/quizStore';
import { z } from 'zod';

// Quiz data from props
const props = defineProps({
  quizDataProp: {
    type: Object,
    default: null,
  },
});

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

function prepareQuiz() {
  quiz.numberOfQuestions = quiz.questions.length;
}

// TODO: get chatGPT to generat other wrong answers
// prompt: I'm creating a quiz about capital cities of countries. Generate 3 other words that have similar context to "Manila"
// prompt: I'm creating a quiz about taylor swift. Generate 3 other answers to the quiz that have approximately similar context with "1989". No description just words
// system: You are a helpful assistant designed to generate random answers to a quiz or question that are approximately similar to the provided correct answer. Generate your response with JSON. Words only no descriptions or explanations.
// user: The question is about "Dota 2". The correct answer is "Doom"
function prepareQuestions() {
  const numberOfAnswers = 4;

  quiz.questions.forEach((que) => {
    // Fill-in random wrong answers
    const answers = que.answers;

    if (answers.length < numberOfAnswers) {
      const remaining = numberOfAnswers - answers.length;
      const addAnswers = generateRadioAnswerSet(remaining);
      console.log('answer set ', addAnswers);

      que.answers = randomizeArrayValues([...addAnswers, ...que.answers]);
    }
  });
}

prepareQuiz();
prepareQuestions();

const resetErrorMessage = () => {
  errors.value = [];
};

const validateAnswer = (options, questionId) => {
  let result = {};
  console.log('options: ', options);
  const answer = formData.value[questionId];
  const { zod } = options;
  const validateSchema = zod.split('|');

  // todo: add validation for checkbox
  // check if required
  // check minimum answer length then check array length
  // validate
  // ? create custom zod validation

  // const schema = z[validateSchema[0] + '()'];
  // console.log('z eval', z[validateSchema[0] + '()']);
  // const result = z['string']().safeParse(answer)
  if (options.type === 'radio') {
    const schema = z.union(validateSchema.map((schem) => z[schem]()));
    console.log('answer: ', answer);
    result = schema.safeParse(answer);
  } else if (options.type === 'checkbox' && !options.isOptional) {
    const schema = z
      .string()
      .array()
      .nonempty()
      .min(options.min)
      .max(options.max);
    result = schema.safeParse(answer);
  }

  console.log('result: ', result);
  return result;
};

const onSubmit = async (values) => {
  isSubmitting.value = true;
  buttonText.value = 'Submitting';

  resetErrorMessage();

  quiz.questions.forEach((question) => {
    // const options = getQuestionValidateObj(quizData.quiz, question.id);
    const options = {
      ...getValidationConfig(question.answer_type),
      ...question.validation,
    };

    if (!options || options.isOptional) {
      return;
    }

    const result = validateAnswer(options, question.id);

    if (!result.success) {
      // handle error then return
      const formatted = result.error.format();

      errors.value = formatted._errors;
      options.errorMessage = formatted._errors[0];
      question.validation.errorMessage = formatted._errors[0];
    } else {
      // reset error messages
      options.errorMessage = '';
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
      numberOfQuestions: quiz.questions.length,
      quizId: quiz.id,
      formData: JSON.stringify(formObject),
    },
    onResponse({ request, response, options }) {
      console.log('onResponse response: ', response);
      const result = response._data.result;
      for (const key in result) {
        const answerResult = result[key];

        if (!answerResult.isCorrect) {
          const question = quiz.questions.find((q) => q.id === key);
          question.validation.errorMessage = 'Wrong';
          console.log('question.validation: ', question.validation);
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
      // quiz.validation.errorMessage = 'Failed to submit quiz, please try again.';
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

  buttonText.value = 'Submit';
  buttonIcon.value = '';
  isSubmitted.value = false;
};
</script>

<template>
  <section
    class="bg-white dark:bg-gray-800 p-10 rounded-xl flex flex-col gap-8 max-w-3xl"
  >
    <h1 class="text-4xl dark:text-white font-bold text-center">
      {{ quiz.name || '' }}
    </h1>

    <form @submit.prevent="onSubmit">
      <div class="card flex flex-col text-white">
        <template v-for="question in quiz.questions" :key="question.id">
          <div class="mb-10">
            <h3 class="mb-4 text-2xl">
              {{ question.name }}
            </h3>

            <div class="card flex justify-content-center text-white">
              <div class="flex flex-col gap-3">
                <div
                  v-for="answer in question.answers"
                  :key="answer.id"
                  class="flex align-items-center"
                >
                  <template v-if="question.answer_type === 'checkbox'">
                    <Checkbox
                      @click="
                        onAnswerChange(question.id, formData[question.id])
                      "
                      v-model="formData[question.id]"
                      :inputId="answer.id"
                      :name="question.id"
                      :value="answer.value"
                    />
                    <label :for="answer.id" class="ml-2 text-lg">{{
                      answer.label
                    }}</label>
                  </template>
                  <template v-else-if="question.answer_type === 'radio'">
                    <RadioButton
                      @click="
                        onAnswerChange(question.id, formData[question.id])
                      "
                      v-model="formData[question.id]"
                      :inputId="answer.id"
                      :name="question.id"
                      :value="answer.value"
                    />
                    <label :for="answer.id" class="ml-2 text-lg">{{
                      answer.label
                    }}</label>
                  </template>
                </div>
                <small class="text-lg text-red-400">
                  <!-- Wrong -->
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
          <h4>
            {{ errors.length }} question{{ errors.length > 1 ? 's' : '' }} above
            needs attention
          </h4>
        </div>
      </template>

      <!-- Server errors -->
      <div class="mb-4 text-lg text-red-400">
        <!-- Please rectify invalid answers above -->
        <!-- <h4>{{ quiz.validation.errorMessage }}</h4> -->
      </div>

      <div class="flex justify-end">
        <Button
          type="submit"
          :label="buttonText"
          :icon="buttonIcon"
          :loading="isSubmitting"
          :disabled="isSubmitted"
        />
      </div>
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
