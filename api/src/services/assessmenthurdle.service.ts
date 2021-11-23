import { Op } from 'sequelize';

import HttpException from '../exceptions/HttpException';
import { isEmpty } from '../utils/isEmpty';
import { logger } from '../utils/logger';

import { AssessmentHurdle } from '../models/assessment_hurdle';
import { AssessmentHurdleMeta } from '../models/assessment_hurdle_meta';
import { Applicant } from '../models/applicant';
import { Application } from '../models/application';
import { AssessmentHurdleUser } from '../models/assessment_hurdle_user';
import { ApplicationEvaluation } from '../models/application_evaluation';
import { Competency } from '../models/competency';

import CreateAssessmentHurdleDto from '../dto/createassessmenthurdle.dto';
import HrDisplayDto, { ApplicationHrEvaluationDto, CompetencyHrEvaluationDto } from '../dto/hrdisplay.dto';
import { ApplicationEvaluationCompetency } from '../models/application_evaluation_competency';
import { ApplicantEvaluationFeedback } from '../models/applicant_evaluation_feedback';
import { CompetencyEvaluation } from '../models/competency_evaluation';
import { CompetencySelectors } from '../models/competency_selectors';

export default class AssessmentHurdleService {
  async getAll(): Promise<AssessmentHurdle[]> {
    const rst: AssessmentHurdle[] = await AssessmentHurdle.findAll();
    return rst;
  }
  async getAllWithUserRoles(userId: string): Promise<AssessmentHurdle[]> {
    const rst: AssessmentHurdle[] = await AssessmentHurdle.findAll({
      include: [
        {
          model: AssessmentHurdleUser as any,
          required: true,
          where: { app_user_id: userId },
          attributes: ['app_user_id', 'role'],
        },
      ],
    });
    return rst;
  }

  async getById(id: string): Promise<AssessmentHurdle> {
    if (isEmpty(id)) throw new HttpException(400, "You're not AssessmentHurdleId");

    const rst = await AssessmentHurdle.findByPk(id, { include: [{ all: true }] });
    if (!rst) throw new HttpException(404, 'Not Found');
    return rst;
  }

  async upsert(body: CreateAssessmentHurdleDto): Promise<AssessmentHurdle> {
    const [instance] = await AssessmentHurdle.upsert({
      id: body.existingId,
      department_name: body.departmentName,
      component_name: body.componentName,
      position_name: body.positionName,
      position_details: body.positionDetails,
      locations: body.locations,
      start_datetime: body.startDatetime,
      end_datetime: body.endDatetime,
      hurdle_display_type: body.hurdleDisplayType,
      evaluations_required: body.evaluationsRequired,
      hr_name: body.hrName,
      hr_email: body.hrEmail,
      assessment_name: body.assessmentName,
    });
    logger.debug(`Upserted AssessmentHurdle: ${instance.id}`);
    const [meta, created] = await AssessmentHurdleMeta.findOrCreate({
      where: { assessment_hurdle_id: instance.id },
      defaults: {
        staffing_assessment_id: body.assessmentId,
        staffing_vacancy_id: body.vacancyId,
        assessment_hurdle_id: instance.id,
        staffing_fail_nor: body.failNor,
        staffing_pass_nor: body.passNor,
      },
    });

    if (!created) {
      await meta.update({
        staffing_assessment_id: body.assessmentId,
        staffing_vacancy_id: body.vacancyId,
        staffing_fail_nor: body.failNor,
        staffing_pass_nor: body.passNor,
      });
    }

    logger.debug(`Upserted AssessmentMeta ${meta.id}`);

    return instance;
  }

