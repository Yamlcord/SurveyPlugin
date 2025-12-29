import { ISurveyDraft, Question } from "./types";

export class SurveyDraft implements ISurveyDraft {
  questions: Question[];
  activeQuestionId?: string | undefined;

  constructor() {
    this.questions = new Array();
  }

  getActiveQuestion(): Question | undefined {
    const activeQuestion = this.questions.find(
      (question) => question.id === this.activeQuestionId,
    );

    return activeQuestion;
  }
}
