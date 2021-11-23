import Sequelize, { DataTypes, Model, Optional } from 'sequelize';
import type { AppUser, AppUserId } from './app_user';
import type { Applicant, ApplicantId } from './applicant';
import { AssessmentHurdle, AssessmentHurdleId } from './assessment_hurdle';

export interface ApplicationAssignmentsAttributes {
  id: string;
  evaluator_id: string;
  applicant_id: string;
  assessment_hurdle_id: string;
  expires?: Date;
  active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export type ApplicationAssignmentsPk = 'id';
export type ApplicationAssignmentsId = ApplicationAssignments[ApplicationAssignmentsPk];
export type ApplicationAssignmentsCreationAttributes = Optional<ApplicationAssignmentsAttributes, ApplicationAssignmentsPk>;

export class ApplicationAssignments
  extends Model<ApplicationAssignmentsAttributes, ApplicationAssignmentsCreationAttributes>
  implements ApplicationAssignmentsAttributes {
  id!: string;
  evaluator_id!: string;
  applicant_id!: string;
  assessment_hurdle_id!: string;
  active?: boolean;
  created_at?: Date;
  updated_at?: Date;

  // ApplicationAssignments belongsTo Applicant
  Applicant!: Applicant;
  getApplicant!: Sequelize.BelongsToGetAssociationMixin<Applicant>;
  setApplicant!: Sequelize.BelongsToSetAssociationMixin<Applicant, ApplicantId>;
  createApplicant!: Sequelize.BelongsToCreateAssociationMixin<Applicant>;
  // ApplicationAssignments belongsTo AppUser
  AppUser!: AppUser;
  getAppUser!: Sequelize.BelongsToGetAssociationMixin<AppUser>;
  setAppUser!: Sequelize.BelongsToSetAssociationMixin<AppUser, AppUserId>;
  createAppUser!: Sequelize.BelongsToCreateAssociationMixin<AppUser>;
  // ApplicationAssignments belongsTo AssessmentHurdle
  AssessmentHurdle!: AssessmentHurdle;
  getAssessmentHurdle!: Sequelize.BelongsToGetAssociationMixin<AssessmentHurdle>;
  setAssessmentHurdle!: Sequelize.BelongsToSetAssociationMixin<AssessmentHurdle, AssessmentHurdleId>;
  createAssessmentHurdle!: Sequelize.BelongsToCreateAssociationMixin<AssessmentHurdle>;

  static initModel(sequelize: Sequelize.Sequelize): typeof ApplicationAssignments {
    ApplicationAssignments.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        evaluator_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'app_user',
            key: 'id',
          },
          unique: 'unique_combo_eval_app',
        },
        applicant_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'applicant',
            key: 'id',
          },
          unique: 'unique_combo_eval_app',
        },
        assessment_hurdle_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'assessment_hurdle',
            key: 'id',
          },
          unique: 'unique_combo_eval_app',
        },
        active: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        expires: {
          type: DataTypes.UUID,
          allowNull: true,
          defaultValue: Sequelize.fn('now'),
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
        tableName: 'application_assignments',
        schema: 'public',
        hasTrigger: true,
        timestamps: false,
        indexes: [
          {
            name: 'application_assignments_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
          {
            name: 'unique_combo_eval_app',
            unique: true,
            fields: [{ name: 'evaluator_id' }, { name: 'applicant_id' }, { name: 'assessment_hurdle_id' }],
          },
        ],
      },
    );
    return ApplicationAssignments;
  }
}
