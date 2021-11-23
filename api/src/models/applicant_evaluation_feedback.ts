import Sequelize, { DataTypes, Model, Optional } from 'sequelize';
import type { AppUser, AppUserId } from './app_user';

export interface ApplicantEvaluationFeedbackAttributes {
  id: string;
  evaluation_feedback?: string;
  applicant_id?: string;
  evaluator_id?: string;
  feedback_author_id?: string;
  feedback_timestamp?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export type ApplicantEvaluationFeedbackPk = 'id';
export type ApplicantEvaluationFeedbackId = ApplicantEvaluationFeedback[ApplicantEvaluationFeedbackPk];
export type ApplicantEvaluationFeedbackCreationAttributes = Optional<ApplicantEvaluationFeedbackAttributes, ApplicantEvaluationFeedbackPk>;

export class ApplicantEvaluationFeedback
  extends Model<ApplicantEvaluationFeedbackAttributes, ApplicantEvaluationFeedbackCreationAttributes>
  implements ApplicantEvaluationFeedbackAttributes {
  id!: string;
  evaluation_feedback?: string;
  applicant_id?: string;
  evaluator_id?: string;
  feedback_author_id?: string;
  created_at?: Date;
  updated_at?: Date;

  // ApplicantEvaluationFeedback belongsTo AppUser
  AppUser!: AppUser;
  getAppUser!: Sequelize.BelongsToGetAssociationMixin<AppUser>;
  setAppUser!: Sequelize.BelongsToSetAssociationMixin<AppUser, AppUserId>;
  createAppUser!: Sequelize.BelongsToCreateAssociationMixin<AppUser>;

  static initModel(sequelize: Sequelize.Sequelize): typeof ApplicantEvaluationFeedback {
    ApplicantEvaluationFeedback.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        evaluation_feedback: {
          type: DataTypes.STRING(1500),
          allowNull: true,
        },
        applicant_id: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'app_user',
            key: 'id',
          },
          unique: 'unique_app_evaluation_feedback',
        },
        evaluator_id: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'app_user',
            key: 'id',
          },
          unique: 'unique_app_evaluation_feedback',
        },
        feedback_author_id: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'app_user',
            key: 'id',
          },
          unique: 'unique_app_evaluation_feedback',
        },
        feedback_timestamp: {
          type: DataTypes.DATE,
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
        tableName: 'applicant_evaluation_feedback',
        schema: 'public',
        hasTrigger: true,
        timestamps: false,
        indexes: [
          {
            name: 'applicant_evaluation_feedback_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
          {
            name: 'unique_app_evaluation_feedback',
            unique: true,
            fields: [{ name: 'applicant_id' }, { name: 'feedback_author_id' }, { name: 'evaluator_id' }],
          },
        ],
      },
    );
    return ApplicantEvaluationFeedback;
  }
}
