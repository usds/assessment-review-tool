import Sequelize, { DataTypes, Model } from 'sequelize';

export interface ApplicantApplicationEvaluationNotesAttributes {
  evaluator?: string;
  evaluation_note?: string;
  applicant_id?: string;
}

export type ApplicantApplicationEvaluationNotesCreationAttributes = ApplicantApplicationEvaluationNotesAttributes;

export class ApplicantApplicationEvaluationNotes
  extends Model<ApplicantApplicationEvaluationNotesAttributes, ApplicantApplicationEvaluationNotesCreationAttributes>
  implements ApplicantApplicationEvaluationNotesAttributes {
  evaluator?: string;
  evaluation_note?: string;
  applicant_id?: string;
  static initModel(sequelize: Sequelize.Sequelize): typeof ApplicantApplicationEvaluationNotes {
    ApplicantApplicationEvaluationNotes.init(
      {
        evaluator: { type: DataTypes.UUID, allowNull: true, primaryKey: true },
        applicant_id: { type: DataTypes.UUID, allowNull: true, primaryKey: true },
        evaluation_note: { type: DataTypes.STRING, allowNull: true },
      },
      {
        sequelize,
        tableName: 'applicant_application_evaluation_notes',
        schema: 'public',
        timestamps: false,
      },
    );
    return ApplicantApplicationEvaluationNotes;
  }
}
