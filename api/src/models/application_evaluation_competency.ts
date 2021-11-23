import Sequelize, { DataTypes, Model, Optional } from 'sequelize';
import type { ApplicationEvaluation, ApplicationEvaluationId } from './application_evaluation';
import type { CompetencyEvaluation, CompetencyEvaluationId } from './competency_evaluation';

export interface ApplicationEvaluationCompetencyAttributes {
  id: string;
  application_evaluation_id?: string;
  competency_evaluation_id?: string;
  created_at?: Date;
  updated_at?: Date;
}

export type ApplicationEvaluationCompetencyPk = 'id';
export type ApplicationEvaluationCompetencyId = ApplicationEvaluationCompetency[ApplicationEvaluationCompetencyPk];
export type ApplicationEvaluationCompetencyCreationAttributes = Optional<
  ApplicationEvaluationCompetencyAttributes,
  ApplicationEvaluationCompetencyPk
>;

export class ApplicationEvaluationCompetency
  extends Model<ApplicationEvaluationCompetencyAttributes, ApplicationEvaluationCompetencyCreationAttributes>
  implements ApplicationEvaluationCompetencyAttributes {
  id!: string;
  application_evaluation_id?: string;
  competency_evaluation_id?: string;
  created_at?: Date;
  updated_at?: Date;

  // ApplicationEvaluationCompetency belongsTo ApplicationEvaluation
  ApplicationEvaluation!: ApplicationEvaluation;
  getApplicationEvaluation!: Sequelize.BelongsToGetAssociationMixin<ApplicationEvaluation>;
  setApplicationEvaluation!: Sequelize.BelongsToSetAssociationMixin<ApplicationEvaluation, ApplicationEvaluationId>;
  createApplicationEvaluation!: Sequelize.BelongsToCreateAssociationMixin<ApplicationEvaluation>;
  // ApplicationEvaluationCompetency belongsTo CompetencyEvaluation
  CompetencyEvaluation!: CompetencyEvaluation;
  getCompetencyEvaluation!: Sequelize.BelongsToGetAssociationMixin<CompetencyEvaluation>;
  setCompetencyEvaluation!: Sequelize.BelongsToSetAssociationMixin<CompetencyEvaluation, CompetencyEvaluationId>;
  createCompetencyEvaluation!: Sequelize.BelongsToCreateAssociationMixin<CompetencyEvaluation>;

  static initModel(sequelize: Sequelize.Sequelize): typeof ApplicationEvaluationCompetency {
    ApplicationEvaluationCompetency.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        application_evaluation_id: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'application_evaluation',
            key: 'id',
          },
          unique: 'unique_combo_eval',
        },
        competency_evaluation_id: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'competency_evaluation',
            key: 'id',
          },
          unique: 'unique_combo_eval',
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
        tableName: 'application_evaluation_competency',
        schema: 'public',
        hasTrigger: true,
        timestamps: false,
        indexes: [
          {
            name: 'application_evaluation_competency_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
          {
            name: 'unique_combo_eval',
            unique: true,
            fields: [{ name: 'application_evaluation_id' }, { name: 'competency_evaluation_id' }],
          },
        ],
      },
    );
    return ApplicationEvaluationCompetency;
  }
}
