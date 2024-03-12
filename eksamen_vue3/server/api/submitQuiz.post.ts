import { z } from 'zod';
import { serverSupabaseClient } from '#supabase/server';

type num = 'number' | 'bigint';

interface FormDataType {
  [index: number | string]: string;
}

interface ResultType {
  [index: number | string]: {
    isCorrect: boolean;
  };
}

interface QuizScoreType {
  percentageValue: number;
  percentageTemplate: string;
  scoreValue: num;
  scoreTemplate: string;
}

interface AnswerDataType {
  question_id: String;
  value: String;
}

const getQuizScore = (
  numberOfQuestions: num,
  correctCount: num
): QuizScoreType => {
  const percentage: number =
    (Number(correctCount) / Number(numberOfQuestions)) * 100;

  return {
    percentageValue: percentage,
    percentageTemplate: `${percentage}%`,
    scoreValue: correctCount,
    scoreTemplate: `${correctCount} / ${numberOfQuestions}`,
  };
};

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  console.log('body: ', body);

  // get quiz data
  // const { sampleQuiz } = await import('~/data/sampleQuiz');

  const error = {
    hasError: false,
  };
  const result: ResultType = {};

  // Check formData
  let formData: FormDataType = {};
  try {
    formData = JSON.parse(body.formData);
  } catch (err) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid form data received',
      statusText: err,
    });
  }

  // Get all correct answers in a quiz from database (question_id, value)
  const client = await serverSupabaseClient(event);
  const { data: answerData } = await client
    .from('answers')
    .select(`question_id, value`)
    .match({
      is_answer: true,
      quiz_id: body.quizId,
    });
  console.log('answerData: ', answerData);

  let correctCount: number = 0;

  // Loop thru all questions submitted with answers from body.formData
  // { question_key: answer }

  for (const prop in formData) {
    const answer = answerData?.find(
      (ans: AnswerDataType) => ans.question_id === prop
    );

    // compare user`s and actual answer value
    const isCorrect = formData[prop] === answer?.value;

    if (isCorrect) {
      correctCount = correctCount + 1;
    } else {
      error.hasError = true;
    }

    result[prop] = {
      isCorrect,
    };
  }

  // const answers = sampleQuizAnswer.answers;

  // Compare submitted answers from answer file
  // for (const prop in formData) {
  //   const answer = answers.get(prop);
  //   console.log('answer: ', answer);

  //   const schema = z.coerce.string();
  //   const isCorrect = schema.parse(formData[prop]) === answer;

  //   if (isCorrect) {
  //     correctCount = correctCount + 1;
  //   } else {
  //     error.hasError = true;
  //   }

  //   result[prop] = {
  //     isCorrect,
  //   };
  // }

  const score: QuizScoreType = getQuizScore(
    body.numberOfQuestions,
    correctCount
  );

  return {
    result,
    score,
    error,
  };
});
