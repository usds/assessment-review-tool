import Sequelize, { DataTypes, Model } from 'sequelize';
import { CompetencyEvaluation } from './competency_evaluation';

export interface CompetencyEvaluationCountAttributes {
  assessment_hurdle_id?: string;
  competency_id?: string;
  applicant?: string;
  does_not_meet?: number;
  meets?: number;
  screen_out?: boolean;
}

export type CompetencyEvaluationCountCreationAttributes = CompetencyEvaluationCountAttributes;

export class CompetencyEvaluationCount
  extends Model<CompetencyEvaluationCountAttributes, CompetencyEvaluationCountCreationAttributes>
  implements CompetencyEvaluationCountAttributes {
  assessment_hurdle_id?: string;
  competency_id?: string;
  applicant?: string;
  does_not_meet?: number;
  meets?: number;
  screen_out?: boolean;
  CompetencyEvaluation!: CompetencyEvaluation;

  static initModel(sequelize: Sequelize.Sequelize): typeof CompetencyEvaluationCount {
    CompetencyEvaluationCount.init(
      {
        assessment_hurdle_id: { type: DataTypes.UUID, allowNull: true },
        competency_id: { type: DataTypes.UUID, allowNull: true },
        applicant: { type: DataTypes.UUID, allowNull: true },
        does_not_meet: { type: DataTypes.NUMBER, allowNull: true },
        meets: { type: DataTypes.NUMBER, allowNull: true },
        screen_out: { type: DataTypes.BOOLEAN, allowNull: true },
      },
      {
        sequelize,
        tableName: 'competency_evaluation_count',
        schema: 'public',
        timestamps: false,
      },
    );
    return CompetencyEvaluationCount;
  }
}
