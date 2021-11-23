import { Op } from 'sequelize';
import AuditFileDto from '../dto/auditfile.dto';
import { Applicant } from '../models/applicant';
import { ApplicantMeta } from '../models/applicant_meta';
import { Application } from '../models/application';
import { ApplicationEvaluation } from '../models/application_evaluation';
import { ApplicationEvaluationCompetency } from '../models/application_evaluation_competency';
import { ApplicationMeta } from '../models/application_meta';
import { AppUser } from '../models/app_user';
import { CompetencyEvaluation } from '../models/competency_evaluation';
import { AssessmentHurdle } from '../models/assessment_hurdle';
import { logger } from '../utils/logger';
import HttpException from '../exceptions/HttpException';
import { Competency } from '../models/competency';
import { CompetencySelectors } from '../models/competency_selectors';
import { ApplicantStatusMetrics } from '../models/applicant_status_metrics';
import ApplicationResultDto from '../dto/applicationresult.dto';
import { AssessmentHurdleMeta } from '../models/assessment_hurdle_meta';
import ApplicationResultUSASDto from '../dto/applicationresultsusas.dto';
import { ApplicantRecusals } from '../models/applicant_recusals';
import RecusedApplicantsDto from '../dto/recusedapplicants.dto';
import FlaggedApplicantsDto from '../dto/flaggedapplicants.dto';

export default class ExportService {
  async getAuditFile(hurdleId: string): Promise<AuditFileDto[]> {
    logger.info(`Generating Export Audit file for ${hurdleId}`);

    const countCheck = await AssessmentHurdle.count({
      where: {
        id: hurdleId,
      },
    });

    if (countCheck === 0) throw new HttpException(404, `${hurdleId} not found`);

    const applicants = await Applicant.findAll({
      where: {
        assessment_hurdle_id: hurdleId,
      },
      include: [
        {
          model: ApplicantMeta as any,
          required: false,
        },
        {
          model: Application as any,
          required: true,
          include: [ApplicationMeta as any],
        },
      ],
    });

    logger.info(`${applicants.length} applicants found`);

    const applicationsScope = applicants.flatMap(a => a.Applications);

    logger.info(`${applicationsScope.length} applications found`);

    const appIds = applicationsScope.map(appScope => appScope.id);

    const applicationEvals = await ApplicationEvaluation.findAll({
      where: {
        application_id: {
          [Op.in]: appIds,
        },
      },
      include: [
        {
          model: ApplicationEvaluationCompetency as any,
          required: true,
        },
        {
          model: Application as any,
          required: true,
        },
        {
          model: AppUser as any,
          required: true,
          as: 'Evaluator',
          attributes: ['id', 'name', 'email'],
        },
        {
          model: AppUser as any,
          required: false,
          as: 'Approver',
          attributes: ['id', 'name', 'email'],
        },
      ],
    });

    const compEvalsToFetch = applicationEvals.flatMap(ae => ae.ApplicationEvaluationCompetencies).map(aec => aec.competency_evaluation_id!);

    const compEvals = await CompetencyEvaluation.findAll({
      where: {
        id: {
          [Op.in]: compEvalsToFetch,
        },
      },
      include: [
        {
          model: Competency as any,
          required: true,
        },
        {
          model: CompetencySelectors as any,
          required: true,
        },
      ],
    });

    logger.info(`${applicationEvals.length} applicationEvalutions found`);
    logger.info(`${compEvals.length} CompetencyEvaluation found`);

    const mappingItems: ApplicationEvaluationCompetency[] = applicationEvals.flatMap(appEvals => appEvals.ApplicationEvaluationCompetencies);
    logger.info(`${mappingItems.length} ApplicationEvaluationCompetencies found`);

    const competencies = await Competency.findAll({
      where: {
        assessment_hurdle_id: hurdleId,
      },
      attributes: ['id', 'name'],
    });
    const resultsByAppNumber = (await this.getUSASResult(hurdleId)).reduce((memo, result) => {
      memo[result.applicationNumber] = result;
      return memo;
    }, {} as { [usasAppNumber: string]: ApplicationResultUSASDto });
    const mapped: AuditFileDto[] = [];

    applicationEvals.forEach(appEval => {
      const matchedMappings = mappingItems.filter(mi => mi.application_evaluation_id! === appEval.id).map(mm => mm.competency_evaluation_id);
      const matchedComp = compEvals.filter(ce => matchedMappings.includes(ce.id)).sort((a, b) => a.Competency.name.localeCompare(b.Competency.name));
      const compObject = matchedComp.reduce((memo, c) => {
        memo[c.competency_id] = c;
        return memo;
      }, {} as { [compId: string]: CompetencyEvaluation });

      const applicant = applicants.filter(a => a.id === appEval.Application.applicant_id!)[0];

      const dto = new AuditFileDto();
      dto.assessmentHurdleId = hurdleId;
      dto.applicationId = appEval.id;
      dto.applicantId = applicant.id;
      dto.applicantName = applicant.name!;
      dto.specialtyId = appEval.Application.specialty_id!;
      dto.flagType = applicant.flag_type!;
      if (appEval.Approver) {
        dto.approverEmail = appEval.Approver.email;
        dto.approved = appEval.approved!;
      }
      dto.timestamp = appEval.created_at!.toISOString();

      dto.evaluatorEmail = appEval.Evaluator.email;
      dto.evaluatorNote = appEval.evaluation_note!;
      dto.result = resultsByAppNumber[applicant.ApplicantMetum.staffing_application_number!].minQualificationsRating;

      competencies.forEach(comp => {
        dto[comp.name! + ' Result'] = compObject[comp.id]?.CompetencySelector?.display_name || '';
        dto[comp.name + ' Justification'] = compObject[comp.id]?.evaluation_note || '';
      });
      mapped.push(dto);
    });

    logger.info(`Generated ${mapped.length} audit records`);
    return mapped.sort((a, b) => (a.applicantId > b.applicantId ? 1 : -1));
  }

