import Sequelize, { DataTypes, Model, Optional } from 'sequelize';
import type { Application, ApplicationId } from './application';
import type { AssessmentHurdle, AssessmentHurdleId } from './assessment_hurdle';
import type { SpecialtyCompetencies, SpecialtyCompetenciesId } from './specialty_competencies';

export interface SpecialtyAttributes {
  id: string;
  name: string;
  local_id: string;
  assessment_hurdle_id?: string;
  does_not_meet_points?: number;
  meets_points?: number;
  exceeds_points?: number;
  does_not_meet_nor?: string;
  meets_nor?: string;
  exceeds_nor?: string;
  created_at?: Date;
  updated_at?: Date;
}

export type SpecialtyPk = 'id';
export type SpecialtyId = Specialty[SpecialtyPk];
export type SpecialtyCreationAttributes = Optional<SpecialtyAttributes, SpecialtyPk>;

export class Specialty extends Model<SpecialtyAttributes, SpecialtyCreationAttributes> implements SpecialtyAttributes {
  id!: string;
  name!: string;
  local_id!: string;
  assessment_hurdle_id?: string;
  does_not_meet_points?: number;
  meets_points?: number;
  exceeds_points?: number;
  does_not_meet_nor?: string;
  meets_nor?: string;
  exceeds_nor?: string;
  created_at?: Date;
  updated_at?: Date;

  // Specialty hasMany Application
  Applications!: Application[];
  getApplications!: Sequelize.HasManyGetAssociationsMixin<Application>;
  setApplications!: Sequelize.HasManySetAssociationsMixin<Application, ApplicationId>;
  addApplication!: Sequelize.HasManyAddAssociationMixin<Application, ApplicationId>;
  addApplications!: Sequelize.HasManyAddAssociationsMixin<Application, ApplicationId>;
  createApplication!: Sequelize.HasManyCreateAssociationMixin<Application>;
  removeApplication!: Sequelize.HasManyRemoveAssociationMixin<Application, ApplicationId>;
  removeApplications!: Sequelize.HasManyRemoveAssociationsMixin<Application, ApplicationId>;
  hasApplication!: Sequelize.HasManyHasAssociationMixin<Application, ApplicationId>;
  hasApplications!: Sequelize.HasManyHasAssociationsMixin<Application, ApplicationId>;
  countApplications!: Sequelize.HasManyCountAssociationsMixin;
  // Specialty belongsTo AssessmentHurdle
  AssessmentHurdle!: AssessmentHurdle;
  getAssessmentHurdle!: Sequelize.BelongsToGetAssociationMixin<AssessmentHurdle>;
  setAssessmentHurdle!: Sequelize.BelongsToSetAssociationMixin<AssessmentHurdle, AssessmentHurdleId>;
  createAssessmentHurdle!: Sequelize.BelongsToCreateAssociationMixin<AssessmentHurdle>;
  // Specialty hasMany SpecialtyCompetencies
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

  static initModel(sequelize: Sequelize.Sequelize): typeof Specialty {
    Specialty.init(
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
          unique: 'unique_specialty',
        },
        local_id: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: 'unique_specialty_mapping',
        },
        assessment_hurdle_id: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'assessment_hurdle',
            key: 'id',
          },
          unique: 'unique_specialty_mapping',
        },
        does_not_meet_points: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
        meets_points: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 1 },
        exceeds_points: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 1 },
        does_not_meet_nor: { type: DataTypes.STRING, allowNull: true, defaultValue: 'FAILS' },
        meets_nor: { type: DataTypes.STRING, allowNull: true, defaultValue: 'MEETS' },
        exceeds_nor: { type: DataTypes.STRING, allowNull: true, defaultValue: 'EXCEEDS' },
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
        tableName: 'specialty',
        schema: 'public',
        hasTrigger: true,
        timestamps: false,
        indexes: [
          {
            name: 'specialty_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
          {
            name: 'unique_specialty',
            unique: true,
            fields: [{ name: 'name' }, { name: 'assessment_hurdle_id' }],
          },
          {
            name: 'unique_specialty_mapping',
            unique: true,
            fields: [{ name: 'local_id' }, { name: 'assessment_hurdle_id' }],
          },
        ],
      },
    );
    return Specialty;
  }
}
