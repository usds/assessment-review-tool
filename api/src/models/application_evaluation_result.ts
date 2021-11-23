import Sequelize, { DataTypes, Model, Optional } from 'sequelize';

export interface ApplicationEvaluationResultAttributes {
  application_id?: string;
  application_evaluation_id?: string;
  assessment_hurdle_id?: string;
  evaluation_note?: string;
  evaluator?: string;
  evaluation_approved?: boolean;
  evaluation_result?: string;
  evaluation_review_status?: string;
}

export type ApplicationEvaluationResultCreationAttributes = ApplicationEvaluationResultAttributes;

export class ApplicationEvaluationResult
  extends Model<ApplicationEvaluationResultAttributes, ApplicationEvaluationResultCreationAttributes>
  implements ApplicationEvaluationResultAttributes {
  application_id?: string;
  application_evaluation_id?: string;
  screened_out?: boolean;
  competency_review_status?: string;
  evaluation_note?: string;
  evaluator?: string;
  evaluation_approved?: boolean;
  evaluation_result?: string;
  evaluation_review_status?: string;
  assessment_hurdle_id?: string;

  static initModel(sequelize: Sequelize.Sequelize): typeof ApplicationEvaluationResult {
    ApplicationEvaluationResult.init(
      {
        application_id: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        application_evaluation_id: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        evaluation_note: {
          type: DataTypes.STRING(1500),
          allowNull: true,
        },
        evaluator: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        assessment_hurdle_id: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        evaluation_approved: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        evaluation_result: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        evaluation_review_status: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'application_evaluation_result',
        schema: 'public',
        timestamps: false,
      },
    );
    return ApplicationEvaluationResult;
  }
}