  async getGeneralResult(hurdleId: string): Promise<ApplicationResultDto[]> {
    logger.info(`Generating General file for ${hurdleId}`);

    const countCheck = await AssessmentHurdle.count({
      where: {
        id: hurdleId,
      },
    });

    if (countCheck === 0) throw new HttpException(404, `${hurdleId} not found`);

    const allApplicants = await Applicant.findAll({
      where: {
        assessment_hurdle_id: hurdleId,
      },
    });
    const applicantIds = allApplicants.map(aa => aa.id);
    logger.info(`${applicantIds.length} applicants found`);

    const aggResults = await ApplicantStatusMetrics.findAll({
      where: {
        applicant_id: {
          [Op.in]: applicantIds,
        },
      },
    });

    logger.info(`${aggResults.length} ApplicantStatusMetrics found`);

    // const getFinalScore = (ar: ApplicantStatusMetrics): string => {
    //   if (ar.does_not_meet! >= ar.evaluations_required!) return 'does not meet';
    //   if (ar.exceeds! >= ar.evaluations_required!) return 'exceeds';
    //   if (ar.meets! + ar.exceeds! >= ar.evaluations_required!) return 'meets';
    //   return 'insuffient evaluations';
    // };

    const mapped: ApplicationResultDto[] = aggResults.map(ar => {
      const applicant = allApplicants.find(aa => aa.id === ar.applicant_id!)!;
      return new ApplicationResultDto({
        applicantId: ar.applicant_id,
        applicantName: applicant.name!,
        assessmentHurdleId: hurdleId,
        // finalScore: getFinalScore(ar),
      });
    });

    return mapped;
  }

