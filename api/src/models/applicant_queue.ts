import Sequelize, { DataTypes, Model } from 'sequelize';
import { ApplicationEvaluation } from './application_evaluation';

export interface ApplicantQueueAttributes {
  applicant_id?: string;
  assessment_hurdle_id?: string;
  evaluators?: number;
}

export type ApplicantQueueCreationAttributes = ApplicantQueueAttributes;
export class ApplicantQueue extends Model<ApplicantQueueAttributes, ApplicantQueueCreationAttributes> implements ApplicantQueueAttributes {
  applicant_id?: string;
  assessment_hurdle_id?: string;
  evaluators?: number;

  ApplicationEvaluation!: ApplicationEvaluation;
  getApplicationEvaluation!: Sequelize.BelongsToGetAssociationMixin<ApplicationEvaluation>;

  static initModel(sequelize: Sequelize.Sequelize): typeof ApplicantQueue {
    ApplicantQueue.init(
      {
        evaluators: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        applicant_id: {
          type: DataTypes.UUID,
          allowNull: true,
          primaryKey: true,
        },
        assessment_hurdle_id: {
          type: DataTypes.UUID,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'applicant_queue',
        schema: 'public',
        timestamps: false,
      },
    );
    return ApplicantQueue;
  }
}
