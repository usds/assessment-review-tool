import Sequelize, { DataTypes, Model, Optional } from 'sequelize';
import { Applicant } from './applicant';
import { Application } from './application';

export type applicantEvaluationStatus = 'incomplete' | 'moves' | 'does not move';
export type applicantReviewStatus = 'pending evaluations' | 'pending amendment' | 'pending review' | 'complete';
export interface ApplicantStatusMetricsAttributes {
  applicant_id?: string;
  name?: string;
  assessment_hurdle_id?: string;
  evaluators?: number;
  recused?: number;
  flagged?: boolean;
  evaluation_status?: string;
  review_status?: string;
  evaluations_required?: number;
}

export type ApplicantStatusMetricsCreationAttributes = ApplicantStatusMetricsAttributes;

export class ApplicantStatusMetrics
  extends Model<ApplicantStatusMetricsAttributes, ApplicantStatusMetricsCreationAttributes>
  implements ApplicantStatusMetricsAttributes
{
  applicant_id?: string;
  name?: string;
  assessment_hurdle_id?: string;
  evaluators?: number;
  recused?: number;
  flagged?: boolean;
  evaluation_status?: string;
  review_status?: string;
  evaluations_required?: number;

  Application!: Application;
  getApplication!: Sequelize.BelongsToGetAssociationMixin<Application>;

  Applicant!: Applicant;
  getApplicant!: Sequelize.BelongsToGetAssociationMixin<Applicant>;

  static initModel(sequelize: Sequelize.Sequelize): typeof ApplicantStatusMetrics {
    ApplicantStatusMetrics.init(
      {
        evaluators: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        recused: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        flagged: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        evaluation_status: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        evaluations_required: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        review_status: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        applicant_id: {
          type: DataTypes.UUID,
          allowNull: false,
          primaryKey: true,
          references: {
            model: 'applicant',
            key: 'id',
          },
        },
        assessment_hurdle_id: {
          type: DataTypes.UUID,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'applicant_status_metrics',
        schema: 'public',
        timestamps: false,
        freezeTableName: true,
      },
    );
    return ApplicantStatusMetrics;
  }
}
