import Sequelize, { DataTypes, Model, Optional } from 'sequelize';
import type { Application, ApplicationId } from './application';

export interface ApplicationMetaAttributes {
  id: string;
  application_id?: string;
  staffing_application_rating_id: string;
  staffing_assessment_id: string;
  staffing_rating_combination: string;
  created_at?: Date;
  updated_at?: Date;
}

export type ApplicationMetaPk = 'id';
export type ApplicationMetaId = ApplicationMeta[ApplicationMetaPk];
export type ApplicationMetaCreationAttributes = Optional<ApplicationMetaAttributes, ApplicationMetaPk>;

export class ApplicationMeta extends Model<ApplicationMetaAttributes, ApplicationMetaCreationAttributes> implements ApplicationMetaAttributes {
  id!: string;
  application_id?: string;
  staffing_application_rating_id!: string;
  staffing_assessment_id!: string;
  staffing_rating_combination!: string;
  created_at?: Date;
  updated_at?: Date;

  // ApplicationMeta belongsTo Application
  Application!: Application;
  getApplication!: Sequelize.BelongsToGetAssociationMixin<Application>;
  setApplication!: Sequelize.BelongsToSetAssociationMixin<Application, ApplicationId>;
  createApplication!: Sequelize.BelongsToCreateAssociationMixin<Application>;

  static initModel(sequelize: Sequelize.Sequelize): typeof ApplicationMeta {
    ApplicationMeta.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        application_id: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'application',
            key: 'id',
          },
          unique: 'unique_application_meta',
        },
        staffing_application_rating_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        staffing_assessment_id: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        staffing_rating_combination: {
          type: DataTypes.STRING,
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
        tableName: 'application_meta',
        schema: 'public',
        hasTrigger: true,
        timestamps: false,
        indexes: [
          {
            name: 'application_meta_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
          {
            name: 'unique_application_meta',
            unique: true,
            fields: [{ name: 'application_id' }],
          },
        ],
      },
    );
    return ApplicationMeta;
  }
}
