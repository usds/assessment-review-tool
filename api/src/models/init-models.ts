import type { Sequelize, Model } from 'sequelize';
import { AppUser } from './app_user';
import type { AppUserAttributes, AppUserCreationAttributes } from './app_user';
import { Applicant } from './applicant';
import type { ApplicantAttributes, ApplicantCreationAttributes } from './applicant';
import { ApplicantMeta } from './applicant_meta';
import type { ApplicantMetaAttributes, ApplicantMetaCreationAttributes } from './applicant_meta';
import { ApplicantRecusals } from './applicant_recusals';
import type { ApplicantRecusalsAttributes, ApplicantRecusalsCreationAttributes } from './applicant_recusals';
import { ApplicantStatusMetrics } from './applicant_status_metrics';
import type { ApplicantStatusMetricsAttributes, ApplicantStatusMetricsCreationAttributes } from './applicant_status_metrics';
import { Application } from './application';
import type { ApplicationAttributes, ApplicationCreationAttributes } from './application';
import { ApplicationAssignments } from './application_assignments';
import type { ApplicationAssignmentsAttributes, ApplicationAssignmentsCreationAttributes } from './application_assignments';
import { ApplicationEvaluation } from './application_evaluation';
import type { ApplicationEvaluationAttributes, ApplicationEvaluationCreationAttributes } from './application_evaluation';
import { ApplicationEvaluationCompetency } from './application_evaluation_competency';
import type {
  ApplicationEvaluationCompetencyAttributes,
  ApplicationEvaluationCompetencyCreationAttributes,
} from './application_evaluation_competency';
import { ApplicantEvaluationFeedback } from './applicant_evaluation_feedback';
import type { ApplicantEvaluationFeedbackAttributes, ApplicantEvaluationFeedbackCreationAttributes } from './applicant_evaluation_feedback';
import { ApplicationEvaluationPoints } from './application_evaluation_points';
import type { ApplicationEvaluationPointsAttributes, ApplicationEvaluationPointsCreationAttributes } from './application_evaluation_points';
import { CompetencyEvaluationCount } from './competency_evaluation_count';
import type { CompetencyEvaluationCountAttributes, CompetencyEvaluationCountCreationAttributes } from './competency_evaluation_count';
import { ApplicantApplicationEvaluationNotes } from './applicant_application_evaluation_notes';
import {
  ApplicantApplicationEvaluationNotesAttributes,
  ApplicantApplicationEvaluationNotesCreationAttributes,
} from './applicant_application_evaluation_notes';
import { ApplicantQueue } from './applicant_queue';
import type { ApplicantQueueAttributes, ApplicantQueueCreationAttributes } from './applicant_queue';
import { ApplicationEvaluationResult } from './application_evaluation_result';
import type { ApplicationEvaluationResultAttributes, ApplicationEvaluationResultCreationAttributes } from './application_evaluation_result';
import { ApplicationMeta } from './application_meta';
import type { ApplicationMetaAttributes, ApplicationMetaCreationAttributes } from './application_meta';
import { EvaluatorMetrics } from './evaluator_metrics';
import { ReviewerMetrics } from './reviewer_metrics';
import { ApplicationEvaluationAgg } from './application_evaluation_agg';
import type { ApplicationEvaluationAggAttributes, ApplicationEvaluationAggCreationAttributes } from './application_evaluation_agg';
import type { EvaluatorMetricsAttributes, EvaluatorMetricsCreationAttributes } from './evaluator_metrics';
import type { ReviewerMetricsAttributes, ReviewerMetricsCreationAttributes } from './reviewer_metrics';
import { ApplicationStatusAgg } from './application_status_agg';
import type { ApplicationStatusAggAttributes, ApplicationStatusAggCreationAttributes } from './application_status_agg';
import { AssessmentHurdle } from './assessment_hurdle';
import type { AssessmentHurdleAttributes, AssessmentHurdleCreationAttributes } from './assessment_hurdle';
import { AssessmentHurdleMeta } from './assessment_hurdle_meta';
import type { AssessmentHurdleMetaAttributes, AssessmentHurdleMetaCreationAttributes } from './assessment_hurdle_meta';
import { AssessmentHurdleUser } from './assessment_hurdle_user';
import type { AssessmentHurdleUserAttributes, AssessmentHurdleUserCreationAttributes } from './assessment_hurdle_user';
import { Competency } from './competency';
import type { CompetencyAttributes, CompetencyCreationAttributes } from './competency';
import { CompetencyEvaluation } from './competency_evaluation';
import type { CompetencyEvaluationAttributes, CompetencyEvaluationCreationAttributes } from './competency_evaluation';
import { CompetencySelectors } from './competency_selectors';
import type { CompetencySelectorsAttributes, CompetencySelectorsCreationAttributes } from './competency_selectors';
import { Specialty } from './specialty';
import type { SpecialtyAttributes, SpecialtyCreationAttributes } from './specialty';
import { SpecialtyCompetencies } from './specialty_competencies';
import type { SpecialtyCompetenciesAttributes, SpecialtyCompetenciesCreationAttributes } from './specialty_competencies';

