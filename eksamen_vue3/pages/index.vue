<script setup lang="ts">
const client = useSupabaseClient();
const pizza = ref();

const { data, error } = await useAsyncData('quiz', async () => {
  const { data } = await client
    .from('public_quiz')
    .select(
      `name, id, id_short, description, label, created_at, img_url, is_active`
    )
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  return data;
});
</script>

<template>
  <div
    class="bg-surface-100 dark:bg-surface-900 flex items-center justify-center min-h-screen p-10 text-white"
  >
    <div class="container mx-auto">
      <div class="card flex flex-wrap justify-content-center gap-3">
        <div class="flex align-items-center">
          <Checkbox
            v-model="pizza"
            inputId="ingredient1"
            name="pizza"
            value="Cheese"
          />
          <label for="ingredient1" class="ml-2">Cheese</label>
        </div>
      </div>

      <div class="mb-10 card flex justify-content-center text-white">
        <div class="mb-10 w-14rem">
          <div class="mb-12 flex">
            <template v-if="error">
              <span>
                Oops! Error getting quizzes.. Reload the page to try again.
              </span>
            </template>
            <template v-else>
              <QuizList :list="data" />
            </template>
          </div>

          <div class="text-center">
            <NuxtLink to="/quiz">
              <Button label="Browse Quizzes" icon="pi pi-check" />
            </NuxtLink>
          </div>
        </div>
      </div>

      <NuxtLink to="/generator">
        <Button label="Generator" icon="pi pi-check" />
      </NuxtLink>
    </div>
  </div>
</template>
