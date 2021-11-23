import { Op } from 'sequelize';
import CreateApplicationAssignmentDto from '../dto/createapplicationassignment.dto';
import HttpException from '../exceptions/HttpException';
import { Applicant } from '../models/applicant';
import { ApplicationAssignments } from '../models/application_assignments';
import { ApplicantEvaluationFeedback } from '../models/applicant_evaluation_feedback';
import { ApplicantRecusals } from '../models/applicant_recusals';
import { ApplicantQueue } from '../models/applicant_queue';

import { isEmpty } from '../utils/isEmpty';
import { logger } from '../utils/logger';
import sequelize from 'sequelize';

export default class ApplicationAssignmentService {
  async getAll(): Promise<ApplicationAssignments[]> {
    const rst: ApplicationAssignments[] = await ApplicationAssignments.findAll();
    return rst;
  }

  async getByApplicantId(id: string): Promise<ApplicationAssignments[]> {
    if (isEmpty(id)) throw new HttpException(400, 'Applicant not found');

    const rst: ApplicationAssignments[] = await ApplicationAssignments.findAll({
      where: { applicant_id: id },
    });
    return rst;
  }

  async getByEvaluatorId(id: string, hurdleId: string): Promise<ApplicationAssignments[]> {
    if (isEmpty(id)) throw new HttpException(400, "You're not EvaluatorId");
    const rst: ApplicationAssignments[] = await ApplicationAssignments.findAll({
      where: { evaluator_id: id, assessment_hurdle_id: hurdleId },
    });
    return rst;
  }

  async upsert(body: CreateApplicationAssignmentDto): Promise<ApplicationAssignments> {
    const [rst, created] = await ApplicationAssignments.upsert(
      {
        id: body.existingId,
        applicant_id: body.applicantId,
        evaluator_id: body.evaluatorId,
        active: body.active,
        assessment_hurdle_id: body.assessmentHurdleId!,
      },
      { returning: true },
    );
    logger.debug(`Upserted ${rst.id} application_assignment`);
    return rst;
  }

  async nextQueue(hurdleId: string, currentUserId: string): Promise<{ applicant_id: string; assessment_hurdle_id: string } | null> {
    if (isEmpty(hurdleId) || isEmpty(currentUserId)) throw new HttpException(403, `Empty Parameters Submitted`);
    // Check for applicants currently assigned

    const assingedApplicant = await ApplicationAssignments.findOne({
      where: {
        evaluator_id: currentUserId,
        active: true,
        assessment_hurdle_id: hurdleId,
      },
      include: [
        {
          model: Applicant as any,
          required: true,
          attributes: ['id'],
          include: [{ model: ApplicantEvaluationFeedback as any, required: false, attributes: ['evaluation_feedback'] }],
        },
      ],
      attributes: ['applicant_id', 'assessment_hurdle_id'],
      order: [
        [Applicant, ApplicantEvaluationFeedback, 'evaluation_feedback', 'ASC NULLS LAST'],
        ['updated_at', 'DESC'],
      ],
    });

    if (assingedApplicant) {
      // If there is an assigned applicant, return that
      logger.debug(`Existing Active item in Queue for user: ${currentUserId} returning existing item ${assingedApplicant.applicant_id}`);
      return { applicant_id: assingedApplicant.applicant_id, assessment_hurdle_id: assingedApplicant.assessment_hurdle_id };
    }
    /**
     * There are no active assignments.
     *
     *
     * 1. Find all applicants in the pending list
     * 2. Find all the flagged applicants
     * 3. Find all the applicants this evaluator has recused from
     * 4. Find all the applicants that have ever been reviewed by this evaluator
     *
     */

    //

    const applicantsUnderReviewByAnyPromise = ApplicationAssignments.findAll({
      attributes: ['applicant_id'],
      where: {
        active: true,
        assessment_hurdle_id: hurdleId,
      },
    }).then(a => a.map(a => a.applicant_id));

    const flaggedApplicantsPromise = Applicant.findAll({
      attributes: ['id'],
      where: {
        flag_type: {
          [Op.not]: 0,
        },
        assessment_hurdle_id: hurdleId,
      },
    }).then(a => a.map(a => a.id));

    const recusedFromApplicantsPromise = ApplicantRecusals.findAll({
      attributes: ['applicant_id'],
      where: {
        recused_evaluator_id: currentUserId,
      },
    }).then(a => a.map(a => a.applicant_id!));

    const allAssignedApplicantsPromise = ApplicationAssignments.findAll({
      where: {
        evaluator_id: currentUserId,
        assessment_hurdle_id: hurdleId,
      },
      attributes: ['applicant_id'],
    }).then(a => a.map(a => a.applicant_id!));
    const [applicantsUnderReviewByAny, flaggedApplicants, recusedFromApplicants, allAssignedApplicants] = await Promise.all([
      applicantsUnderReviewByAnyPromise,
      flaggedApplicantsPromise,
      recusedFromApplicantsPromise,
      allAssignedApplicantsPromise,
    ]);

    /**
     * Once you have the pending, flagged, recused, and evaluated create the applicant filters
     */
    const baseApplicantFilter = allAssignedApplicants.concat(flaggedApplicants, recusedFromApplicants);
    const applicantFilterWithActiveReviewApplicants = baseApplicantFilter.concat(applicantsUnderReviewByAny);

    /**
     * Try to find applicants based off filters
     */
    let nextAssignment = await this.getFreshApplicant(hurdleId, applicantFilterWithActiveReviewApplicants);

    if (!nextAssignment) {
      nextAssignment = await this.getFreshApplicant(hurdleId, baseApplicantFilter);
    }
    if (!nextAssignment) {
      return null;
    }

    logger.debug(`Next Assignment for ${currentUserId} in ${hurdleId} is ${nextAssignment}`);
    return await this.upsertApplicationAssignment(nextAssignment!, currentUserId, hurdleId, true);
  }

  async upsertApplicationAssignment(applicant_id: string, evaluator_id: string, assessment_hurdle_id: string, active: boolean) {
    logger.debug(`Adding assignment for ${evaluator_id} in ${assessment_hurdle_id} is ${applicant_id}`);

    const [assignment] = await ApplicationAssignments.upsert(
      {
        applicant_id: applicant_id,
        evaluator_id: evaluator_id,
        assessment_hurdle_id: assessment_hurdle_id,
        active: active,
      },
      { returning: true },
    );

    logger.debug(`Created Assignment ${assignment.id}`);

    return { applicant_id: assignment.applicant_id, assessment_hurdle_id: assignment.assessment_hurdle_id };
  }

  async getFreshApplicant(hurdleId: string, filterOutApplicants: string[]) {
    // TODO:
    // We've seen Sequelize fall over with long/nested models before. Using the previous exclusion method could result in
    // abberant behavior in a medium sized hiring action - this should be redone as a few sets of raw queries

    const freshApplicant = await ApplicantQueue.findOne({
      attributes: [
        'applicant_id',
        [
          sequelize.literal(`(SELECT COUNT(*) 
            FROM application_assignments as assn 
              WHERE assn."applicant_id" = "ApplicantQueue"."applicant_id"
              AND active IS true)`),
          'current_queue_count',
        ],
      ],
      where: {
        assessment_hurdle_id: hurdleId,
        applicant_id: { [Op.notIn]: filterOutApplicants },
      },
      group: ['ApplicantQueue.applicant_id', 'evaluators'],
      order: sequelize.literal('current_queue_count ASC NULLS FIRST, evaluators DESC NULLS LAST, applicant_id DESC'),
    });
    if (!freshApplicant) {
      return null;
    }
    return freshApplicant.applicant_id;
  }
}
