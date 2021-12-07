import HttpException from '../exceptions/HttpException';
import { isEmpty } from '../utils/isEmpty';
import { logger } from '../utils/logger';
import { Applicant } from '../models/applicant';
import CreateApplicantDto, { CreateApplicantBulkDto } from '../dto/createapplicant.dto';
// import ApplicantRecusalDto from '../dto/applicantrecusal.dto';
import { ApplicantMeta } from '../models/applicant_meta';
import { ApplicantRecusals } from '../models/applicant_recusals';
import { ApplicationAssignments } from '../models/application_assignments';
import BulkUSASApplicationsDto, { USASApplicationDto } from '../dto/BulkApplicantApplications.dto';
import ApplicationService from './application.service';
import SpecialtyService from './specialty.service';
import CompetencyService from './competency.service';
import CreateApplicationDto from '../dto/createapplication.dto';
import { Application } from '../models/application';
import { ApplicationEvaluation } from '../models/application_evaluation';
import { Competency } from '../models/competency';
import { Op, Transaction } from 'sequelize';
import ApplicantDisplayDto, { CompetencyEvaluationDto, CompetencyWithSelectors } from '../dto/applicantdisplay.dto';
import { SpecialtyCompetencies } from '../models/specialty_competencies';
import { CompetencyEvaluation } from '../models/competency_evaluation';
import { CompetencySelectors } from '../models/competency_selectors';
import { Specialty } from '../models/specialty';
import { ApplicantEvaluationFeedback } from '../models/applicant_evaluation_feedback';
import { ApplicationEvaluationCompetency } from '../models/application_evaluation_competency';
import { DBInterface } from '../database';
import { CompetencyEvaluationCount } from '../models/competency_evaluation_count';
import { ApplicantApplicationEvaluationNotes } from '../models/applicant_application_evaluation_notes';
import marked from 'marked';
marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
});
const converter = marked;

export default class ApplicantService {
  applicationService = new ApplicationService();
  specialtyService = new SpecialtyService();
  competencyService = new CompetencyService();

  async getById(id: string): Promise<Applicant> {
    const applicant = await Applicant.findByPk(id);
    if (!applicant) throw new HttpException(404, 'Not Found');
    return applicant;
  }

  async getByIdWithMeta(applicantId: string, hurdleId: string): Promise<[Applicant, ApplicantMeta]> {
    if (isEmpty(applicantId) || isEmpty(hurdleId)) throw new HttpException(400, 'Applicant not found');
    const rst = await Applicant.findByPk(applicantId, {
      //Applicant.associations.ApplicantMeta
      include: [ApplicantMeta as any],
      rejectOnEmpty: false,
    });
    if (!rst) throw new HttpException(404, 'Not Found');

    if (rst.assessment_hurdle_id !== hurdleId) {
      throw new HttpException(403, `Applicant ${applicantId} does not below to AssessmentHurdle ${hurdleId}`);
    }

    const meta = await rst.getApplicantMetum();
    return [rst, meta];
  }

  async getAll(): Promise<Applicant[]> {
    const rst: Applicant[] = await Applicant.findAll();
    return rst;
  }

  async bulkUpsert(body: CreateApplicantBulkDto, assessmentHurdleId: string): Promise<Applicant[]> {
    const rst = await Promise.all(body.applicants.map(a => this.upsert(a, assessmentHurdleId)));
    return rst;
  }

  async upsert(body: CreateApplicantDto, assessmentHurdleId: string): Promise<Applicant> {
    const [instance] = await Applicant.upsert({
      id: body.existingId,
      assessment_hurdle_id: assessmentHurdleId,
      flag_message: body.flagMessage,
      flag_type: body.flagType,
      name: body.name,
      additional_note: body.additionalNote,
    });

    logger.debug(`Upserted Applicant ${instance.id}`);
    const [meta, created] = await ApplicantMeta.findOrCreate({
      where: { applicant_id: instance.id },
      defaults: {
        staffing_application_id: body.applicationId,
        staffing_first_name: body.firstName,
        staffing_last_name: body.lastName,
        staffing_middle_name: body.middleName,
        applicant_id: instance.id,
        staffing_application_number: body.applicationNumber,
      },
    });

    if (!created) {
      meta.update({
        staffing_application_id: body.applicationId,
        staffing_first_name: body.firstName,
        staffing_last_name: body.lastName,
        staffing_middle_name: body.middleName,
        applicant_id: instance.id,
        staffing_application_number: body.applicationNumber,
      });
    }

    logger.debug(`Upserted ApplicantMeta ${meta.id}`);

    return instance;
  }

