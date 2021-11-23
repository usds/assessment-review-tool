import Sequelize, { DataTypes, Model, Optional } from 'sequelize';
import type { Applicant, ApplicantId } from './applicant';

export interface ApplicantMetaAttributes {
  id: string;
  staffing_first_name: string;
  staffing_middle_name?: string;
  staffing_last_name: string;
  staffing_application_number?: string;
  staffing_application_id: string;
  applicant_id?: string;
  created_at?: Date;
  updated_at?: Date;
}

export type ApplicantMetaPk = 'id';
export type ApplicantMetaId = ApplicantMeta[ApplicantMetaPk];
export type ApplicantMetaCreationAttributes = Optional<ApplicantMetaAttributes, ApplicantMetaPk>;

export class ApplicantMeta extends Model<ApplicantMetaAttributes, ApplicantMetaCreationAttributes> implements ApplicantMetaAttributes {
  id!: string;
  staffing_first_name!: string;
  staffing_middle_name?: string;
  staffing_last_name!: string;
  staffing_application_number?: string;
  staffing_application_id!: string;
  applicant_id?: string;
  created_at?: Date;
  updated_at?: Date;

  // ApplicantMeta belongsTo Applicant
  Applicant!: Applicant;
  getApplicant!: Sequelize.BelongsToGetAssociationMixin<Applicant>;
  setApplicant!: Sequelize.BelongsToSetAssociationMixin<Applicant, ApplicantId>;
  createApplicant!: Sequelize.BelongsToCreateAssociationMixin<Applicant>;

  static initModel(sequelize: Sequelize.Sequelize): typeof ApplicantMeta {
    ApplicantMeta.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        staffing_first_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        staffing_middle_name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        staffing_last_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        staffing_application_number: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        staffing_application_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        applicant_id: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'applicant',
            key: 'id',
          },
          unique: 'unique_applicant_id_meta',
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
        tableName: 'applicant_meta',
        schema: 'public',
        hasTrigger: true,
        timestamps: false,
        indexes: [
          {
            name: 'applicant_meta_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
          {
            name: 'unique_applicant_id_meta',
            unique: true,
            fields: [{ name: 'applicant_id' }],
          },
        ],
      },
    );
    return ApplicantMeta;
  }
}
