import { Op } from 'sequelize';
import { CompetencyEvaluationDto, CompetencyJustification, CompetencyWithSelectors } from '../dto/applicantdisplay.dto';
import CreateCompetenciesDto from '../dto/createcompetencies.dto';
import CreateCompetencyDto from '../dto/createcompetency.dto';
import HttpException from '../exceptions/HttpException';
import { Applicant } from '../models/applicant';
import { Application } from '../models/application';
import { ApplicationEvaluation } from '../models/application_evaluation';
import { ApplicationEvaluationCompetency } from '../models/application_evaluation_competency';
import { AssessmentHurdle } from '../models/assessment_hurdle';
import { Competency } from '../models/competency';
import { CompetencyEvaluation } from '../models/competency_evaluation';
import { CompetencyEvaluationCount } from '../models/competency_evaluation_count';
import { CompetencySelectors } from '../models/competency_selectors';
import { Specialty } from '../models/specialty';
import { SpecialtyCompetencies } from '../models/specialty_competencies';
import { isEmpty } from '../utils/isEmpty';
import { logger } from '../utils/logger';
import { marked } from 'marked';

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
});

export default class CompetencyService {
  async getById(id: string): Promise<Competency> {
    if (isEmpty(id)) throw new HttpException(400, 'No competency id provided');
    const rst = await Competency.findByPk(id);
    if (!rst) throw new HttpException(404, 'Not Found');
    return rst;
  }
  async getAll(): Promise<Competency[]> {
    const rst: Competency[] = await Competency.findAll();
    return rst;
  }
  async getAllByHurdleId(hurdleId: string): Promise<Competency[]> {
    if (isEmpty(hurdleId)) throw new HttpException(400, 'No hurdle id provided');
    const rst: Competency[] = await Competency.findAll({
      where: {
        assessment_hurdle_id: hurdleId,
      },
    });
    if (!rst) throw new HttpException(404, 'No competencies found');
    return rst;
  }
  // TODO: Prune if no clear use.
  async getAllMappingsById(id: string): Promise<SpecialtyCompetencies[]> {
    if (isEmpty(id)) throw new HttpException(400, 'No competency id provided');
    const rst: SpecialtyCompetencies[] = await SpecialtyCompetencies.findAll({ where: { competency_id: id }, include: { all: true } });
    if (!rst) throw new HttpException(404, 'Not Found');
    return rst;
  }

