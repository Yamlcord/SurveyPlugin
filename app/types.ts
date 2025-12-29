import { Generated } from "kysely";

export type QuestionTypes = "single_choice" | "multi_choice" | "scale" | "text";

export interface ISurveyDraft {
  questions: Question[];
  activeQuestionId?: string;

  getActiveQuestion(): Question | undefined;
}

export interface Question {
  id: string;
  content: string;
  type: QuestionTypes;
  targets: Target[];
}

export interface Target {
  content: string;
}

export interface SurveyDB {
  survey: {
    id: string;
    slug: string;
    title: string;
    description: string;
    status: "draft" | "active" | "closed";
    created_by: string;
    created_at: Generated<Date>;
    updated_at: Generated<Date>;
  };

  targets: {
    id: string;
    question_id: string;
    key: string;
    label: string;
    created_at: Generated<Date>;
  };

  question: {
    id: string;
    type: QuestionTypes;
    content: string;
    required: Generated<boolean>;
    created_by: string;
    created_at: Generated<Date>;
    updated_at: Generated<Date>;
  };

  survey_responses: {
    id: string;
    survey_id: string;
    user_id: string;
    guild_id: string | null;
    started_at: Generated<Date>;
    finished_at: Date | null;
    completed: Generated<boolean>;
  };

  survey_answers: {
    id: string;
    response_id: string;
    question_id: string;
    value: string;
    created_at: Generated<Date>;
  };
}
