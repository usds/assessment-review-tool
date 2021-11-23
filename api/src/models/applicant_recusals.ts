import Sequelize, { DataTypes, Model, Optional } from 'sequelize';
import type { AppUser, AppUserId } from './app_user';
import type { Applicant, ApplicantId } from './applicant';

export interface ApplicantRecusalsAttributes {
  id: string;
  applicant_id?: string;
  recused_evaluator_id?: string;
  created_at?: Date;
  updated_at?: Date;
}

export type ApplicantRecusalsPk = 'id';
export type ApplicantRecusalsId = ApplicantRecusals[ApplicantRecusalsPk];
export type ApplicantRecusalsCreationAttributes = Optional<ApplicantRecusalsAttributes, ApplicantRecusalsPk>;

export class ApplicantRecusals
  extends Model<ApplicantRecusalsAttributes, ApplicantRecusalsCreationAttributes>
  implements ApplicantRecusalsAttributes {
  id!: string;
  applicant_id?: string;
  recused_evaluator_id?: string;
  created_at?: Date;
  updated_at?: Date;

  // ApplicantRecusals belongsTo Applicant
  Applicant!: Applicant;
  getApplicant!: Sequelize.BelongsToGetAssociationMixin<Applicant>;
  setApplicant!: Sequelize.BelongsToSetAssociationMixin<Applicant, ApplicantId>;
  createApplicant!: Sequelize.BelongsToCreateAssociationMixin<Applicant>;
  // ApplicantRecusals belongsTo AppUser
  AppUser!: AppUser;
  getAppUser!: Sequelize.BelongsToGetAssociationMixin<AppUser>;
  setAppUser!: Sequelize.BelongsToSetAssociationMixin<AppUser, AppUserId>;
  createAppUser!: Sequelize.BelongsToCreateAssociationMixin<AppUser>;

  static initModel(sequelize: Sequelize.Sequelize): typeof ApplicantRecusals {
    ApplicantRecusals.init(
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
          unique: 'unique_combo_user',
        },
        recused_evaluator_id: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'app_user',
            key: 'id',
          },
          unique: 'unique_combo_user',
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
        tableName: 'applicant_recusals',
        schema: 'public',
        hasTrigger: true,
        timestamps: false,
        indexes: [
          {
            name: 'applicant_recusals_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
          {
            name: 'unique_combo_user',
            unique: true,
            fields: [{ name: 'applicant_id' }, { name: 'recused_evaluator_id' }],
          },
        ],
      },
    );
    return ApplicantRecusals;
  }
}
