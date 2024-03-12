<script setup lang="ts">
const props = defineProps({
  quizData: {
    type: Object,
    default: null,
  },
});
</script>

<template lang="">
  <div>
    <div v-if="quizData">
      <div :data-id="quizData.id">
        <NuxtLink :to="'/quiz/' + quizData.id_short">
          <div class="mb-2">
            <NuxtImg
              :src="quizData.img_url || ''"
              loading="lazy"
              class="rounded-2xl"
            />
          </div>
          <h2 class="mb-1 text-xl">
            <strong>{{ quizData.name }}</strong>
          </h2>
          <h3>{{ quizData.description }}</h3>
        </NuxtLink>
      </div>
    </div>
    <div v-else>
      <h2>Quiz data not found!</h2>
    </div>
  </div>
</template>
