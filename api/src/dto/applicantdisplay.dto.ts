import { CompetencySelectors } from '../models/competency_selectors';
import { Applicant } from '../models/applicant';
import { Specialty } from '../models/specialty';
import { ApplicationEvaluation } from '../models/application_evaluation';

export class CompetencyEvaluationDto {
  competencyEvaluationId!: string;
  evaluation_note?: string;
  evaluator!: string;
  competency_id!: string;
  competency_selector_id!: string;
  updated_at!: Date;
}
export class CompetencyJustification {
  competencyEvaluationId!: string;
  justification?: string;
  evaluator!: string;
  competency_id!: string;
  competency_selector_id!: string;
  updated_at!: Date;
}

export class CompetencyWithSelectors {
  id!: string;
  name!: string;
  local_id!: string;
  assessment_hurdle_id!: string;
  definition!: string;
  required_proficiency_definition!: string;
  display_type!: number;
  screen_out!: boolean;
  updated_at!: Date;
  sort_order!: number;
  selectors!: CompetencySelectors[];
}

type SpecialtyToCompetencyIds = {
  [specialty: string]: string[];
};

type CompetencyIdToEvaluation = {
  [competencyId: string]: CompetencyEvaluationDto;
};

export default class ApplicantDisplayDto {
  public applicant!: Applicant;
  public applicantNotes!: string[] | null;
  public feedback!: string;
  public feedbackTimestamp!: Date;
  // Really these should all be passed back as objects, but leaving it to keep the idiom the same.
  public specialties!: Specialty[];
  public competencies!: CompetencyWithSelectors[];
  public competencyJustifications!: CompetencyJustification[];
  public specialtyCompetencyMap!: SpecialtyToCompetencyIds;
  public applicationEvaluations!: ApplicationEvaluation[];
  public competencyEvaluations!: CompetencyIdToEvaluation;
  public applicantEvaluationType!: string;
  public isTieBreaker!: boolean;
}
