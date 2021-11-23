import Sequelize, { DataTypes, Model, Optional } from 'sequelize';
import type { AppUser, AppUserId } from './app_user';
import type { ApplicationEvaluationCompetency, ApplicationEvaluationCompetencyId } from './application_evaluation_competency';
import type { Competency, CompetencyId } from './competency';
import type { CompetencySelectors, CompetencySelectorsId } from './competency_selectors';
import { Applicant, ApplicantId } from './applicant';

export interface CompetencyEvaluationAttributes {
  id: string;
  evaluation_note?: string;
  evaluator: string;
  applicant: string;
  competency_id: string;
  competency_selector_id: string;
  created_at?: Date;
  updated_at?: Date;
}

export type CompetencyEvaluationPk = 'id';
export type CompetencyEvaluationId = CompetencyEvaluation[CompetencyEvaluationPk];
export type CompetencyEvaluationCreationAttributes = Optional<CompetencyEvaluationAttributes, CompetencyEvaluationPk>;

export class CompetencyEvaluation
  extends Model<CompetencyEvaluationAttributes, CompetencyEvaluationCreationAttributes>
  implements CompetencyEvaluationAttributes {
  id!: string;
  evaluation_note?: string;
  evaluator!: string;
  applicant!: string;
  competency_id!: string;
  competency_selector_id!: string;
  created_at?: Date;
  updated_at?: Date;

  // CompetencyEvaluation hasMany ApplicationEvaluationCompetency
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
  // CompetencyEvaluation belongsTo AppUser
  AppUser!: AppUser;
  getAppUser!: Sequelize.BelongsToGetAssociationMixin<AppUser>;
  setAppUser!: Sequelize.BelongsToSetAssociationMixin<AppUser, AppUserId>;
  createAppUser!: Sequelize.BelongsToCreateAssociationMixin<AppUser>;
  // CompetencyEvaluation belongsTo Competency
  Competency!: Competency;
  getCompetency!: Sequelize.BelongsToGetAssociationMixin<Competency>;
  setCompetency!: Sequelize.BelongsToSetAssociationMixin<Competency, CompetencyId>;
  createCompetency!: Sequelize.BelongsToCreateAssociationMixin<Competency>;
  // CompetencyEvaluation belongsTo CompetencySelectors
  CompetencySelector!: CompetencySelectors;
  getCompetencySelector!: Sequelize.BelongsToGetAssociationMixin<CompetencySelectors>;
  setCompetencySelector!: Sequelize.BelongsToSetAssociationMixin<CompetencySelectors, CompetencySelectorsId>;
  createCompetencySelector!: Sequelize.BelongsToCreateAssociationMixin<CompetencySelectors>;
  // CompetencyEvaluation belongsTo Applicant
  Applicant!: Applicant;
  getApplicant!: Sequelize.BelongsToGetAssociationMixin<Applicant>;
  setApplicant!: Sequelize.BelongsToSetAssociationMixin<Applicant, ApplicantId>;
  createApplicant!: Sequelize.BelongsToCreateAssociationMixin<Applicant>;

  static initModel(sequelize: Sequelize.Sequelize): typeof CompetencyEvaluation {
    CompetencyEvaluation.init(
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
        },
        evaluator: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'app_user',
            key: 'id',
          },
        },
        applicant: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'applicant',
            key: 'id',
          },
        },
        competency_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'competency',
            key: 'id',
          },
        },
        competency_selector_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'competency_selectors',
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
      },
      {
        sequelize,
        tableName: 'competency_evaluation',
        schema: 'public',
        hasTrigger: true,
        timestamps: false,
        indexes: [
          { name: 'unique_competency_evaluation', unique: true, fields: ['applicant', 'evaluator', 'competency_id'] },
          {
            name: 'competency_evaluation_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      },
    );
    return CompetencyEvaluation;
  }
}
