import Sequelize, { DataTypes, Model, Optional } from 'sequelize';
import type { ApplicantMeta, ApplicantMetaCreationAttributes, ApplicantMetaId } from './applicant_meta';
import { ApplicantStatusMetrics } from './applicant_status_metrics';
import type { ApplicantRecusals, ApplicantRecusalsId } from './applicant_recusals';
import type { Application, ApplicationId } from './application';
import type { ApplicationAssignments, ApplicationAssignmentsId } from './application_assignments';
import type { AssessmentHurdle, AssessmentHurdleId } from './assessment_hurdle';

export interface ApplicantAttributes {
  id: string;
  name?: string;
  flag_type?: number;
  flag_message?: string;
  assessment_hurdle_id?: string;
  additional_note?: string;
  created_at?: Date;
  updated_at?: Date;
}

export type ApplicantPk = 'id';
export type ApplicantId = Applicant[ApplicantPk];
export type ApplicantCreationAttributes = Optional<ApplicantAttributes, ApplicantPk>;

export class Applicant extends Model<ApplicantAttributes, ApplicantCreationAttributes> implements ApplicantAttributes {
  id!: string;
  name?: string;
  flag_type?: number;
  flag_message?: string;
  assessment_hurdle_id?: string;
  additional_note?: string;
  created_at?: Date;
  updated_at?: Date;

  // Applicant belongsTo AssessmentHurdle
  AssessmentHurdle!: AssessmentHurdle;
  getAssessmentHurdle!: Sequelize.BelongsToGetAssociationMixin<AssessmentHurdle>;
  setAssessmentHurdle!: Sequelize.BelongsToSetAssociationMixin<AssessmentHurdle, AssessmentHurdleId>;
  createAssessmentHurdle!: Sequelize.BelongsToCreateAssociationMixin<AssessmentHurdle>;
  // Applicant hasOne ApplicantMeta
  ApplicantMetum!: ApplicantMeta;
  getApplicantMetum!: Sequelize.HasOneGetAssociationMixin<ApplicantMeta>;
  setApplicantMetum!: Sequelize.HasOneSetAssociationMixin<ApplicantMeta, ApplicantMetaId>;
  createApplicantMetum!: Sequelize.HasOneCreateAssociationMixin<ApplicantMetaCreationAttributes>;
  // Applicant hasMany ApplicantRecusals
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
  // Applicant hasMany Application
  Applications!: Application[];
  getApplications!: Sequelize.HasManyGetAssociationsMixin<Application>;
  setApplications!: Sequelize.HasManySetAssociationsMixin<Application, ApplicationId>;
  addApplication!: Sequelize.HasManyAddAssociationMixin<Application, ApplicationId>;
  addApplications!: Sequelize.HasManyAddAssociationsMixin<Application, ApplicationId>;
  createApplication!: Sequelize.HasManyCreateAssociationMixin<Application>;
  removeApplication!: Sequelize.HasManyRemoveAssociationMixin<Application, ApplicationId>;
  removeApplications!: Sequelize.HasManyRemoveAssociationsMixin<Application, ApplicationId>;
  hasApplication!: Sequelize.HasManyHasAssociationMixin<Application, ApplicationId>;
  hasApplications!: Sequelize.HasManyHasAssociationsMixin<Application, ApplicationId>;
  countApplications!: Sequelize.HasManyCountAssociationsMixin;
  // Applicant hasMany ApplicationAssignments
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

  // Applicant hasOne ApplicantStatusMetrics
  ApplicantStatusMetrics!: ApplicantStatusMetrics;
  getApplicantStatusMetrics!: Sequelize.HasOneGetAssociationMixin<ApplicantStatusMetrics>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Applicant {
    Applicant.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        flag_type: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        flag_message: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        assessment_hurdle_id: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'assessment_hurdle',
            key: 'id',
          },
        },
        additional_note: {
          type: DataTypes.STRING(1500),
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
        tableName: 'applicant',
        schema: 'public',
        hasTrigger: true,
        timestamps: false,
        freezeTableName: true,
        indexes: [
          {
            name: 'applicant_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      },
    );
    return Applicant;
  }
}
