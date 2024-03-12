<script setup lang="ts">
const route = useRoute();
const client = useSupabaseClient();
console.log('route.params.id:', route.params.id);

const { data, error } = await useAsyncData('quiz', async () => {
  const { data } = await client
    .from('public_quiz')
    .select(
      `name, id, id_short, description, label, created_at, img_url, questions:public_questions (id, name, validation, answer_type, answers(id, value, label))`
    )
    .eq('id_short', route.params.id);

  return data.length > 0 ? data[0] : {};
});
</script>

<template>
  <div class="text-white">
    <template v-if="error"> error getting quiz data =( </template>
    <template v-else>
      <SimpleQuiz :quiz-data-prop="data" />
    </template>
  </div>
</template>
