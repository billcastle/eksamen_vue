interface AnswerType {
  id: number | string;
  type: string;
  label: string;
  value: number | string;
  isAnswer: boolean;
}

interface QuestionType {
  isActive: boolean;
  questionName: string;
  id: number | string;
  answerType: string;
  validation: {
    isValidate: boolean;
    isOptional: boolean;
    type: string;
    errorMessage: string;
    zod: string;
    regex: string;
  };
  answers: Array<AnswerType>;
  answer: string;
}

interface QuizType {
  quizName: string;
  id: number | string;
  category: Array<string>;
  label: Array<string>;
  description: string;
  created_at: number | string;
  config: {
    allowSkipping: boolean;
  };
  validation: {
    errorMessage: string;
  };
  numberOfQuestions: number;
  questions: Array<QuestionType>;
}

export const sampleQuiz: QuizType = {
  quizName: 'Sample quiz name',
  id: 'asdasdassa',
  category: ['countries'],
  label: ['facts'],
  created_at: '1691407093761',
  description: 'See how well do you know world countries',
  config: {
    allowSkipping: true,
  },
  validation: {
    errorMessage: '',
  },
  numberOfQuestions: 2,
  questions: [
    {
      isActive: true,
      questionName: 'What is the capital of Taiwan?',
      id: '123134',
      answerType: 'radio',
      validation: {
        isValidate: true,
        isOptional: false,
        type: 'radio',
        errorMessage: '',
        zod: 'string',
        regex: '',
      },
      answers: [
        {
          id: 'radio1',
          type: 'radio',
          label: 'Taipei',
          value: 'radio1',
          isAnswer: true,
        },
        {
          id: 'radio2',
          type: 'radio',
          label: 'Tokyo',
          value: 'radio2',
          isAnswer: false,
        },
        {
          id: 'radio3',
          type: 'radio',
          label: 'Beijing',
          value: 'radio3',
          isAnswer: false,
        },
        {
          id: 'radio4',
          type: 'radio',
          label: 'Seoul',
          value: 'radio4',
          isAnswer: false,
        },
      ],
      answer: 'radio1',
    },
    {
      isActive: true,
      questionName: 'What is the capital of The Philippines?',
      answerType: 'radio',
      id: '112341',
      validation: {
        isValidate: true,
        isOptional: false,
        type: 'radio',
        errorMessage: '',
        zod: 'string|number',
        regex: '',
      },
      answers: [
        {
          id: '1',
          type: 'radio',
          label: 'Cebu',
          value: '1',
          isAnswer: false,
        },
        {
          id: '2',
          type: 'radio',
          label: 'Manila',
          value: '2',
          isAnswer: true,
        },
        {
          id: '3',
          type: 'radio',
          label: 'Makati',
          value: '3',
          isAnswer: false,
        },
        {
          id: '4',
          type: 'radio',
          label: 'Quezon City',
          value: '4',
          isAnswer: false,
        },
      ],
      answer: '2',
    },
  ],
};
