import Sequelize, { DataTypes, Model } from 'sequelize';

export interface ReviewerMetricsAttributes {
  reviewer_id?: string;
  name?: string;
  email?: string;
  assessment_hurdle_id?: string;
  pending_amendment?: number;
  adjudicated?: number;
}

export type ReviewerMetricsCreationAttributes = ReviewerMetricsAttributes;

export class ReviewerMetrics extends Model<ReviewerMetricsAttributes, ReviewerMetricsCreationAttributes> implements ReviewerMetricsAttributes {
  reviewer_id?: string;
  name?: string;
  email?: string;
  assessment_hurdle_id?: string;
  pending_amendment?: number;
  adjudicated?: number;

  static initModel(sequelize: Sequelize.Sequelize): typeof ReviewerMetrics {
    ReviewerMetrics.init(
      {
        reviewer_id: {
          type: DataTypes.UUID,
          allowNull: true,
          primaryKey: true,
        },
        assessment_hurdle_id: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        pending_amendment: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        adjudicated: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'reviewer_metrics',
        schema: 'public',
        timestamps: false,
        freezeTableName: true,
      },
    );
    return ReviewerMetrics;
  }
}
