import Sequelize, { DataTypes, Model } from 'sequelize';

export interface ApplicationStatusAggAttributes {
  applicant_id?: string;
  application_id?: string;
  assessment_hurdle_id?: string;
  evaluations_required?: number;
  application_result?: string;
  status?: string;
}

export type ApplicationStatusAggCreationAttributes = ApplicationStatusAggAttributes;

export class ApplicationStatusAgg
  extends Model<ApplicationStatusAggAttributes, ApplicationStatusAggCreationAttributes>
  implements ApplicationStatusAggAttributes {
  applicant_id?: string;
  application_id?: string;
  assessment_hurdle_id?: string;
  evaluations_required?: number;
  application_result?: string;
  status?: string;

  static initModel(sequelize: Sequelize.Sequelize): typeof ApplicationStatusAgg {
    ApplicationStatusAgg.init(
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
        evaluations_required: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        assessment_hurdle_id: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        application_result: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        status: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'application_status_agg',
        schema: 'public',
        timestamps: false,
        freezeTableName: true,
      },
    );
    return ApplicationStatusAgg;
  }
}
