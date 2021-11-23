import Sequelize, { DataTypes, Model, Optional } from 'sequelize';
import type { Applicant, ApplicantId } from './applicant';
import type { AssessmentHurdleMeta, AssessmentHurdleMetaCreationAttributes, AssessmentHurdleMetaId } from './assessment_hurdle_meta';
import type { AssessmentHurdleUser, AssessmentHurdleUserId } from './assessment_hurdle_user';
import type { Competency, CompetencyId } from './competency';
import type { Specialty, SpecialtyId } from './specialty';

export interface AssessmentHurdleAttributes {
  id: string;
  department_name: string;
  component_name?: string;
  position_name: string;
  assessment_name: string;
  position_details?: string;
  require_review_for_all_passing?: boolean;
  locations?: string;
  start_datetime: Date;
  end_datetime: Date;
  hurdle_display_type: number;
  evaluations_required: number;
  hr_name?: string;
  hr_email?: string;
  created_at?: Date;
  updated_at?: Date;
}

export type AssessmentHurdlePk = 'id';
export type AssessmentHurdleId = AssessmentHurdle[AssessmentHurdlePk];
export type AssessmentHurdleCreationAttributes = Optional<AssessmentHurdleAttributes, AssessmentHurdlePk>;

export class AssessmentHurdle extends Model<AssessmentHurdleAttributes, AssessmentHurdleCreationAttributes> implements AssessmentHurdleAttributes {
  id!: string;
  department_name!: string;
  component_name?: string;
  position_name!: string;
  assessment_name!: string;
  position_details?: string;
  require_review_for_all_passing?: boolean;
  locations?: string;
  start_datetime!: Date;
  end_datetime!: Date;
  hurdle_display_type!: number;
  evaluations_required!: number;
  hr_name?: string;
  hr_email?: string;
  created_at?: Date;
  updated_at?: Date;