  async getHrDisplay(hurdleId: string, currentUserId: string): Promise<HrDisplayDto> {
    if (isEmpty(hurdleId) || isEmpty(currentUserId)) throw new HttpException(400, 'Empty Parameters');

    const assessmentHurdle = await AssessmentHurdle.findByPk(hurdleId, {
      include: [
        {
          model: Applicant as any,
          required: true,
          where: {
            flag_type: 0,
          },
          include: [
            {
              model: Application as any,
              required: true,
            },
          ],
        },
      ],
    });

    if (!assessmentHurdle) throw new HttpException(404, `${hurdleId} not found`);

    const applicantsById = assessmentHurdle.Applicants.reduce((memo, a) => {
      memo[a.id] = a.name!;
      return memo;
    }, {} as { [name: string]: string });

    const applicantByApplicationId = assessmentHurdle.Applicants.flatMap(a => a.Applications).reduce((memo, a) => {
      memo[a.id] = { applicantName: applicantsById[a.applicant_id!], applicantId: a.applicant_id! };
      return memo;
    }, {} as { [applicationId: string]: { applicantId: string; applicantName: string } });

    // get all application evaluations
    const applicationEvaluations = await ApplicationEvaluation.findAll({
      where: {
        application_id: Object.keys(applicantByApplicationId),
      },
      attributes: ['evaluation_note', 'evaluator', 'id', 'approved', 'application_id', 'created_at'],
      include: [
        {
          model: ApplicationEvaluationCompetency as any,
          required: false,
          separate: true,
          attributes: ['application_evaluation_id', 'competency_evaluation_id'],
          include: [{ model: CompetencyEvaluation as any, required: true }],
        },
      ],
    });

    const applicantFeedback = (
      await ApplicantEvaluationFeedback.findAll({
        where: {
          applicant_id: Object.values(applicantByApplicationId).map(a => a.applicantId),
        },
      })
    ).reduce((memo, aef) => {
      const applicantEvaluationKey = aef.applicant_id! + aef.evaluator_id;
      memo[applicantEvaluationKey] = aef;
      return memo;
    }, {} as { [applicantEvaluationKey: string]: ApplicantEvaluationFeedback });

    const competencyNamesById = (
      await Competency.findAll({
        where: {
          assessment_hurdle_id: hurdleId,
        },
        attributes: ['name', 'sort_order', 'id'],
      })
    ).reduce((memo, c) => {
      memo[c.id] = { name: c.name, sort_order: c.sort_order! };
      return memo;
    }, {} as { [competencyId: string]: { name: string; sort_order: number } });
    const selectorsById = (
      await CompetencySelectors.findAll({
        where: {
          competency_id: Object.keys(competencyNamesById),
        },
        attributes: ['id', 'display_name'],
      })
    ).reduce((memo, s) => {
      memo[s.id] = s.display_name!;
      return memo;
    }, {} as { [selectorId: string]: string });

    const dto = new HrDisplayDto();

    dto.applicantEvaluations = (
      await Promise.all(
        applicationEvaluations.map(async ae => {
          const applicantId = applicantByApplicationId[ae.application_id!].applicantId;
          const evaluator = ae.evaluator!;
          const applicantEvaluationKey = applicantId + evaluator;

          const applicationEvaluation = {} as ApplicationHrEvaluationDto;
          applicationEvaluation.applicantEvaluationKey = applicantEvaluationKey;
          applicationEvaluation.approved = ae.approved!;
          applicationEvaluation.applicationIds = [ae.id];
          applicationEvaluation.evaluation_note = ae.evaluation_note!;
          applicationEvaluation.evaluator = evaluator;
          applicationEvaluation.created_at = ae.created_at!.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
          });
          applicationEvaluation.applicantName = applicantByApplicationId[ae.application_id!].applicantName;
          applicationEvaluation.applicantId = applicantId;

          applicationEvaluation.competencyEvaluations = (
            await Promise.all(ae.ApplicationEvaluationCompetencies.flatMap(async aec => await aec.getCompetencyEvaluation()))
          )
            .map(ce => {
              const competencyEvaluation = {} as CompetencyHrEvaluationDto;
              competencyEvaluation.competency_name = competencyNamesById[ce.competency_id].name;
              competencyEvaluation.sort_order = competencyNamesById[ce.competency_id].sort_order;
              competencyEvaluation.evaluation_note = ce.evaluation_note;
              competencyEvaluation.competency_selector_name = selectorsById[ce.competency_selector_id];
              competencyEvaluation.id = ce.id;
              return competencyEvaluation;
            })
            .sort((a, b) => a.sort_order - b.sort_order);
          return applicationEvaluation;
        }),
      )
    ).reduce((memo, applicationEvaluation) => {
      const { applicantEvaluationKey } = applicationEvaluation;

      if (!(applicantEvaluationKey in memo)) {
        let applicantFeedbackId = '';
        let evaluationFeedback = '';
        if (applicantEvaluationKey in applicantFeedback) {
          applicantFeedbackId = applicantFeedback[applicantEvaluationKey].id;
          evaluationFeedback = applicantFeedback[applicantEvaluationKey].evaluation_feedback || '';
        }

        applicationEvaluation.feedback = {
          applicantFeedbackId: applicantFeedbackId,
          evaluationFeedback: evaluationFeedback,
        };
        memo[applicantEvaluationKey] = applicationEvaluation;
        return memo;
      }

      const { competencyEvaluations, applicationIds } = memo[applicantEvaluationKey];
      memo[applicantEvaluationKey].applicationIds.push(applicationIds[0]);

      const allCompetencies = [...new Set(competencyEvaluations.concat(competencyEvaluations))];

      memo[applicantEvaluationKey].competencyEvaluations = allCompetencies;
      return memo;
    }, {} as { [applicantEvaluationKey: string]: ApplicationHrEvaluationDto });

    dto.assessmentHurdle = assessmentHurdle;

    //  = assessmentHurdle.Applicants.flatMap(a => a.Applications).flatMap(a => a.ApplicationEvaluations);

    dto.flaggedApplicants = await Applicant.findAll({
      where: {
        assessment_hurdle_id: hurdleId,
        flag_type: {
          [Op.ne]: 0,
        },
      },
      include: [Application as any],
    });

    return dto;
  }
}
