import Sequelize, { DataTypes, Model, Optional } from 'sequelize';
import type { Competency, CompetencyId } from './competency';
import type { CompetencyEvaluation, CompetencyEvaluationId } from './competency_evaluation';

export interface CompetencySelectorsAttributes {
  id: string;
  sort_order?: number;
  display_name?: string;
  point_value?: number;
  default_text?: string;
  competency_id?: string;
  created_at?: Date;
  updated_at?: Date;
}

export type CompetencySelectorsPk = 'id';
export type CompetencySelectorsId = CompetencySelectors[CompetencySelectorsPk];
export type CompetencySelectorsCreationAttributes = Optional<CompetencySelectorsAttributes, CompetencySelectorsPk>;

export class CompetencySelectors
  extends Model<CompetencySelectorsAttributes, CompetencySelectorsCreationAttributes>
  implements CompetencySelectorsAttributes {
  id!: string;
  sort_order?: number;
  display_name?: string;
  point_value?: number;
  default_text?: string;
  competency_id?: string;
  created_at?: Date;
  updated_at?: Date;

  // CompetencySelectors hasMany CompetencyEvaluation
  CompetencyEvaluations!: CompetencyEvaluation[];
  getCompetencyEvaluations!: Sequelize.HasManyGetAssociationsMixin<CompetencyEvaluation>;
  setCompetencyEvaluations!: Sequelize.HasManySetAssociationsMixin<CompetencyEvaluation, CompetencyEvaluationId>;
  addCompetencyEvaluation!: Sequelize.HasManyAddAssociationMixin<CompetencyEvaluation, CompetencyEvaluationId>;
  addCompetencyEvaluations!: Sequelize.HasManyAddAssociationsMixin<CompetencyEvaluation, CompetencyEvaluationId>;
  createCompetencyEvaluation!: Sequelize.HasManyCreateAssociationMixin<CompetencyEvaluation>;
  removeCompetencyEvaluation!: Sequelize.HasManyRemoveAssociationMixin<CompetencyEvaluation, CompetencyEvaluationId>;
  removeCompetencyEvaluations!: Sequelize.HasManyRemoveAssociationsMixin<CompetencyEvaluation, CompetencyEvaluationId>;
  hasCompetencyEvaluation!: Sequelize.HasManyHasAssociationMixin<CompetencyEvaluation, CompetencyEvaluationId>;
  hasCompetencyEvaluations!: Sequelize.HasManyHasAssociationsMixin<CompetencyEvaluation, CompetencyEvaluationId>;
  countCompetencyEvaluations!: Sequelize.HasManyCountAssociationsMixin;
  // CompetencySelectors belongsTo Competency
  Competency!: Competency;
  getCompetency!: Sequelize.BelongsToGetAssociationMixin<Competency>;
  setCompetency!: Sequelize.BelongsToSetAssociationMixin<Competency, CompetencyId>;
  createCompetency!: Sequelize.BelongsToCreateAssociationMixin<Competency>;

  static initModel(sequelize: Sequelize.Sequelize): typeof CompetencySelectors {
    CompetencySelectors.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        sort_order: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        display_name: {
          type: DataTypes.STRING,
          allowNull: true,
          unique: 'unique_competency',
        },
        point_value: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        default_text: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        competency_id: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'competency',
            key: 'id',
          },
          unique: 'unique_competency',
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
        tableName: 'competency_selectors',
        schema: 'public',
        hasTrigger: true,
        timestamps: false,
        indexes: [
          {
            name: 'competency_selectors_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
          {
            name: 'unique_competency',
            unique: true,
            fields: [{ name: 'display_name' }, { name: 'competency_id' }],
          },
        ],
      },
    );
    return CompetencySelectors;
  }
}