  async recuse(dbInstance: DBInterface, applicantId: string, evaluatorId: string): Promise<ApplicantRecusals> {
    const [ar, created] = await ApplicantRecusals.findOrCreate({
      where: { applicant_id: applicantId, recused_evaluator_id: evaluatorId },
      defaults: {
        applicant_id: applicantId,
        recused_evaluator_id: evaluatorId,
      },
    });

    if (!created) {
      ar.update({
        applicant_id: applicantId,
        recused_evaluator_id: evaluatorId,
      });
    }
    logger.debug(`Recusal by ${evaluatorId} for applicant: ${applicantId}, recordId: ${ar.id}`);
    //remove all assignments across hurdles when a recusal happens
    const [removedAssignments] = await ApplicationAssignments.update(
      {
        active: false,
      },
      {
        where: { applicant_id: ar.applicant_id, evaluator_id: ar.recused_evaluator_id },
      },
    );
    if (removedAssignments > 0) {
      logger.debug(`Removed Assignment for ${ar.recused_evaluator_id} on ${ar.applicant_id}`);
    }

    const existingEvaluations = await ApplicationEvaluation.findAll({
      where: {
        evaluator: evaluatorId,
      },
      include: [
        {
          model: Application as any,
          required: true,
          where: {
            applicant_id: applicantId,
          },
        },
        {
          model: ApplicationEvaluationCompetency as any,
          required: true,
          include: [
            {
              model: CompetencyEvaluation as any,
              required: true,
            },
          ],
        },
      ],
    });
    if (existingEvaluations.length) {
      logger.debug(`${existingEvaluations.length} existing evaluations to remove`);

      const totalDeleted = await dbInstance.transaction(async (t: Transaction) => {
        let totalDeleted = 0;

        const feedbacksDeleted = await ApplicantEvaluationFeedback.destroy({
          where: {
            applicant_id: applicantId,
            evaluator_id: evaluatorId,
          },
        });
        logger.debug(`[Transaction] ${feedbacksDeleted} ApplicantEvaluationFeedback to delete`);
        totalDeleted += feedbacksDeleted;

        //same performance that deleting by Ids
        for await (const evaluation of existingEvaluations) {
          logger.debug(`[Transaction] ${evaluation.ApplicationEvaluationCompetencies.length} ApplicationEvaluationCompetencies to delete`);
          const aecDeleted = await Promise.all(evaluation.ApplicationEvaluationCompetencies.map(element => element.destroy({ transaction: t })));
          totalDeleted += aecDeleted.length;

          const compsEvals = evaluation.ApplicationEvaluationCompetencies.map(aec => aec.CompetencyEvaluation);
          logger.debug(`[Transaction] ${compsEvals.length} CompetencyEvaluation to delete`);

          const ceDeleted = await Promise.all(compsEvals.map(element => element.destroy({ transaction: t })));
          totalDeleted += ceDeleted.length;

          await evaluation.destroy({ transaction: t });
          totalDeleted += 1;
        }

        return totalDeleted;
      });
      logger.debug(`Removing evaluations deleted ${totalDeleted} records`);
    }

    return ar;
  }

