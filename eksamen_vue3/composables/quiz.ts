const client = useSupabaseClient();

export const getAllQuiz = async (count = 12) => {
  const { data, error } = await useAsyncData('quiz', async () => {
    const { data } = await client
      .from('public_quiz')
      .select(`name, questions:public_questions (id, name, answers(id, value))`)
      .limit(count);

    return data;
  });

  return {
    data,
    error,
  };
};
