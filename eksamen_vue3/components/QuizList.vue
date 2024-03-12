<script setup lang="ts">
const props = defineProps({
  list: {
    type: Array<Object>,
    default: [],
  },
});
</script>

<template>
  <div class="text-white">
    <h1 class="mb-12 text-4xl text-center">
      <strong>Quizzes</strong>
    </h1>

    <template v-if="!list">
      <p>no quiz fetched</p>
    </template>
    <template v-else-if="list.length > 0">
      <div class="card flex flex-row justify-evenly">
        <template v-for="data in list" :key="data.id">
          <div class="basis-1/3">
            <QuizTile :quiz-data="data" />
          </div>
        </template>
      </div>
    </template>

    <template v-if="list.length === 0">
      <!-- If no quizzes -->
      <h2>No quizzes found!</h2>
      <NuxtLink to="/">Go back</NuxtLink>
    </template>
  </div>
</template>
