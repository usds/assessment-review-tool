import Sequelize, { DataTypes, Model } from 'sequelize';

export interface EvaluatorMetricsAttributes {
  evaluator?: string;
  assessment_hurdle_id?: string;
  pending_review?: number;
  pending_amendment?: number;
  completed?: number;
  recusals?: number;
  name?: string;
}

export type EvaluatorMetricsCreationAttributes = EvaluatorMetricsAttributes;

export class EvaluatorMetrics extends Model<EvaluatorMetricsAttributes, EvaluatorMetricsCreationAttributes> implements EvaluatorMetricsAttributes {
  evaluator?: string;
  name?: string;
  assessment_hurdle_id?: string;
  pending_review?: number;
  pending_amendment?: number;
  completed?: number;
  recusals?: number;

  static initModel(sequelize: Sequelize.Sequelize): typeof EvaluatorMetrics {
    EvaluatorMetrics.init(
      {
        evaluator: {
          type: DataTypes.UUID,
          allowNull: true,
          primaryKey: true,
        },
        assessment_hurdle_id: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        pending_review: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        pending_amendment: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        completed: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        recusals: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'evaluator_metrics',
        schema: 'public',
        timestamps: false,
        freezeTableName: true,
      },
    );
    return EvaluatorMetrics;
  }
}
