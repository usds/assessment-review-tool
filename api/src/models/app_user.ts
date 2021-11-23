import Sequelize, { DataTypes, Model, Optional } from 'sequelize';
import type { ApplicantRecusals, ApplicantRecusalsId } from './applicant_recusals';
import type { ApplicationAssignments, ApplicationAssignmentsId } from './application_assignments';
import type { ApplicationEvaluation, ApplicationEvaluationId } from './application_evaluation';
import type { ApplicantEvaluationFeedback, ApplicantEvaluationFeedbackId } from './applicant_evaluation_feedback';
import type { AssessmentHurdleUser, AssessmentHurdleUserId } from './assessment_hurdle_user';
import type { CompetencyEvaluation, CompetencyEvaluationId } from './competency_evaluation';

export interface AppUserAttributes {
  id: string;
  email: string;
  name?: string;
  created_at?: Date;
  updated_at?: Date;
}

export type AppUserPk = 'id';
export type AppUserId = AppUser[AppUserPk];
export type AppUserCreationAttributes = Optional<AppUserAttributes, AppUserPk>;

export class AppUser extends Model<AppUserAttributes, AppUserCreationAttributes> implements AppUserAttributes {
  id!: string;
  email!: string;
  name!: string;
  created_at?: Date;
  updated_at?: Date;

  // AppUser hasMany ApplicantRecusals
  ApplicantRecusals!: ApplicantRecusals[];
  getApplicantRecusals!: Sequelize.HasManyGetAssociationsMixin<ApplicantRecusals>;
  setApplicantRecusals!: Sequelize.HasManySetAssociationsMixin<ApplicantRecusals, ApplicantRecusalsId>;
  addApplicantRecusal!: Sequelize.HasManyAddAssociationMixin<ApplicantRecusals, ApplicantRecusalsId>;
  addApplicantRecusals!: Sequelize.HasManyAddAssociationsMixin<ApplicantRecusals, ApplicantRecusalsId>;
  createApplicantRecusal!: Sequelize.HasManyCreateAssociationMixin<ApplicantRecusals>;
  removeApplicantRecusal!: Sequelize.HasManyRemoveAssociationMixin<ApplicantRecusals, ApplicantRecusalsId>;
  removeApplicantRecusals!: Sequelize.HasManyRemoveAssociationsMixin<ApplicantRecusals, ApplicantRecusalsId>;
  hasApplicantRecusal!: Sequelize.HasManyHasAssociationMixin<ApplicantRecusals, ApplicantRecusalsId>;
  hasApplicantRecusals!: Sequelize.HasManyHasAssociationsMixin<ApplicantRecusals, ApplicantRecusalsId>;
  countApplicantRecusals!: Sequelize.HasManyCountAssociationsMixin;
  // AppUser hasMany ApplicationAssignments
  ApplicationAssignments!: ApplicationAssignments[];
  getApplicationAssignments!: Sequelize.HasManyGetAssociationsMixin<ApplicationAssignments>;
  setApplicationAssignments!: Sequelize.HasManySetAssociationsMixin<ApplicationAssignments, ApplicationAssignmentsId>;
  addApplicationAssignment!: Sequelize.HasManyAddAssociationMixin<ApplicationAssignments, ApplicationAssignmentsId>;
  addApplicationAssignments!: Sequelize.HasManyAddAssociationsMixin<ApplicationAssignments, ApplicationAssignmentsId>;
  createApplicationAssignment!: Sequelize.HasManyCreateAssociationMixin<ApplicationAssignments>;
  removeApplicationAssignment!: Sequelize.HasManyRemoveAssociationMixin<ApplicationAssignments, ApplicationAssignmentsId>;
  removeApplicationAssignments!: Sequelize.HasManyRemoveAssociationsMixin<ApplicationAssignments, ApplicationAssignmentsId>;
  hasApplicationAssignment!: Sequelize.HasManyHasAssociationMixin<ApplicationAssignments, ApplicationAssignmentsId>;
  hasApplicationAssignments!: Sequelize.HasManyHasAssociationsMixin<ApplicationAssignments, ApplicationAssignmentsId>;
  countApplicationAssignments!: Sequelize.HasManyCountAssociationsMixin;
  // AppUser hasMany ApplicationEvaluation
  ApplicationEvaluations!: ApplicationEvaluation[];
  getApplicationEvaluations!: Sequelize.HasManyGetAssociationsMixin<ApplicationEvaluation>;
  setApplicationEvaluations!: Sequelize.HasManySetAssociationsMixin<ApplicationEvaluation, ApplicationEvaluationId>;
  addApplicationEvaluation!: Sequelize.HasManyAddAssociationMixin<ApplicationEvaluation, ApplicationEvaluationId>;
  addApplicationEvaluations!: Sequelize.HasManyAddAssociationsMixin<ApplicationEvaluation, ApplicationEvaluationId>;
  createApplicationEvaluation!: Sequelize.HasManyCreateAssociationMixin<ApplicationEvaluation>;
  removeApplicationEvaluation!: Sequelize.HasManyRemoveAssociationMixin<ApplicationEvaluation, ApplicationEvaluationId>;
  removeApplicationEvaluations!: Sequelize.HasManyRemoveAssociationsMixin<ApplicationEvaluation, ApplicationEvaluationId>;
  hasApplicationEvaluation!: Sequelize.HasManyHasAssociationMixin<ApplicationEvaluation, ApplicationEvaluationId>;
  hasApplicationEvaluations!: Sequelize.HasManyHasAssociationsMixin<ApplicationEvaluation, ApplicationEvaluationId>;
  countApplicationEvaluations!: Sequelize.HasManyCountAssociationsMixin;
  // AppUser hasMany ApplicantEvaluationFeedback
  ApplicantEvaluationFeedbacks!: ApplicantEvaluationFeedback[];
  getApplicantEvaluationFeedbacks!: Sequelize.HasManyGetAssociationsMixin<ApplicantEvaluationFeedback>;
  setApplicantEvaluationFeedbacks!: Sequelize.HasManySetAssociationsMixin<ApplicantEvaluationFeedback, ApplicantEvaluationFeedbackId>;
  addApplicantEvaluationFeedback!: Sequelize.HasManyAddAssociationMixin<ApplicantEvaluationFeedback, ApplicantEvaluationFeedbackId>;
  addApplicantEvaluationFeedbacks!: Sequelize.HasManyAddAssociationsMixin<ApplicantEvaluationFeedback, ApplicantEvaluationFeedbackId>;
  createApplicantEvaluationFeedback!: Sequelize.HasManyCreateAssociationMixin<ApplicantEvaluationFeedback>;
  removeApplicantEvaluationFeedback!: Sequelize.HasManyRemoveAssociationMixin<ApplicantEvaluationFeedback, ApplicantEvaluationFeedbackId>;
  removeApplicantEvaluationFeedbacks!: Sequelize.HasManyRemoveAssociationsMixin<ApplicantEvaluationFeedback, ApplicantEvaluationFeedbackId>;
  hasApplicantEvaluationFeedback!: Sequelize.HasManyHasAssociationMixin<ApplicantEvaluationFeedback, ApplicantEvaluationFeedbackId>;
  hasApplicantEvaluationFeedbacks!: Sequelize.HasManyHasAssociationsMixin<ApplicantEvaluationFeedback, ApplicantEvaluationFeedbackId>;
  countApplicantEvaluationFeedbacks!: Sequelize.HasManyCountAssociationsMixin;

