import { AssessmentHurdle } from '../models/assessment_hurdle';
import { Applicant } from '../models/applicant';

export class CompetencyHrEvaluationDto {
  evaluation_note?: string;
  competency_name!: string;
  competency_selector_name!: string;
  sort_order!: number;
  id!: string;
}

export class ApplicantFeedbackDto {
  applicantFeedbackId!: string;
  evaluationFeedback!: string;
}
export class ApplicationHrEvaluationDto {
  applicationIds!: string[];
  approved!: boolean;
  feedback!: ApplicantFeedbackDto;
  evaluation_note!: string;
  evaluator!: string;
  applicantName!: string;
  applicantId!: string;
  applicantEvaluationKey!: string;
  created_at!: string;
  competencyEvaluations!: CompetencyHrEvaluationDto[];
}
export default class HrDisplayDto {
  public assessmentHurdle!: AssessmentHurdle;
  public flaggedApplicants!: Applicant[];
  public applicantEvaluations!: {
    [applicantEvaluationKey: string]: ApplicationHrEvaluationDto;
  };
}
