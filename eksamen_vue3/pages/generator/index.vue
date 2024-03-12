<template>
  <div>
    <div class="text-white">
      <h1 class="mb-12 text-2xl">Generate Random Answers using AI</h1>

      <form @submit.prevent="onSubmit" class="flex flex-col justify-start">
        <div class="mb-6 form-group">
          <label class="mb-2 block" for="question"> Question: </label>
          <InputText
            class="w-full block"
            name="question"
            id="question"
            type="text"
          />
        </div>
        <Button label="Generate" type="submit" />
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import InputText from 'primevue/inputtext';
console.log('yeah');

const onSubmit = async (values) => {
  console.log('values: ', values);
  const quizFormData = new FormData(values.target);
  const formObject = {};
  for (const [key, value] of quizFormData) {
    formObject[key] = value;
  }

  const { data } = await useFetch('/api/generateAnswers', {
    method: 'post',
    body: {
      formData: JSON.stringify(formObject),
    },
    onResponse({ request, response, options }) {
      console.log('options: ', options);
      console.log('response: ', response);
    },
    onRequestError({ request, options, error }) {
      console.log('onRequestError: ', request);
    },
    onResponseError({ request, response, options }) {
      console.log('onResponseError: ', response);
    }
  });

  console.log('data: ', data);
};
</script>
