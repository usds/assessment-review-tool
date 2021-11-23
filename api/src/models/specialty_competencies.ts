import Sequelize, { DataTypes, Model, Optional } from 'sequelize';
import type { Competency, CompetencyId } from './competency';
import type { Specialty, SpecialtyId } from './specialty';

export interface SpecialtyCompetenciesAttributes {
  id: string;
  specialty_id?: string;
  competency_id?: string;
  created_at?: Date;
  updated_at?: Date;
}

export type SpecialtyCompetenciesPk = 'id';
export type SpecialtyCompetenciesId = SpecialtyCompetencies[SpecialtyCompetenciesPk];
export type SpecialtyCompetenciesCreationAttributes = Optional<SpecialtyCompetenciesAttributes, SpecialtyCompetenciesPk>;

export class SpecialtyCompetencies
  extends Model<SpecialtyCompetenciesAttributes, SpecialtyCompetenciesCreationAttributes>
  implements SpecialtyCompetenciesAttributes {
  id!: string;
  specialty_id?: string;
  competency_id?: string;
  created_at?: Date;
  updated_at?: Date;

  // SpecialtyCompetencies belongsTo Competency
  Competency!: Competency;
  getCompetency!: Sequelize.BelongsToGetAssociationMixin<Competency>;
  setCompetency!: Sequelize.BelongsToSetAssociationMixin<Competency, CompetencyId>;
  createCompetency!: Sequelize.BelongsToCreateAssociationMixin<Competency>;
  // SpecialtyCompetencies belongsTo Specialty
  Specialty!: Specialty;
  getSpecialty!: Sequelize.BelongsToGetAssociationMixin<Specialty>;
  setSpecialty!: Sequelize.BelongsToSetAssociationMixin<Specialty, SpecialtyId>;
  createSpecialty!: Sequelize.BelongsToCreateAssociationMixin<Specialty>;

  static initModel(sequelize: Sequelize.Sequelize): typeof SpecialtyCompetencies {
    SpecialtyCompetencies.init(
      {
        id: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        specialty_id: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'specialty',
            key: 'id',
          },
          unique: 'unique_combo',
        },
        competency_id: {
          type: DataTypes.UUID,
          allowNull: true,
          references: {
            model: 'competency',
            key: 'id',
          },
          unique: 'unique_combo',
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
        tableName: 'specialty_competencies',
        schema: 'public',
        hasTrigger: true,
        timestamps: false,
        indexes: [
          {
            name: 'specialty_competencies_pkey',
            unique: true,
            fields: [{ name: 'id' }],
          },
          {
            name: 'unique_combo',
            unique: true,
            fields: [{ name: 'specialty_id' }, { name: 'competency_id' }],
          },
        ],
      },
    );
    return SpecialtyCompetencies;
  }
}
