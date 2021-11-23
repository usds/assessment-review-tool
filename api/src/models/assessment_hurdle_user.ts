import Sequelize, { DataTypes, Model, Optional } from 'sequelize';
import type { AppUser, AppUserId } from './app_user';
import type { AssessmentHurdle, AssessmentHurdleId } from './assessment_hurdle';

export interface AssessmentHurdleUserAttributes {
  id: string;
  app_user_id: string;
  role: number;
  assessment_hurdle_id: string;
  created_at?: Date;
  updated_at?: Date;
}

export type AssessmentHurdleUserPk = 'id';
export type AssessmentHurdleUserId = AssessmentHurdleUser[AssessmentHurdleUserPk];
export type AssessmentHurdleUserCreationAttributes = Optional<AssessmentHurdleUserAttributes, AssessmentHurdleUserPk>;

export class AssessmentHurdleUser
  extends Model<AssessmentHurdleUserAttributes, AssessmentHurdleUserCreationAttributes>
  implements AssessmentHurdleUserAttributes {
  id!: string;
  app_user_id!: string;
  role!: number;
  assessment_hurdle_id!: string;
  created_at?: Date;
  updated_at?: Date;

  // AssessmentHurdleUser belongsTo AppUser
  AppUser!: AppUser;
  getAppUser!: Sequelize.BelongsToGetAssociationMixin<AppUser>;
  setAppUser!: Sequelize.BelongsToSetAssociationMixin<AppUser, AppUserId>;
  createAppUser!: Sequelize.BelongsToCreateAssociationMixin<AppUser>;
  // AssessmentHurdleUser belongsTo AssessmentHurdle
  AssessmentHurdle!: AssessmentHurdle;
  getAssessmentHurdle!: Sequelize.BelongsToGetAssociationMixin<AssessmentHurdle>;
  setAssessmentHurdle!: Sequelize.BelongsToSetAssociationMixin<AssessmentHurdle, AssessmentHurdleId>;
  createAssessmentHurdle!: Sequelize.BelongsToCreateAssociationMixin<AssessmentHurdle>;

  static initModel(sequelize: Sequelize.Sequelize): typeof AssessmentHurdleUser {
    AssessmentHurdleUser.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        app_user_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'app_user',
            key: 'id',
          },
          unique: 'user_in_assessment_hurdle',
        },
        role: {
          type: DataTypes.INTEGER,
          allowNull: false,
          unique: 'user_in_assessment_hurdle',
        },
        assessment_hurdle_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'assessment_hurdle',
            key: 'id',
          },
          unique: 'user_in_assessment_hurdle',
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
        tableName: 'assessment_hurdle_user',
        schema: 'public',
        hasTrigger: true,
        timestamps: false,
        indexes: [
          {
            name: 'assessment_hurdle_user_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
          {
            name: 'user_in_assessment_hurdle',
            unique: true,
            fields: [{ name: 'assessment_hurdle_id' }, { name: 'app_user_id' }, { name: 'role' }],
          },
        ],
      },
    );
    return AssessmentHurdleUser;
  }
}
