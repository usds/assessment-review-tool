import Sequelize, { DataTypes, Model, Optional } from 'sequelize';
import type { Applicant, ApplicantId } from './applicant';
import type { ApplicationEvaluation, ApplicationEvaluationId } from './application_evaluation';
import type { ApplicationMeta, ApplicationMetaCreationAttributes, ApplicationMetaId } from './application_meta';
import type { Specialty, SpecialtyId } from './specialty';

export interface ApplicationAttributes {
  id: string;
  applicant_id?: string;
  specialty_id?: string;
  created_at?: Date;
  updated_at?: Date;
}

export type ApplicationPk = 'id';
export type ApplicationId = Application[ApplicationPk];
export type ApplicationCreationAttributes = Optional<ApplicationAttributes, ApplicationPk>;

export class Application extends Model<ApplicationAttributes, ApplicationCreationAttributes> implements ApplicationAttributes {
  id!: string;
  applicant_id?: string;
  specialty_id?: string;
  created_at?: Date;
  updated_at?: Date;

  // Application belongsTo Applicant
  Applicant!: Applicant;
  getApplicant!: Sequelize.BelongsToGetAssociationMixin<Applicant>;
  setApplicant!: Sequelize.BelongsToSetAssociationMixin<Applicant, ApplicantId>;
  createApplicant!: Sequelize.BelongsToCreateAssociationMixin<Applicant>;
  // Application belongsTo Specialty
  Specialty!: Specialty;
  getSpecialty!: Sequelize.BelongsToGetAssociationMixin<Specialty>;
  setSpecialty!: Sequelize.BelongsToSetAssociationMixin<Specialty, SpecialtyId>;
  createSpecialty!: Sequelize.BelongsToCreateAssociationMixin<Specialty>;
  // Application hasMany ApplicationEvaluation
  ApplicationEvaluations!: ApplicationEvaluation[];
  getApplicationEvaluations!: Sequelize.HasManyGetAssociationsMixin<ApplicationEvaluation>;
  setApplicationEvaluations!: Sequelize.HasManySetAssociationsMixin<ApplicationEvaluation, ApplicationEvaluationId>;
  addApplicationEvaluation!: Sequelize.HasManyAddAssociationMixin<ApplicationEvaluation, ApplicationEvaluationId>;
  addApplicationEvaluations!: Sequelize.HasManyAddAssociationsMixin<ApplicationEvaluation, ApplicationEvaluationId>;
  createApplicationEvaluation!: Sequelize.HasManyCreateAssociationMixin<ApplicationEvaluation>;
  removeApplicationEvaluation!: Sequelize.HasManyRemoveAssociationMixin<ApplicationEvaluation, ApplicationEvaluationId>;
  removeApplicationEvaluations!: Sequelize.HasManyRemoveAssociationsMixin<ApplicationEvaluation, ApplicationEvaluationId>;
  hasApplicationEvaluation!: Sequelize.HasManyHasAssociationMixin<ApplicationEvaluation, ApplicationEvaluationId>;
  hasApplicationEvaluations!: Sequelize.HasManyHasAssociationsMixin<ApplicationEvaluation, ApplicationEvaluationId>;
  countApplicationEvaluations!: Sequelize.HasManyCountAssociationsMixin;
  // Application hasOne ApplicationMeta
  ApplicationMetum!: ApplicationMeta;
  getApplicationMetum!: Sequelize.HasOneGetAssociationMixin<ApplicationMeta>;
  setApplicationMetum!: Sequelize.HasOneSetAssociationMixin<ApplicationMeta, ApplicationMetaId>;
  createApplicationMetum!: Sequelize.HasOneCreateAssociationMixin<ApplicationMetaCreationAttributes>;

  static initModel(sequelize: Sequelize.Sequelize): typeof Application {
    Application.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        applicant_id: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'applicant',
            key: 'id',
          },
          unique: 'unique_pair',
        },
        specialty_id: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'specialty',
            key: 'id',
          },
          unique: 'unique_pair',
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
        tableName: 'application',
        schema: 'public',
        hasTrigger: true,
        timestamps: false,
        indexes: [
          {
            name: 'application_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
          {
            name: 'unique_pair',
            unique: true,
            fields: [{ name: 'applicant_id' }, { name: 'specialty_id' }],
          },
        ],
      },
    );
    return Application;
  }
}