  async flag(applicantId: string, flagType: number, message: string, userId?: string): Promise<Applicant> {
    // const result: Applicant = await this.service.flag(applicantId, 1, `${evaluatorEmail}: ${flagMessage}`, flaggerId);

    const [number, updates] = await Applicant.update(
      {
        flag_message: message,
        flag_type: flagType,
      },
      {
        where: {
          id: applicantId,
        },
        returning: true,
      },
    );

    if (number !== 1) throw new HttpException(500, 'Flagging Failed');
    const removedAssignments = await ApplicationAssignments.destroy({
      where: { applicant_id: applicantId, active: true, evaluator_id: userId },
    });
    if (removedAssignments > 0) {
      logger.debug(`Removed all assignments for ${applicantId}`);
    }
    return updates[0];
  }
  // This must be used with USAS due to the specialty `localId` === `applicationMetaRatingCombination`
  async bulkUSASUpsert(body: BulkUSASApplicationsDto, hurdleId: string): Promise<Applicant[]> {
    logger.debug(`BulkUSASUpsert: ${body.applications.length} applications`);
    const specialties = await this.specialtyService.getAllByHurdleId(hurdleId);
    const specialtyIdByLocalId: { [localId: string]: string } = specialties.reduce((memo: { [localId: string]: string }, specialty) => {
      memo[specialty.local_id] = specialty.id;
      return memo;
    }, {});

    const applicationsByApplicant = body.applications.reduce(
      (
        memo: {
          [usasNumber: string]: {
            applicant: {
              firstName: string;
              lastName: string;
              middleName: string;
              staffingApplicationId: string;
              staffingApplicationNumber: string;
            };
            applications: {
              staffingRatingId: string;
              staffingAssessmentId: string;
              staffingRatingCombination: string;
            }[];
          };
        },
        application: USASApplicationDto,
      ) => {
        const {
          firstName,
          lastName,
          middleName,
          staffingApplicationId,
          staffingApplicationNumber,
          staffingAssessmentId,
          staffingRatingCombination,
          staffingRatingId,
        } = application;
        if (!specialtyIdByLocalId[staffingRatingCombination]) {
          throw new HttpException(500, `Application ratingCombinations of ${staffingRatingCombination} does not match any specialty localId`);
        }
        if (staffingApplicationNumber in memo) {
          memo[staffingApplicationNumber].applications.push({
            staffingRatingId,
            staffingAssessmentId,
            staffingRatingCombination,
          });
        } else {
          memo[staffingApplicationNumber] = {
            applicant: {
              firstName,
              lastName,
              middleName,
              staffingApplicationId,
              staffingApplicationNumber,
            },
            applications: [
              {
                staffingRatingId,
                staffingAssessmentId,
                staffingRatingCombination,
              },
            ],
          };
        }
        return memo;
      },
      {},
    );

    const vals = Object.values(applicationsByApplicant);

    logger.debug(`BulkUSASUpsert: ${vals.length} applications by applicants`);
    const applicants = await Promise.all(
      vals.map(async ({ applicant, applications }) => {
        const applicantDTO = new CreateApplicantDto();
        applicantDTO.assessmentHurdleId = hurdleId;
        applicantDTO.firstName = applicant.firstName;
        applicantDTO.lastName = applicant.lastName;
        applicantDTO.middleName = applicant.middleName;
        applicantDTO.name = `${applicant.firstName} ${applicant.middleName} ${applicant.lastName}`;
        applicantDTO.applicationNumber = applicant.staffingApplicationNumber;
        applicantDTO.applicationId = applicant.staffingApplicationId;
        const applicantWithId = await this.upsert(applicantDTO, hurdleId);
        logger.debug(`BulkUSASUpsert: Created ${applicantWithId.id} applicant`);
        await Promise.all(
          applications.map(application => {
            const { staffingRatingCombination, staffingRatingId, staffingAssessmentId } = application;
            const applicationDto = new CreateApplicationDto();
            applicationDto.applicantId = applicantWithId.id;
            applicationDto.specialtyId = specialtyIdByLocalId[staffingRatingCombination];

            applicationDto.applicationMetaRatingId = staffingRatingId;
            applicationDto.applicationMetaAssessmentId = staffingAssessmentId;
            applicationDto.applicationMetaRatingCombination = staffingRatingCombination;
            applicationDto.applicationMetaId = staffingRatingId;
            logger.debug(`BulkUSASUpsert: Creating application for ${applicant.staffingApplicationNumber} for ${applicationDto.specialtyId}`);
            this.applicationService.upsert(applicationDto);
          }),
        );
        return applicantWithId;
      }),
    );
    logger.debug(`BulkUSASUpsert: ${applicants} total applicants`);
    return applicants;
  }
  /**
   * Require:
   * application_evaluation.evaluation_note
   * applicant_evaluation_feedback.evaluation_feedback
   * competency.*
   * competency_selectors.*
   * competency_evaluation.evaluation_note
   * competency_evaluation.competency_selector_id
   */
  async getDisplay(applicantId: string, currentUserId: string): Promise<ApplicantDisplayDto> {
    if (isEmpty(applicantId)) throw new HttpException(400, 'Empty Parameters');

    const applicant = await Applicant.findByPk(applicantId);

    if (!applicant) throw new HttpException(404, `applicant ${applicantId} not found`);

    // logger.debug(`getDisplay for ${applicantId} as currentUser ${currentUserId}`);

    // const applications = applicant.Applications!;

    // const specialties = applications
    //   .flatMap(a => a.Specialty)
    //   .filter((val, idx, arr) => {
    //     return arr.indexOf(val) === idx;
    //   });
    // const specialtyIds = specialties.map(s => s.id);

    // const applicationEvaluationIds = applications
    //   .flatMap(a => a.ApplicationEvaluations)
    //   .filter((val, idx, arr) => {
    //     return arr.indexOf(val) === idx;
    //   })
    //   .map(a => a.id);

    // const specCompMap = await SpecialtyCompetencies.findAll({
    //   where: {
    //     specialty_id: {
    //       [Op.in]: specialtyIds,
    //     },
    //   },
    //   include: [
    //     {
    //       model: Competency as any,
    //       required: true,
    //       include: [CompetencySelectors as any],
    //     },
    //   ],
    // });

    // const competencyIds = specCompMap.map(scm => scm.competency_id!);

    // const existingEvals = await ApplicationEvaluationCompetency.findAll({
    //   where: {
    //     application_evaluation_id: {
    //       [Op.in]: applicationEvaluationIds,
    //     },
    //   },
    //   include: [
    //     {
    //       model: CompetencyEvaluation as any,
    //       required: false,
    //       where: {
    //         competency_id: {
    //           [Op.in]: competencyIds,
    //         },
    //         evaluator: currentUserId,
    //       },
    //     },
    //   ],
    // });

    const feedback = await ApplicantEvaluationFeedback.findOne({
      where: {
        applicant_id: applicantId,
        evaluator_id: currentUserId,
      },
    });

    const { competencies, evaluatedCompetencies, specialtyMap, specialties, isTieBreaker, competencyJustifications } =
      await this.competencyService.getAllActiveForApplicant(currentUserId, applicantId, applicant.assessment_hurdle_id!);

    // let applicantNotes = [] as string[];
    // // if (isTieBreaker) {
    // //   applicantNotes = (
    // //     await ApplicantApplicationEvaluationNotes.findAll({
    // //       where: { applicant_id: applicantId },
    // //     })
    // //   )
    // //     .map(applicantNotes => {
    // //       return applicantNotes.evaluation_note;
    // //     })
    // //     .filter(e => e) as string[];
    // }
    const competencyArray = Object.values(competencies);
    if (!competencyArray.length) {
      const removedAssignments = await ApplicationAssignments.destroy({
        where: { applicant_id: applicantId, active: true, evaluator_id: currentUserId },
      });
      if (removedAssignments > 0) {
        logger.debug(`Removed all assignments for ${applicantId}`);
      }
      throw new HttpException(
        400,
        `This applicant was completed by other SMEs - please go to the next applicant or refresh the page for a new assignment.`,
      );
    }

    const specialtyCompetencyMap = Object.entries(specialtyMap).reduce((memo, [sid, cSet]) => {
      memo[sid] = Array.from(cSet);
      return memo;
    }, {} as { [specialtyId: string]: string[] });

    const dto = new ApplicantDisplayDto();
    dto.applicant = applicant;
    dto.applicantNotes = [];
    dto.specialties = specialties;
    dto.feedback = feedback?.evaluation_feedback || '';
    dto.feedbackTimestamp = feedback?.updated_at || new Date();
    dto.competencies = competencyArray;
    dto.specialtyCompetencyMap = specialtyCompetencyMap;
    dto.competencyEvaluations = evaluatedCompetencies;
    dto.isTieBreaker = isTieBreaker;
    dto.competencyJustifications = competencyJustifications;
    return dto;
  }
}
