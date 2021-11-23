import Sequelize, { DataTypes, Model } from 'sequelize';

export interface ApplicationEvaluationAggAttributes {
  application_id?: string;
  applicant_id?: string;
  evaluations_required?: number;
  does_not_meet?: number;
  meets?: number;
  exceeds?: number;
  pending_amendment?: number;
  pending_review?: number;
  assessment_hurdle_id?: string;
  complete?: number;
  evaluations_remaining?: number;
}

export type ApplicationEvaluationAggCreationAttributes = ApplicationEvaluationAggAttributes;

export class ApplicationEvaluationAgg
  extends Model<ApplicationEvaluationAggAttributes, ApplicationEvaluationAggCreationAttributes>
  implements ApplicationEvaluationAggAttributes {
  application_id?: string;
  applicant_id?: string;
  evaluations_required?: number;
  does_not_meet?: number;
  meets?: number;
  exceeds?: number;
  pending_amendment?: number;
  pending_review?: number;
  assessment_hurdle_id?: string;
  complete?: number;
  evaluations_remaining?: number;

  static initModel(sequelize: Sequelize.Sequelize): typeof ApplicationEvaluationAgg {
    ApplicationEvaluationAgg.init(
      {
        application_id: {
          type: DataTypes.UUID,
          allowNull: true,
          primaryKey: true,
        },
        applicant_id: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        assessment_hurdle_id: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        evaluations_required: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        does_not_meet: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        meets: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        exceeds: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        pending_amendment: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        pending_review: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        complete: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        evaluations_remaining: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'application_evaluation_agg',
        schema: 'public',
        timestamps: false,
        freezeTableName: true,
      },
    );
    return ApplicationEvaluationAgg;
  }
}
