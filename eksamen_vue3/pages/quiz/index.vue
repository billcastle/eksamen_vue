<script setup lang="ts">
const client = useSupabaseClient();

const { data, error } = await useAsyncData('quiz', async () => {
  const { data } = await client
    .from('public_quiz')
    .select(`name, id, id_short, description, label, created_at, img_url`)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  return data;
});
</script>

<template lang="">
  <div class="flex">
    <QuizList :list="data" />
  </div>
</template>