export {
  AppUser,
  Applicant,
  ApplicantMeta,
  ApplicantRecusals,
  ApplicantStatusMetrics,
  Application,
  ApplicationAssignments,
  ApplicationEvaluation,
  ApplicationEvaluationCompetency,
  ApplicantEvaluationFeedback,
  ApplicationEvaluationPoints,
  CompetencyEvaluationCount,
  ApplicantApplicationEvaluationNotes,
  ApplicantQueue,
  ApplicationEvaluationResult,
  ApplicationMeta,
  ApplicationEvaluationAgg,
  EvaluatorMetrics,
  ReviewerMetrics,
  ApplicationStatusAgg,
  AssessmentHurdle,
  AssessmentHurdleMeta,
  AssessmentHurdleUser,
  Competency,
  CompetencyEvaluation,
  CompetencySelectors,
  Specialty,
  SpecialtyCompetencies,
};

export type {
  AppUserAttributes,
  AppUserCreationAttributes,
  ApplicantAttributes,
  ApplicantCreationAttributes,
  ApplicantMetaAttributes,
  ApplicantMetaCreationAttributes,
  ApplicantRecusalsAttributes,
  ApplicantRecusalsCreationAttributes,
  ApplicantStatusMetricsAttributes,
  ApplicantStatusMetricsCreationAttributes,
  ApplicationAttributes,
  ApplicationCreationAttributes,
  ApplicationAssignmentsAttributes,
  ApplicationAssignmentsCreationAttributes,
  ApplicationEvaluationAttributes,
  ApplicationEvaluationCreationAttributes,
  ApplicationEvaluationCompetencyAttributes,
  ApplicationEvaluationCompetencyCreationAttributes,
  ApplicantEvaluationFeedbackAttributes,
  ApplicantEvaluationFeedbackCreationAttributes,
  ApplicationEvaluationPointsAttributes,
  ApplicationEvaluationPointsCreationAttributes,
  CompetencyEvaluationCountAttributes,
  CompetencyEvaluationCountCreationAttributes,
  ApplicantApplicationEvaluationNotesAttributes,
  ApplicantApplicationEvaluationNotesCreationAttributes,
  ApplicantQueueAttributes,
  ApplicantQueueCreationAttributes,
  ApplicationEvaluationResultAttributes,
  ApplicationEvaluationResultCreationAttributes,
  ApplicationMetaAttributes,
  ApplicationMetaCreationAttributes,
  ApplicationEvaluationAggAttributes,
  ApplicationEvaluationAggCreationAttributes,
  EvaluatorMetricsAttributes,
  EvaluatorMetricsCreationAttributes,
  ReviewerMetricsAttributes,
  ReviewerMetricsCreationAttributes,
  ApplicationStatusAggAttributes,
  ApplicationStatusAggCreationAttributes,
  AssessmentHurdleAttributes,
  AssessmentHurdleCreationAttributes,
  AssessmentHurdleMetaAttributes,
  AssessmentHurdleMetaCreationAttributes,
  AssessmentHurdleUserAttributes,
  AssessmentHurdleUserCreationAttributes,
  CompetencyAttributes,
  CompetencyCreationAttributes,
  CompetencyEvaluationAttributes,
  CompetencyEvaluationCreationAttributes,
  CompetencySelectorsAttributes,
  CompetencySelectorsCreationAttributes,
  SpecialtyAttributes,
  SpecialtyCreationAttributes,
  SpecialtyCompetenciesAttributes,
  SpecialtyCompetenciesCreationAttributes,
};

