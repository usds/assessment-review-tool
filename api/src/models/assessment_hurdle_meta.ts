import Sequelize, { DataTypes, Model, Optional } from 'sequelize';
import type { AssessmentHurdle, AssessmentHurdleId } from './assessment_hurdle';

export interface AssessmentHurdleMetaAttributes {
  id: string;
  staffing_vacancy_id: string;
  staffing_assessment_id: string;
  staffing_pass_nor?: string;
  staffing_fail_nor?: string;
  assessment_hurdle_id?: string;
  created_at?: Date;
  updated_at?: Date;
}

export type AssessmentHurdleMetaPk = 'id';
export type AssessmentHurdleMetaId = AssessmentHurdleMeta[AssessmentHurdleMetaPk];
export type AssessmentHurdleMetaCreationAttributes = Optional<AssessmentHurdleMetaAttributes, AssessmentHurdleMetaPk>;

export class AssessmentHurdleMeta
  extends Model<AssessmentHurdleMetaAttributes, AssessmentHurdleMetaCreationAttributes>
  implements AssessmentHurdleMetaAttributes {
  id!: string;
  staffing_vacancy_id!: string;
  staffing_assessment_id!: string;
  staffing_pass_nor?: string;
  staffing_fail_nor?: string;
  assessment_hurdle_id?: string;
  created_at?: Date;
  updated_at?: Date;

  // AssessmentHurdleMeta belongsTo AssessmentHurdle
  AssessmentHurdle!: AssessmentHurdle;
  getAssessmentHurdle!: Sequelize.BelongsToGetAssociationMixin<AssessmentHurdle>;
  setAssessmentHurdle!: Sequelize.BelongsToSetAssociationMixin<AssessmentHurdle, AssessmentHurdleId>;
  createAssessmentHurdle!: Sequelize.BelongsToCreateAssociationMixin<AssessmentHurdle>;

  static initModel(sequelize: Sequelize.Sequelize): typeof AssessmentHurdleMeta {
    AssessmentHurdleMeta.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        staffing_vacancy_id: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: 'unique_hurdle',
        },
        staffing_assessment_id: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: 'unique_hurdle',
        },
        staffing_pass_nor: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        staffing_fail_nor: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        assessment_hurdle_id: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'assessment_hurdle',
            key: 'id',
          },
          unique: 'unique_meta_hurdle',
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
        tableName: 'assessment_hurdle_meta',
        schema: 'public',
        hasTrigger: true,
        timestamps: false,
        indexes: [
          {
            name: 'assessment_hurdle_meta_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
          {
            name: 'assessment_hurdle_meta_staffing_vacancy_id_key',
            unique: true,
            fields: [{ name: 'staffing_vacancy_id' }],
          },
          {
            name: 'unique_hurdle',
            unique: true,
            fields: [{ name: 'staffing_vacancy_id' }, { name: 'staffing_assessment_id' }],
          },
          {
            name: 'unique_meta_hurdle',
            unique: true,
            fields: [{ name: 'assessment_hurdle_id' }],
          },
        ],
      },
    );
    return AssessmentHurdleMeta;
  }
}