  // AssessmentHurdle hasMany Applicant
  Applicants!: Applicant[];
  getApplicants!: Sequelize.HasManyGetAssociationsMixin<Applicant>;
  setApplicants!: Sequelize.HasManySetAssociationsMixin<Applicant, ApplicantId>;
  addApplicant!: Sequelize.HasManyAddAssociationMixin<Applicant, ApplicantId>;
  addApplicants!: Sequelize.HasManyAddAssociationsMixin<Applicant, ApplicantId>;
  createApplicant!: Sequelize.HasManyCreateAssociationMixin<Applicant>;
  removeApplicant!: Sequelize.HasManyRemoveAssociationMixin<Applicant, ApplicantId>;
  removeApplicants!: Sequelize.HasManyRemoveAssociationsMixin<Applicant, ApplicantId>;
  hasApplicant!: Sequelize.HasManyHasAssociationMixin<Applicant, ApplicantId>;
  hasApplicants!: Sequelize.HasManyHasAssociationsMixin<Applicant, ApplicantId>;
  countApplicants!: Sequelize.HasManyCountAssociationsMixin;
  // AssessmentHurdle hasOne AssessmentHurdleMeta
  AssessmentHurdleMetum!: AssessmentHurdleMeta;
  getAssessmentHurdleMetum!: Sequelize.HasOneGetAssociationMixin<AssessmentHurdleMeta>;
  setAssessmentHurdleMetum!: Sequelize.HasOneSetAssociationMixin<AssessmentHurdleMeta, AssessmentHurdleMetaId>;
  createAssessmentHurdleMetum!: Sequelize.HasOneCreateAssociationMixin<AssessmentHurdleMetaCreationAttributes>;
  // AssessmentHurdle hasMany AssessmentHurdleUser
  AssessmentHurdleUsers!: AssessmentHurdleUser[];
  getAssessmentHurdleUsers!: Sequelize.HasManyGetAssociationsMixin<AssessmentHurdleUser>;
  setAssessmentHurdleUsers!: Sequelize.HasManySetAssociationsMixin<AssessmentHurdleUser, AssessmentHurdleUserId>;
  addAssessmentHurdleUser!: Sequelize.HasManyAddAssociationMixin<AssessmentHurdleUser, AssessmentHurdleUserId>;
  addAssessmentHurdleUsers!: Sequelize.HasManyAddAssociationsMixin<AssessmentHurdleUser, AssessmentHurdleUserId>;
  createAssessmentHurdleUser!: Sequelize.HasManyCreateAssociationMixin<AssessmentHurdleUser>;
  removeAssessmentHurdleUser!: Sequelize.HasManyRemoveAssociationMixin<AssessmentHurdleUser, AssessmentHurdleUserId>;
  removeAssessmentHurdleUsers!: Sequelize.HasManyRemoveAssociationsMixin<AssessmentHurdleUser, AssessmentHurdleUserId>;
  hasAssessmentHurdleUser!: Sequelize.HasManyHasAssociationMixin<AssessmentHurdleUser, AssessmentHurdleUserId>;
  hasAssessmentHurdleUsers!: Sequelize.HasManyHasAssociationsMixin<AssessmentHurdleUser, AssessmentHurdleUserId>;
  countAssessmentHurdleUsers!: Sequelize.HasManyCountAssociationsMixin;
  // AssessmentHurdle hasMany Competency
  Competencies!: Competency[];
  getCompetencies!: Sequelize.HasManyGetAssociationsMixin<Competency>;
  setCompetencies!: Sequelize.HasManySetAssociationsMixin<Competency, CompetencyId>;
  addCompetency!: Sequelize.HasManyAddAssociationMixin<Competency, CompetencyId>;
  addCompetencies!: Sequelize.HasManyAddAssociationsMixin<Competency, CompetencyId>;
  createCompetency!: Sequelize.HasManyCreateAssociationMixin<Competency>;
  removeCompetency!: Sequelize.HasManyRemoveAssociationMixin<Competency, CompetencyId>;
  removeCompetencies!: Sequelize.HasManyRemoveAssociationsMixin<Competency, CompetencyId>;
  hasCompetency!: Sequelize.HasManyHasAssociationMixin<Competency, CompetencyId>;
  hasCompetencies!: Sequelize.HasManyHasAssociationsMixin<Competency, CompetencyId>;
  countCompetencies!: Sequelize.HasManyCountAssociationsMixin;
  // AssessmentHurdle hasMany Specialty
  Specialties!: Specialty[];
  getSpecialties!: Sequelize.HasManyGetAssociationsMixin<Specialty>;
  setSpecialties!: Sequelize.HasManySetAssociationsMixin<Specialty, SpecialtyId>;
  addSpecialty!: Sequelize.HasManyAddAssociationMixin<Specialty, SpecialtyId>;
  addSpecialties!: Sequelize.HasManyAddAssociationsMixin<Specialty, SpecialtyId>;
  createSpecialty!: Sequelize.HasManyCreateAssociationMixin<Specialty>;
  removeSpecialty!: Sequelize.HasManyRemoveAssociationMixin<Specialty, SpecialtyId>;
  removeSpecialties!: Sequelize.HasManyRemoveAssociationsMixin<Specialty, SpecialtyId>;
  hasSpecialty!: Sequelize.HasManyHasAssociationMixin<Specialty, SpecialtyId>;
  hasSpecialties!: Sequelize.HasManyHasAssociationsMixin<Specialty, SpecialtyId>;
  countSpecialties!: Sequelize.HasManyCountAssociationsMixin;

  static initModel(sequelize: Sequelize.Sequelize): typeof AssessmentHurdle {
    AssessmentHurdle.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        department_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        component_name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        position_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        assessment_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        position_details: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        locations: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        start_datetime: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        end_datetime: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        hurdle_display_type: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        require_review_for_all_passing: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
        evaluations_required: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        hr_name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        hr_email: {
          type: DataTypes.STRING,
          allowNull: true,
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
        tableName: 'assessment_hurdle',
        schema: 'public',
        hasTrigger: true,
        timestamps: false,
        indexes: [
          {
            name: 'assessment_hurdle_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
        ],
      },
    );
    return AssessmentHurdle;
  }
}