export function initModels(sequelize: Sequelize) {
  AppUser.initModel(sequelize);
  Applicant.initModel(sequelize);
  ApplicantMeta.initModel(sequelize);
  ApplicantRecusals.initModel(sequelize);
  ApplicantStatusMetrics.initModel(sequelize);
  Application.initModel(sequelize);
  ApplicationAssignments.initModel(sequelize);
  ApplicationEvaluation.initModel(sequelize);
  ApplicationEvaluationCompetency.initModel(sequelize);
  ApplicantEvaluationFeedback.initModel(sequelize);
  ApplicationEvaluationPoints.initModel(sequelize);
  CompetencyEvaluationCount.initModel(sequelize);
  ApplicantApplicationEvaluationNotes.initModel(sequelize);
  ApplicantQueue.initModel(sequelize);
  ApplicationEvaluationResult.initModel(sequelize);
  ApplicationMeta.initModel(sequelize);
  ApplicationEvaluationAgg.initModel(sequelize);
  EvaluatorMetrics.initModel(sequelize);
  ReviewerMetrics.initModel(sequelize);
  ApplicationStatusAgg.initModel(sequelize);
  AssessmentHurdle.initModel(sequelize);
  AssessmentHurdleMeta.initModel(sequelize);
  AssessmentHurdleUser.initModel(sequelize);
  Competency.initModel(sequelize);
  CompetencyEvaluation.initModel(sequelize);
  CompetencySelectors.initModel(sequelize);
  Specialty.initModel(sequelize);
  SpecialtyCompetencies.initModel(sequelize);

  Applicant.belongsTo(AssessmentHurdle, { foreignKey: 'assessment_hurdle_id' });
  AssessmentHurdle.hasMany(Applicant, { foreignKey: 'assessment_hurdle_id' });
  ApplicantMeta.belongsTo(Applicant, { foreignKey: 'applicant_id' });
  Applicant.hasOne(ApplicantMeta, { foreignKey: 'applicant_id' });
  ApplicantRecusals.belongsTo(Applicant, { foreignKey: 'applicant_id' });
  Applicant.hasMany(ApplicantRecusals, { foreignKey: 'applicant_id' });
  ApplicantRecusals.belongsTo(AppUser, { foreignKey: 'recused_evaluator_id' });
  AppUser.hasMany(ApplicantRecusals, { foreignKey: 'recused_evaluator_id' });
  Application.belongsTo(Applicant, { foreignKey: 'applicant_id' });
  Applicant.hasMany(Application, { foreignKey: 'applicant_id' });
  Application.belongsTo(Specialty, { foreignKey: 'specialty_id' });
  Specialty.hasMany(Application, { foreignKey: 'specialty_id' });
  ApplicationAssignments.belongsTo(Applicant, { foreignKey: 'applicant_id' });
  Applicant.hasMany(ApplicationAssignments, { foreignKey: 'applicant_id' });
  ApplicationAssignments.belongsTo(AppUser, { foreignKey: 'evaluator_id' });
  AppUser.hasMany(ApplicationAssignments, { foreignKey: 'evaluator_id' });
  ApplicationEvaluation.belongsTo(Application, { foreignKey: 'application_id' });
  Application.hasMany(ApplicationEvaluation, { foreignKey: 'application_id' });
  ApplicationEvaluation.belongsTo(AppUser, { foreignKey: 'approver_id', as: 'Approver' });
  AppUser.hasMany(ApplicationEvaluation, { foreignKey: 'approver_id' });
  ApplicationEvaluation.belongsTo(AppUser, { foreignKey: 'evaluator', as: 'Evaluator' });
  AppUser.hasMany(ApplicationEvaluation, { foreignKey: 'evaluator' });
  ApplicationEvaluationCompetency.belongsTo(ApplicationEvaluation, { foreignKey: 'application_evaluation_id' });
  ApplicationEvaluation.hasMany(ApplicationEvaluationCompetency, { foreignKey: 'application_evaluation_id' });
  ApplicationEvaluationCompetency.belongsTo(CompetencyEvaluation, { foreignKey: 'competency_evaluation_id' });
  CompetencyEvaluation.hasMany(ApplicationEvaluationCompetency, { foreignKey: 'competency_evaluation_id' });

  ApplicantEvaluationFeedback.belongsTo(AppUser, { foreignKey: 'applicant_id' });
  AppUser.hasMany(ApplicantEvaluationFeedback, { foreignKey: 'applicant_id' });

  CompetencyEvaluation.belongsTo(Applicant, { foreignKey: 'applicant' });
  Applicant.hasMany(CompetencyEvaluation, { foreignKey: 'applicant' });

  ApplicantEvaluationFeedback.belongsTo(AppUser, { foreignKey: 'evaluator_id' });
  AppUser.hasMany(ApplicantEvaluationFeedback, { foreignKey: 'evaluator_id' });
  ApplicantEvaluationFeedback.belongsTo(AppUser, { foreignKey: 'feedback_author_id' });
  AppUser.hasMany(ApplicantEvaluationFeedback, { foreignKey: 'feedback_author_id' });
  ApplicationMeta.belongsTo(Application, { foreignKey: 'application_id' });
  Application.hasOne(ApplicationMeta, { foreignKey: 'application_id' });
  AssessmentHurdleMeta.belongsTo(AssessmentHurdle, { foreignKey: 'assessment_hurdle_id' });
  AssessmentHurdle.hasOne(AssessmentHurdleMeta, { foreignKey: 'assessment_hurdle_id' });
  AssessmentHurdleUser.belongsTo(AppUser, { foreignKey: 'app_user_id' });
  AppUser.hasMany(AssessmentHurdleUser, { foreignKey: 'app_user_id' });
  AssessmentHurdleUser.belongsTo(AssessmentHurdle, { foreignKey: 'assessment_hurdle_id' });
  AssessmentHurdle.hasMany(AssessmentHurdleUser, { foreignKey: 'assessment_hurdle_id' });
  Competency.belongsTo(AssessmentHurdle, { foreignKey: 'assessment_hurdle_id' });
  AssessmentHurdle.hasMany(Competency, { foreignKey: 'assessment_hurdle_id' });
  CompetencyEvaluation.belongsTo(Competency, { foreignKey: 'competency_id' });
  Competency.hasMany(CompetencyEvaluation, { foreignKey: 'competency_id' });
  CompetencyEvaluation.belongsTo(CompetencySelectors, { foreignKey: 'competency_selector_id' });
  CompetencySelectors.hasMany(CompetencyEvaluation, { foreignKey: 'competency_selector_id' });
  CompetencyEvaluation.belongsTo(AppUser, { foreignKey: 'evaluator' });
  AppUser.hasMany(CompetencyEvaluation, { foreignKey: 'evaluator' });
  CompetencySelectors.belongsTo(Competency, { foreignKey: 'competency_id' });
  Competency.hasMany(CompetencySelectors, { foreignKey: 'competency_id' });
  Specialty.belongsTo(AssessmentHurdle, { foreignKey: 'assessment_hurdle_id' });
  AssessmentHurdle.hasMany(Specialty, { foreignKey: 'assessment_hurdle_id' });
  SpecialtyCompetencies.belongsTo(Competency, { foreignKey: 'competency_id' });
  Competency.hasMany(SpecialtyCompetencies, { foreignKey: 'competency_id' });
  SpecialtyCompetencies.belongsTo(Specialty, { foreignKey: 'specialty_id' });
  Specialty.hasMany(SpecialtyCompetencies, { foreignKey: 'specialty_id' });

  Applicant.belongsTo(ApplicantEvaluationFeedback, { foreignKey: 'id', targetKey: 'applicant_id' });
  ApplicantEvaluationFeedback.hasOne(Applicant, { foreignKey: 'id', sourceKey: 'applicant_id' });

  ApplicationAssignments.belongsTo(AssessmentHurdle, { foreignKey: 'assessment_hurdle_id' });
  AssessmentHurdle.hasMany(ApplicationAssignments, { foreignKey: 'assessment_hurdle_id' });

  Application.belongsTo(ApplicationAssignments, { foreignKey: 'id', targetKey: 'applicant_id' });
  ApplicationAssignments.hasOne(Application, { foreignKey: 'id', sourceKey: 'applicant_id' });

  Applicant.belongsTo(ApplicantStatusMetrics, { foreignKey: 'id', targetKey: 'applicant_id' });
  ApplicantStatusMetrics.hasOne(Applicant, { foreignKey: 'id', sourceKey: 'applicant_id' });

  ApplicationEvaluation.belongsTo(ApplicationEvaluationPoints, { foreignKey: 'id', targetKey: 'application_evaluation_id' });
  ApplicationEvaluationPoints.hasOne(ApplicationEvaluation, { foreignKey: 'id', sourceKey: 'application_evaluation_id' });

  // CompetencyEvaluation.belongsTo(CompetencyEvaluationCount, { foreignKey: 'id', targetKey: 'competency_evaluation_id' });
  // CompetencyEvaluationCount.hasOne(CompetencyEvaluation, { foreignKey: 'id', sourceKey: 'competency_evaluation_id' });
  return {
    AppUser: AppUser,
    Applicant: Applicant,
    ApplicantMeta: ApplicantMeta,
    ApplicantRecusals: ApplicantRecusals,
    ApplicantStatusMetrics,
    Application: Application,
    ApplicationAssignments: ApplicationAssignments,
    ApplicationEvaluation: ApplicationEvaluation,
    ApplicationEvaluationCompetency: ApplicationEvaluationCompetency,
    ApplicantEvaluationFeedback: ApplicantEvaluationFeedback,
    ApplicationEvaluationPoints: ApplicationEvaluationPoints,
    CompetencyEvaluationCount: CompetencyEvaluationCount,
    ApplicantApplicationEvaluationNotes: ApplicantApplicationEvaluationNotes,
    ApplicantQueue: ApplicantQueue,
    ApplicationEvaluationResult: ApplicationEvaluationResult,
    ApplicationMeta: ApplicationMeta,
    ApplicationEvaluationAgg,
    EvaluatorMetrics,
    ReviewerMetrics,
    ApplicationStatusAgg,
    AssessmentHurdle: AssessmentHurdle,
    AssessmentHurdleMeta: AssessmentHurdleMeta,
    AssessmentHurdleUser: AssessmentHurdleUser,
    Competency: Competency,
    CompetencyEvaluation: CompetencyEvaluation,
    CompetencySelectors: CompetencySelectors,
    Specialty: Specialty,
    SpecialtyCompetencies: SpecialtyCompetencies,
  };
}
