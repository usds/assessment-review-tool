import Sequelize, { DataTypes, Model, Optional } from 'sequelize';
import type { AssessmentHurdle, AssessmentHurdleId } from './assessment_hurdle';
import type { CompetencyEvaluation, CompetencyEvaluationId } from './competency_evaluation';
import type { CompetencySelectors, CompetencySelectorsId } from './competency_selectors';
import type { SpecialtyCompetencies, SpecialtyCompetenciesId } from './specialty_competencies';

export interface CompetencyAttributes {
  id: string;
  name: string;
  local_id: string;
  assessment_hurdle_id?: string;
  definition: string;
  required_proficiency_definition?: string;
  display_type?: number;
  screen_out?: boolean;
  sort_order?: number;
  created_at?: Date;
  updated_at?: Date;
}

export type CompetencyPk = 'id';
export type CompetencyId = Competency[CompetencyPk];
export type CompetencyCreationAttributes = Optional<CompetencyAttributes, CompetencyPk>;

export class Competency extends Model<CompetencyAttributes, CompetencyCreationAttributes> implements CompetencyAttributes {
  id!: string;
  name!: string;
  local_id!: string;
  assessment_hurdle_id?: string;
  definition!: string;
  required_proficiency_definition?: string;
  display_type?: number;
  screen_out?: boolean;
  sort_order?: number;
  created_at?: Date;
  updated_at?: Date;

  // Competency belongsTo AssessmentHurdle
  AssessmentHurdle!: AssessmentHurdle;
  getAssessmentHurdle!: Sequelize.BelongsToGetAssociationMixin<AssessmentHurdle>;
  setAssessmentHurdle!: Sequelize.BelongsToSetAssociationMixin<AssessmentHurdle, AssessmentHurdleId>;
  createAssessmentHurdle!: Sequelize.BelongsToCreateAssociationMixin<AssessmentHurdle>;
  // Competency hasMany CompetencyEvaluation
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
  // Competency hasMany CompetencySelectors
  CompetencySelectors!: CompetencySelectors[];
  getCompetencySelectors!: Sequelize.HasManyGetAssociationsMixin<CompetencySelectors>;
  setCompetencySelectors!: Sequelize.HasManySetAssociationsMixin<CompetencySelectors, CompetencySelectorsId>;
  addCompetencySelector!: Sequelize.HasManyAddAssociationMixin<CompetencySelectors, CompetencySelectorsId>;
  addCompetencySelectors!: Sequelize.HasManyAddAssociationsMixin<CompetencySelectors, CompetencySelectorsId>;
  createCompetencySelector!: Sequelize.HasManyCreateAssociationMixin<CompetencySelectors>;
  removeCompetencySelector!: Sequelize.HasManyRemoveAssociationMixin<CompetencySelectors, CompetencySelectorsId>;
  removeCompetencySelectors!: Sequelize.HasManyRemoveAssociationsMixin<CompetencySelectors, CompetencySelectorsId>;
  hasCompetencySelector!: Sequelize.HasManyHasAssociationMixin<CompetencySelectors, CompetencySelectorsId>;
  hasCompetencySelectors!: Sequelize.HasManyHasAssociationsMixin<CompetencySelectors, CompetencySelectorsId>;
  countCompetencySelectors!: Sequelize.HasManyCountAssociationsMixin;
  // Competency hasMany SpecialtyCompetencies
  SpecialtyCompetencies!: SpecialtyCompetencies[];
  getSpecialtyCompetencies!: Sequelize.HasManyGetAssociationsMixin<SpecialtyCompetencies>;
  setSpecialtyCompetencies!: Sequelize.HasManySetAssociationsMixin<SpecialtyCompetencies, SpecialtyCompetenciesId>;
  addSpecialtyCompetency!: Sequelize.HasManyAddAssociationMixin<SpecialtyCompetencies, SpecialtyCompetenciesId>;
  addSpecialtyCompetencies!: Sequelize.HasManyAddAssociationsMixin<SpecialtyCompetencies, SpecialtyCompetenciesId>;
  createSpecialtyCompetency!: Sequelize.HasManyCreateAssociationMixin<SpecialtyCompetencies>;
  removeSpecialtyCompetency!: Sequelize.HasManyRemoveAssociationMixin<SpecialtyCompetencies, SpecialtyCompetenciesId>;
  removeSpecialtyCompetencies!: Sequelize.HasManyRemoveAssociationsMixin<SpecialtyCompetencies, SpecialtyCompetenciesId>;
  hasSpecialtyCompetency!: Sequelize.HasManyHasAssociationMixin<SpecialtyCompetencies, SpecialtyCompetenciesId>;
  hasSpecialtyCompetencies!: Sequelize.HasManyHasAssociationsMixin<SpecialtyCompetencies, SpecialtyCompetenciesId>;
  countSpecialtyCompetencies!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof Competency {
    Competency.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: 'unique_name',
        },
        local_id: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: 'unique_local_id',
        },
        assessment_hurdle_id: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'assessment_hurdle',
            key: 'id',
          },
          unique: 'unique_name',
        },
        definition: {
          type: DataTypes.STRING(1500),
          allowNull: false,
        },
        required_proficiency_definition: {
          type: DataTypes.STRING(1500),
          allowNull: true,
        },
        display_type: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        screen_out: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        sort_order: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
          allowNull: false,
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
        tableName: 'competency',
        schema: 'public',
        hasTrigger: true,
        timestamps: false,
        indexes: [
          {
            name: 'competency_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
          {
            name: 'unique_local_id',
            unique: true,
            fields: [{ name: 'assessment_hurdle_id' }, { name: 'local_id' }],
          },
          {
            name: 'unique_name',
            unique: true,
            fields: [{ name: 'name' }, { name: 'assessment_hurdle_id' }],
          },
        ],
      },
    );
    return Competency;
  }
}