  async upsert(body: CreateCompetencyDto, assessmentHurdleId: string): Promise<Competency> {
    const [instance] = await Competency.upsert({
      id: body.existingId,
      definition: (body.definition && marked.parse(body.definition)) || '',
      name: body.name,
      required_proficiency_definition: (body.requiredProficiencyDefinition && marked.parse(body.requiredProficiencyDefinition)) || '',
      display_type: body.displayType,
      screen_out: body.screenOut,
      local_id: body.localId,
      assessment_hurdle_id: assessmentHurdleId,
      sort_order: body.sortOrder,
    });

    logger.debug(`Created Competency: ${instance.id}`);

    if (body.specialtyIds) {
      await Promise.all(
        body.specialtyIds.map(async sid => {
          const mapping = await SpecialtyCompetencies.create({
            competency_id: instance.id,
            specialty_id: sid,
          });
          logger.debug(`Added Mapping ${mapping.id} to Specialty: ${sid}`);
        }),
      );
    }

    if (body.selectors.length) {
      const meetsMapping = await Promise.all(
        body.selectors.map(async m => {
          const rst = await CompetencySelectors.create({
            competency_id: instance.id,
            display_name: m.displayName,
            point_value: m.pointValue,
            id: m.existingId,
            sort_order: m.sortOrder,
            default_text: m.defaultText,
          });
          return rst;
        }),
      );
      logger.debug(`Upserted ${meetsMapping.length} CompetencySelectors from ${body.selectors.length} inputs`);
    }

    return instance;
  }
  async upsertAll(body: CreateCompetenciesDto, assessmentHurdleId: string): Promise<Competency[]> {
    return await Promise.all(
      body.competencies.map(comp => {
        return this.upsert({ ...comp }, assessmentHurdleId);
      }),
    );
  }
  async getAllCompetenciesWithMap(applicantId: string) {
    // Get all specialty competencies applied for by applicant:
    const applications = await Application.findAll({
      where: {
        applicant_id: applicantId,
      },
      include: [
        {
          model: Specialty as any,
          required: true,
          attributes: ['id'],
        },
        // {
        //   model: ApplicationEvaluation as any,
        //   required: false,
        //   attributes: ['id'],
        //   where: {
        //     evaluator: evaluator,
        //   },
        // },
      ],
    });
    if (!applications.length) throw new HttpException(404, `No applications found for ${applicantId}`);

    const specialties = applications.map(a => a.Specialty);
    const specialtyIds = applications.map(s => s.specialty_id!);

    // Get all the specialtyCompetency combinations
    const competenciesBySpecialty = await SpecialtyCompetencies.findAll({
      where: {
        specialty_id: specialtyIds,
      },
      include: [
        {
          model: Competency as any,
          required: true,
          include: [
            {
              model: CompetencySelectors as any,
              required: true,
            },
          ],
        },
      ],
    });
    // Map them out for use
    const specialtyMap = {} as { [specialtyId: string]: Set<string> };
    // this is for removing competencies later...
    const competencyMap = {} as { [competencyId: string]: Set<string> };
    const competencies = {} as { [competencyId: string]: CompetencyWithSelectors };

    competenciesBySpecialty.forEach(specComp => {
      const { specialty_id: specialtyId, competency_id: competencyId, Competency: competency } = specComp;
      const {
        CompetencySelectors: selectors,
        id,
        name,
        local_id,
        assessment_hurdle_id,
        definition,
        required_proficiency_definition,
        display_type,
        screen_out,
        updated_at,
        sort_order,
      } = competency;
      if (!(specialtyId! in specialtyMap)) {
        specialtyMap[specialtyId!] = new Set();
      }
      specialtyMap[specialtyId!].add(competencyId!);

      if (!(competencyId! in competencyMap)) {
        competencyMap[competencyId!] = new Set();
      }
      competencyMap[competencyId!].add(specialtyId!);

      if (!(competencyId! in competencies)) {
        competencies[competencyId!] = {
          selectors,
          id,
          name,
          local_id,
          assessment_hurdle_id: assessment_hurdle_id!,
          definition,
          required_proficiency_definition: required_proficiency_definition!,
          display_type: display_type!,
          screen_out: screen_out!,
          updated_at: updated_at!,
          sort_order: sort_order!,
        };
      }
    });

    return { specialties, specialtyMap, competencies, competencyMap };
  }
  async getAllActiveForApplicant(evaluator: string, applicantId: string, assessmentHurdleId: string) {
    const assessmentHurdle = await AssessmentHurdle.findOne({
      attributes: ['id', 'hurdle_display_type', 'evaluations_required', 'require_review_for_all_passing'],
      where: { id: assessmentHurdleId },
    });
    const { evaluations_required: evaluationsRequired } = assessmentHurdle!;
    const { specialties, specialtyMap, competencies, competencyMap } = await this.getAllCompetenciesWithMap(applicantId);

    const evaluatedCompetencies = (
      await CompetencyEvaluation.findAll({
        where: {
          competency_id: Object.keys(competencies),
          evaluator: evaluator,
          applicant: applicantId,
        },
      })
    ).reduce((memo, c) => {
      const { id: competencyEvaluationId, competency_id, competency_selector_id, evaluation_note, evaluator, updated_at } = c!;
      memo[competency_id] = {
        competencyEvaluationId,
        competency_id,
        competency_selector_id,
        evaluation_note,
        evaluator,
        updated_at: updated_at!,
      };
      return memo;
    }, {} as { [competencyId: string]: CompetencyEvaluationDto });

    // Get current competency Counts
    const currentCompetencyCounts = (
      await CompetencyEvaluationCount.findAll({
        attributes: ['competency_id', 'does_not_meet', 'meets'],
        where: { applicant: applicantId },
      })
    ).reduce(
      (competencyEvaluationCounts, comp) => {
        competencyEvaluationCounts[comp.competency_id!] = comp;
        return competencyEvaluationCounts;
      },
      {} as {
        [competencyId: string]: CompetencyEvaluationCount;
      },
    );

    const removeCompetencies = [] as string[];
    // Create Screen out competency list:
    // Only competencies that _haven't_ been evaluated previously
    // or competencies that have >= evaluationsRequired should be removed.

    // These counts are needed for the situations where there is disagreement
    // on _all_ competencies. This can be removed when `evaluation_types` are
    // instituted.

    let isTieBreaker = false;
    Object.keys(competencies).forEach(cid => {
      if (cid in evaluatedCompetencies) {
        return;
      }
      const doesNotMeet = +(currentCompetencyCounts[cid]?.does_not_meet || 0);
      const meets = +(currentCompetencyCounts[cid]?.meets || 0);

      if (doesNotMeet < evaluationsRequired && meets < evaluationsRequired) {
        if (doesNotMeet + meets >= evaluationsRequired) {
          isTieBreaker = true;
        }
        return;
      }
      isTieBreaker = true;
      removeCompetencies.push(cid);
    });
    removeCompetencies.forEach(c => {
      if (c in competencyMap) {
        competencyMap[c].forEach(s => {
          specialtyMap[s].delete(c);
        });
      }
      delete competencies[c];
      delete competencyMap[c];
    });

    let competencyJustifications = [] as CompetencyJustification[];
    if (isTieBreaker) {
      competencyJustifications = (
        await CompetencyEvaluation.findAll({
          where: {
            competency_id: Object.keys(competencies),
            applicant: applicantId,
            evaluator: { [Op.not]: evaluator },
          },
        })
      ).map((c): CompetencyJustification => {
        const { id, competency_selector_id, competency_id, evaluator: local_evaluator, evaluation_note, updated_at } = c;
        return {
          competencyEvaluationId: id,
          justification: evaluation_note,
          evaluator: local_evaluator,
          competency_id: competency_id,
          competency_selector_id: competency_selector_id,
          updated_at: updated_at!,
        };
      });
    }
    return { competencies, evaluatedCompetencies, specialtyMap, specialties, isTieBreaker, competencyJustifications };
  }
}