  // AppUser hasMany AssessmentHurdleUser
  AssessmentHurdleUsers!: AssessmentHurdleUser[];
  getAssessmentHurdleUsers!: Sequelize.HasManyGetAssociationsMixin<AssessmentHurdleUser>;
  setAssessmentHurdleUsers!: Sequelize.HasManySetAssociationsMixin<AssessmentHurdleUser, AssessmentHurdleUserId>;
  addAssessmentHurdleUser!: Sequelize.HasManyAddAssociationMixin<AssessmentHurdleUser, AssessmentHurdleUserId>;
  addAssessmentHurdleUsers!: Sequelize.HasManyAddAssociationsMixin<AssessmentHurdleUser, AssessmentHurdleUserId>;
  createAssessmentHurdleUser!: Sequelize.HasManyCreateAssociationMixin<AssessmentHurdleUser>;
  removeAssessmentHurdleUser!: Sequelize.HasManyRemoveAssociationMixin<AssessmentHurdleUser, AssessmentHurdleUserId>;
  removeAssessmentHurdleUsers!: Sequelize.HasManyRemoveAssociationsMixin<AssessmentHurdleUser, AssessmentHurdleUserId>;
  hasAssessmentHurdleUser!: Sequelize.HasManyHasAssociationMixin<AssessmentHurdleUser, AssessmentHurdleUserId>;
  hasAssessmentHurdleUsers!: Sequelize.HasManyHasAssociationsMixin<AssessmentHurdleUser, AssessmentHurdleUserId>;
  countAssessmentHurdleUsers!: Sequelize.HasManyCountAssociationsMixin;
  // AppUser hasMany CompetencyEvaluation
  CompetencyEvaluations!: CompetencyEvaluation[];
  getCompetencyEvaluations!: Sequelize.HasManyGetAssociationsMixin<CompetencyEvaluation>;
  setCompetencyEvaluations!: Sequelize.HasManySetAssociationsMixin<CompetencyEvaluation, CompetencyEvaluationId>;
  addCompetencyEvaluation!: Sequelize.HasManyAddAssociationMixin<CompetencyEvaluation, CompetencyEvaluationId>;
  addCompetencyEvaluations!: Sequelize.HasManyAddAssociationsMixin<CompetencyEvaluation, CompetencyEvaluationId>;
  createCompetencyEvaluation!: Sequelize.HasManyCreateAssociationMixin<CompetencyEvaluation>;
  removeCompetencyEvaluation!: Sequelize.HasManyRemoveAssociationMixin<CompetencyEvaluation, CompetencyEvaluationId>;
  removeCompetencyEvaluations!: Sequelize.HasManyRemoveAssociationsMixin<CompetencyEvaluation, CompetencyEvaluationId>;
  hasCompetencyEvaluation!: Sequelize.HasManyHasAssociationMixin<CompetencyEvaluation, CompetencyEvaluationId>;
  hasCompetencyEvaluations!: Sequelize.HasManyHasAssociationsMixin<CompetencyEvaluation, CompetencyEvaluationId>;
  countCompetencyEvaluations!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof AppUser {
    AppUser.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: 'unique_email',
        },
        name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.fn('now'),
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: true,
          defaultValue: Sequelize.fn('now'),
        },
      },
      {
        sequelize,
        tableName: 'app_user',
        schema: 'public',
        hasTrigger: true,
        timestamps: false,
        indexes: [
          {
            name: 'app_user_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
          {
            name: 'unique_email',
            unique: true,
            fields: [{ name: 'email' }],
          },
        ],
      },
    );
    return AppUser;
  }
}
