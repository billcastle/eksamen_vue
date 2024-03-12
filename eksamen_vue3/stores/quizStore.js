import { defineStore } from 'pinia';
import { sampleQuiz } from '~/data/sampleQuiz';

export const useQuizStore = defineStore('quizStore', {
  state: () => ({ quiz: sampleQuiz }),
  getters: {
    getQuiz() {
      return this.quiz;
    },
    quizName() {
      return this.quiz.quizName;
    },
    questions() {
      return this.quiz.questions;
    },
  },
  actions: {
    setQuiz(quiz = {}) {
      this.quiz = quiz;
    },
    questionAnswer(questionId, answerId) {
      const questionData = this.quiz.find(
        (question) => question.id === questionId
      );
      const answerData = questionData.answers.find(
        (answer) => answer.id === answerId
      );
      return answerData;
    },
  },
});
