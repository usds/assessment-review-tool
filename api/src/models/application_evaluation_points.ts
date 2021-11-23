import Sequelize, { DataTypes, Model, Optional } from 'sequelize';
import { ApplicationEvaluation } from './application_evaluation';

export interface ApplicationEvaluationPointsAttributes {
  total_points?: number;
  screened_out?: boolean;
  competency_review_status?: string;
  application_evaluation_id?: string;
  evaluator?: string;
  assessment_hurdle_id?: string;
}

export type ApplicationEvaluationPointsCreationAttributes = ApplicationEvaluationPointsAttributes;

export class ApplicationEvaluationPoints
  extends Model<ApplicationEvaluationPointsAttributes, ApplicationEvaluationPointsCreationAttributes>
  implements ApplicationEvaluationPointsAttributes {
  total_points?: number;
  screened_out?: boolean;
  competency_review_status?: string;
  application_evaluation_id?: string;
  evaluator?: string;
  assessment_hurdle_id?: string;

  ApplicationEvaluation!: ApplicationEvaluation;
  getApplicationEvaluation!: Sequelize.BelongsToGetAssociationMixin<ApplicationEvaluation>;

  static initModel(sequelize: Sequelize.Sequelize): typeof ApplicationEvaluationPoints {
    ApplicationEvaluationPoints.init(
      {
        total_points: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        screened_out: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        competency_review_status: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        application_evaluation_id: {
          type: DataTypes.UUID,
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
      },
      {
        sequelize,
        tableName: 'application_evaluation_points',
        schema: 'public',
        timestamps: false,
      },
    );
    return ApplicationEvaluationPoints;
  }
}
