import Sequelize, { DataTypes, Model, Optional } from 'sequelize';
import type { AppUser, AppUserId } from './app_user';
import type { Application, ApplicationId } from './application';
import type { ApplicationEvaluationCompetency, ApplicationEvaluationCompetencyId } from './application_evaluation_competency';

export interface ApplicationEvaluationAttributes {
  id: string;
  evaluation_note?: string;
  evaluator?: string;
  approved?: boolean | null;
  approver_id?: string | null;
  feedback_timestamp?: Date;
  application_id?: string;
  created_at?: Date;
  updated_at?: Date;
  approved_type?: number;
}

export type ApplicationEvaluationPk = 'id';
export type ApplicationEvaluationId = ApplicationEvaluation[ApplicationEvaluationPk];
export type ApplicationEvaluationCreationAttributes = Optional<ApplicationEvaluationAttributes, ApplicationEvaluationPk>;

export const approvalTypes = {
  reviewerApproval: 1,
  automaticApproval: 2,
};
export class ApplicationEvaluation
  extends Model<ApplicationEvaluationAttributes, ApplicationEvaluationCreationAttributes>
  implements ApplicationEvaluationAttributes {
  id!: string;
  evaluation_note?: string;
  evaluator?: string;
  approved?: boolean | null;
  approver_id?: string | null;
  feedback_timestamp?: Date;
  application_id?: string;
  created_at?: Date;
  updated_at?: Date;
  approved_type?: number;

  // ApplicationEvaluation belongsTo Application
  Application!: Application;
  getApplication!: Sequelize.BelongsToGetAssociationMixin<Application>;
  setApplication!: Sequelize.BelongsToSetAssociationMixin<Application, ApplicationId>;
  createApplication!: Sequelize.BelongsToCreateAssociationMixin<Application>;
  // ApplicationEvaluation belongsTo AppUser
  Approver!: AppUser;
  getApprover!: Sequelize.BelongsToGetAssociationMixin<AppUser>;
  setApprover!: Sequelize.BelongsToSetAssociationMixin<AppUser, AppUserId>;
  createApprover!: Sequelize.BelongsToCreateAssociationMixin<AppUser>;
  Evaluator!: AppUser;
  getEvaluator!: Sequelize.BelongsToGetAssociationMixin<AppUser>;
  setEvaluator!: Sequelize.BelongsToSetAssociationMixin<AppUser, AppUserId>;
  createEvaluator!: Sequelize.BelongsToCreateAssociationMixin<AppUser>;
  // ApplicationEvaluation hasMany ApplicationEvaluationCompetency
  ApplicationEvaluationCompetencies!: ApplicationEvaluationCompetency[];
  getApplicationEvaluationCompetencies!: Sequelize.HasManyGetAssociationsMixin<ApplicationEvaluationCompetency>;
  setApplicationEvaluationCompetencies!: Sequelize.HasManySetAssociationsMixin<ApplicationEvaluationCompetency, ApplicationEvaluationCompetencyId>;
  addApplicationEvaluationCompetency!: Sequelize.HasManyAddAssociationMixin<ApplicationEvaluationCompetency, ApplicationEvaluationCompetencyId>;
  addApplicationEvaluationCompetencies!: Sequelize.HasManyAddAssociationsMixin<ApplicationEvaluationCompetency, ApplicationEvaluationCompetencyId>;
  createApplicationEvaluationCompetency!: Sequelize.HasManyCreateAssociationMixin<ApplicationEvaluationCompetency>;
  removeApplicationEvaluationCompetency!: Sequelize.HasManyRemoveAssociationMixin<ApplicationEvaluationCompetency, ApplicationEvaluationCompetencyId>;
  removeApplicationEvaluationCompetencies!: Sequelize.HasManyRemoveAssociationsMixin<
    ApplicationEvaluationCompetency,
    ApplicationEvaluationCompetencyId
  >;
  hasApplicationEvaluationCompetency!: Sequelize.HasManyHasAssociationMixin<ApplicationEvaluationCompetency, ApplicationEvaluationCompetencyId>;
  hasApplicationEvaluationCompetencies!: Sequelize.HasManyHasAssociationsMixin<ApplicationEvaluationCompetency, ApplicationEvaluationCompetencyId>;
  countApplicationEvaluationCompetencies!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof ApplicationEvaluation {
    ApplicationEvaluation.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        evaluation_note: {
          type: DataTypes.STRING(1500),
          allowNull: true,
          defaultValue: 'NULL',
        },
        evaluator: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'app_user',
            key: 'id',
          },
        },
        approved: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        approver_id: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'app_user',
            key: 'id',
          },
        },
        feedback_timestamp: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        application_id: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'application',
            key: 'id',
          },
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
        approved_type: {
          type: DataTypes.NUMBER,
          allowNull: true,
          defaultValue: approvalTypes.reviewerApproval,
        },
      },
      {
        sequelize,
        tableName: 'application_evaluation',
        schema: 'public',
        hasTrigger: true,
        timestamps: false,
        indexes: [
          {
            name: 'application_evaluation_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
          { name: 'unique_application_evaluation', unique: true, fields: ['application_id', 'evaluator'] },
        ],
      },
    );
    return ApplicationEvaluation;
  }
}
