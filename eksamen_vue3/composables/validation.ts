export const getQuestionValidateObj = (quiz: Object, questionId: String) => {
  const question = quiz.questions.find(
    (question: Object) => question.id === questionId
  );
  console.log('question: ', question);
  return question.validation;
};

export const getValidationConfig = (type: string = 'radio') => {
  if (type === 'radio' || type === 'checkbox') {
    return {
      zod: 'string',
      type,
      regex: '',
      isOptional: false,
      errorMessage: '',
    };
  }
};
