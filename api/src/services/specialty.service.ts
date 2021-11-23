import CreateSpecialtyDto from '../dto/createspecialty.dto';
import CreateSpecialtiesDto from '../dto/createspecialties.dto';
import HttpException from '../exceptions/HttpException';
import { SpecialtyCompetencies } from '../models/specialty_competencies';
import { Specialty } from '../models/specialty';
import { isEmpty } from '../utils/isEmpty';
import { logger } from '../utils/logger';
import CompetencyService from './competency.service';
import { Competency } from '../models/competency';

export default class SpecialtyService {
  CompetencyService = new CompetencyService();

  async getById(id: string): Promise<Specialty> {
    if (isEmpty(id)) throw new HttpException(400, 'Applicant or specialty not found');
    const rst = await Specialty.findByPk(id);
    if (!rst) throw new HttpException(404, 'Not Found');
    return rst;
  }

  async getAll(): Promise<Specialty[]> {
    const rst: Specialty[] = await Specialty.findAll();
    return rst;
  }
  async getAllByHurdleId(hurdleId: string): Promise<Specialty[]> {
    const rst: Specialty[] = await Specialty.findAll({
      where: {
        assessment_hurdle_id: hurdleId,
      },
    });
    return rst;
  }

  async getAllMappingsById(id: string, hurdleId: string): Promise<SpecialtyCompetencies[]> {
    if (isEmpty(id)) throw new HttpException(400, 'Applicant or specialty not found');
    const existing = await Specialty.count({ where: { id: id, assessment_hurdle_id: hurdleId } });
    if (existing === 0) {
      throw new HttpException(400, `SpecialtyId ${id} does not exist in ${hurdleId}`);
    }
    const rst: SpecialtyCompetencies[] = await SpecialtyCompetencies.findAll({ where: { specialty_id: id }, include: { all: true } });
    return rst;
  }

  async upsert(body: CreateSpecialtyDto, competencies?: Competency[]): Promise<Specialty> {
    if (body.competencyIds && body.competencyLocalIds) {
      throw new Error('Must provide only either specialyIds or competency local Ids');
    }

    const [instance] = await Specialty.upsert({
      id: body.existingId,
      local_id: body.localId,
      name: body.name,
      assessment_hurdle_id: body.assessmentHurdleId,
      points_required: body.pointsRequired,
    });

    logger.debug(`Upserted Specialty ${instance.id}`);
    if (body.competencyIds?.length) {
      const mapped: SpecialtyCompetencies[] = await Promise.all(
        body.competencyIds.map(async compId => {
          const [cs, created] = await SpecialtyCompetencies.findOrCreate({
            where: { specialty_id: instance.id, competency_id: compId },
            defaults: {
              competency_id: compId,
              specialty_id: instance.id,
            },
          });
          if (!created) {
            cs.update({
              competency_id: compId,
              specialty_id: instance.id,
            });
          }
          return cs;
        }),
      );
      logger.debug(`Created ${mapped.length} mappings from ${body.competencyIds?.length} ids`);
    } else if (body.competencyLocalIds?.length) {
      if (!competencies || !competencies.length) {
        competencies = await this.CompetencyService.getAllByHurdleId(body.assessmentHurdleId!);
        if (!competencies || !competencies.length) {
          throw new Error('No competencies exist for this assessment hurdle!');
        }
      }
      const competencyByLocalId = competencies.reduce((memo, comp) => {
        memo[comp.local_id] = comp.id;
        return memo;
      }, {} as { [local_id: string]: string });

      const mapped: SpecialtyCompetencies[] = await Promise.all(
        body.competencyLocalIds.map(async id => {
          const compId = competencyByLocalId[id];
          if (!compId) {
            throw new Error(`Competency local id ${id} does not exist`);
          }
          const [cs, created] = await SpecialtyCompetencies.findOrCreate({
            where: { specialty_id: instance.id, competency_id: compId },
            defaults: {
              competency_id: compId,
              specialty_id: instance.id,
            },
          });
          if (!created) {
            cs.update({
              competency_id: compId,
              specialty_id: instance.id,
            });
          }
          return cs;
        }),
      );
      logger.debug(`Created ${mapped.length} mappings from ${body.competencyIds?.length} ids`);
    }

    return instance;
  }

  async upsertAll(body: CreateSpecialtiesDto, assessmentHurdleId: string): Promise<Specialty[]> {
    const competencies = await this.CompetencyService.getAllByHurdleId(assessmentHurdleId);
    return await Promise.all(body.specialties.map(specialty => this.upsert({ ...specialty, assessmentHurdleId }, competencies)));
  }
}