  async getUSASResult(hurdleId: string): Promise<ApplicationResultUSASDto[]> {
    logger.info(`Generating USAS file for ${hurdleId}`);

    const assessmentHurdle = await AssessmentHurdle.findByPk(hurdleId, {
      include: [
        {
          model: AssessmentHurdleMeta as any,
          required: true,
        },
      ],
    });

    if (assessmentHurdle === null) throw new HttpException(404, `${hurdleId} not found`);

    const allApplicants = await Applicant.findAll({
      where: {
        assessment_hurdle_id: hurdleId,
      },
      include: [
        {
          model: ApplicantMeta as any,
          required: true,
        },
      ],
    });

    const applicantIds = allApplicants.map(aa => aa.id);
    logger.info(`${applicantIds.length} applicants found`);
    const { hurdle_display_type } = assessmentHurdle;
    const { staffing_fail_nor, staffing_pass_nor } = assessmentHurdle.AssessmentHurdleMetum;
    const getNORCode = (ar: ApplicantStatusMetrics): string => {
      if (hurdle_display_type !== 1) return '';
      switch (ar.review_status!) {
        case 'pending amendment':
          return 'PENDING_AMENDMENT';
        case 'pending review':
          return 'PENDING_REVIEW';
        case 'pending evaluations':
          return 'PENDING_EVALUATIONS';
        default:
          break;
      }
      switch (ar.evaluation_status!) {
        case 'does_not_meet':
          return staffing_fail_nor || 'DOES_NOT_PASS';
        case 'meets':
          return staffing_pass_nor || 'PASS';
        case 'error':
          return 'ERROR';
        default:
          return 'ERROR';
      }
    };

    const getRatingScore = (ar: ApplicantStatusMetrics): number | null => {
      if (assessmentHurdle.hurdle_display_type === 1) return null;
      else throw new HttpException(500, 'rating type not implemented');
    };

    const aggResults = await ApplicantStatusMetrics.findAll({
      where: {
        applicant_id: {
          [Op.in]: applicantIds,
        },
      },
      include: [
        {
          model: Applicant as any,
          required: true,
          attributes: ['id', 'assessment_hurdle_id'],
          include: [
            {
              model: ApplicantMeta as any,
              required: true,
            },
            {
              model: Application as any,
              required: true,
              separate: true,
              include: [
                {
                  model: ApplicationMeta as any,
                  required: true,
                },
              ],
            },
          ],
        },
      ],
    });
    logger.info(`${aggResults.length} ApplicantStatusMetrics found`);

    const mapped: ApplicationResultUSASDto[] = aggResults.map(ar => {
      return new ApplicationResultUSASDto({
        vacancyId: assessmentHurdle.AssessmentHurdleMetum.staffing_vacancy_id,
        assessmentId: assessmentHurdle.AssessmentHurdleMetum.staffing_assessment_id,
        applicationId: ar.Applicant.ApplicantMetum.staffing_application_id,
        applicationNumber: ar.Applicant.ApplicantMetum.staffing_application_number,
        applicationRatingId: ar.Applicant.Applications[0].ApplicationMetum.staffing_application_rating_id!,
        applicantFirstName: ar.Applicant.ApplicantMetum.staffing_first_name!,
        applicantLastName: ar.Applicant.ApplicantMetum.staffing_last_name!,
        applicantMiddleName: ar.Applicant.ApplicantMetum.staffing_middle_name!,
        ratingCombination: ar.Applicant.Applications[0].ApplicationMetum.staffing_rating_combination!,
        minQualificationsRating: getNORCode(ar),
        assessmentRating: getRatingScore(ar),
      });
    });

    return mapped;
  }

  async getRecusedApplicants(hurdleId: string): Promise<AuditFileDto[]> {
    logger.info(`Generating RecusedApplicants file for ${hurdleId}`);

    const assessmentHurdle = await AssessmentHurdle.findByPk(hurdleId, {
      include: [
        {
          model: AssessmentHurdleMeta as any,
          required: true,
        },
      ],
    });

    if (assessmentHurdle === null) throw new HttpException(404, `${hurdleId} not found`);

    const allApplicants = await Applicant.findAll({
      where: {
        assessment_hurdle_id: hurdleId,
      },
    });
    const allRecusals = await ApplicantRecusals.findAll({
      where: {
        applicant_id: allApplicants.map(a => a.id),
      },
      include: [
        {
          model: Applicant as any,
          required: true,
          include: [
            {
              model: ApplicantMeta as any,
              required: true,
            },
          ],
        },
        { model: AppUser as any, required: true },
      ],
    });

    const mapped: AuditFileDto[] = allRecusals.map(aa => {
      const dto = new AuditFileDto();
      dto.applicantId = aa.Applicant.id;
      dto.assessmentHurdleId = hurdleId;
      dto.applicantName = `${aa.Applicant.ApplicantMetum.staffing_first_name} ${aa.Applicant.ApplicantMetum.staffing_middle_name} ${aa.Applicant.ApplicantMetum.staffing_last_name}`;
      dto.evaluatorEmail = aa.AppUser.email;
      dto.evaluatorNote = 'Recused from applicant';
      dto.competencyEvaluations = 'Recused from applicant';
      dto.approverEmail = 'NA';
      dto.approved = true;
      dto.timestamp = aa.created_at!.toISOString();
      return dto;
    });

    return mapped;
  }
}
