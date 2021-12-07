import { Transaction } from 'sequelize/types';
import { DBInterface } from '../database';
import { EvaluationApplicationFeedbackDto } from '../dto/evaluationfeedback.dto';
import { EvaluationApplicationReviewSubmitDto } from '../dto/evaluationreviewsubmit.dto';
import EvaluationSubmitDto from '../dto/evaluationsubmit.dto';
import HttpException from '../exceptions/HttpException';
import { Applicant } from '../models/applicant';
import { Application } from '../models/application';
import { ApplicationAssignments } from '../models/application_assignments';
import { ApplicationEvaluation, approvalTypes } from '../models/application_evaluation';
import { ApplicationEvaluationCompetency } from '../models/application_evaluation_competency';
import { ApplicantEvaluationFeedback } from '../models/applicant_evaluation_feedback';
import { Competency } from '../models/competency';
import { CompetencyEvaluation } from '../models/competency_evaluation';
import { CompetencySelectors } from '../models/competency_selectors';
import { Specialty } from '../models/specialty';
import { SpecialtyCompetencies } from '../models/specialty_competencies';

import { logger } from '../utils/logger';
import { AssessmentHurdle } from '../models/assessment_hurdle';
import CompetencyService from './competency.service';
const displayTypes = {
  selectorsWithNoJustification: 1,
  experience: 2,
  selectorsRequiringJustification: 3,
};
import { CompetencyEvaluationCount } from '../models/competency_evaluation_count';
export default class EvaluationService {
  competencyService = new CompetencyService();
  /**
   *
   * @param dbInstance
   * @param body
   * @param assessmentHurdleId
   * @param applicantId
   * @param evaluatorId
   * @returns
   *
   * This is a bit of a commented out wasteland due to some changing
   * requirements. As the tool was originally built to handle _multiple_
   * specialties, there was a lot of logic that went into validating that.
   *
   * This is no longer the case.
   *
   * It looks like we should have built in "evaluation_validation_type"
   * attached to each "hiring action" to determine how the evaluation would be
   * validated. Specifically there are have been evaluations that have ranged
   * from:
   *
   * - only a single failing competency is required
   * - all competencies must be selected
   * - all competencies must have explanations (except for experience competencies)
   *
   * and some variations of these.
   */
  async submitEvaluation(
    dbInstance: DBInterface,
    body: EvaluationSubmitDto,
    assessmentHurdleId: string,
    applicantId: string,
    evaluatorId: string,
  ): Promise<[ApplicationEvaluation[], CompetencyEvaluation[]]> {
    try {
      logger.debug(`Submit Evaluation for ${applicantId}`);
      // const applicantEvaluationNote = body.note;

      // Used to determine if there needs to be a review at all
      let anyEvalNote = body.note;

      // let applicantScreenedOut = false;
      const applicant = await Applicant.findByPk(applicantId);

      if (!applicant) throw new HttpException(404, `Applicant not found, applicant id:${applicantId}`);
      if (applicant?.assessment_hurdle_id !== assessmentHurdleId) {
        logger.error(`Applicant appeared in wrong hurdle${applicant.id}`);
        throw new HttpException(
          400,
          `Applicant is not part of the assessment hurdle. ApplicantId: ${applicant?.id}; assessmentHurdleId: ${assessmentHurdleId}`,
        );
      }
      const assignment = await ApplicationAssignments.findOne({
        where: {
          assessment_hurdle_id: assessmentHurdleId,
          evaluator_id: evaluatorId,
          applicant_id: applicant.id!,
        },
        attributes: ['active'],
      });
      if (!assignment || !assignment.active!) {
        throw new HttpException(
          400,
          `Applicant was removed from your assignment queue. This is likely because another SME finished their evaluation before you of this applicant or the reviewers updated the evaluation and accepted your previous justifications. Continue to the next applicant and reach out to your point of contact if you have concerns.`,
        );
      }

      const allApplications = await Application.findAll({
        where: { applicant_id: applicantId },
        include: [
          {
            model: Specialty as any,
            required: true,
            include: [SpecialtyCompetencies as any],
          },
        ],
      });
      // logger.debug(`${allApplications.length} applications found for ${applicantId}`);
      // There is no longer any screenout OR specialty...

      // const allSpecialties: Specialty[] = allApplications.map(a => a.Specialty);

      // const competencyIdsBySpecialty = allSpecialties.reduce((memo, s) => {
      //   memo[s.id!] = s.SpecialtyCompetencies.map(sc => sc.competency_id!);
      //   return memo;
      // }, {} as { [specialtyId: string]: string[] });

      // const uniqueCompetencyIds = Object.values(competencyIdsBySpecialty)
      //   .flat()
      //   .filter((v, idx, arr) => arr.indexOf(v) === idx);

      // const allCompetencies = await Competency.findAll({
      //   where: { id: uniqueCompetencyIds },
      //   attributes: ['id', 'screen_out', 'display_type'],
      // });
      // logger.debug(`${allCompetencies.length} competencies for candidate`);

      // const allCompetencyScreenoutStatusById = allCompetencies.reduce((memo, c) => {
      //   memo[c.id] = {
      //     screenout: c.screen_out!,
      //     requireNote: c.display_type == displayTypes.selectorsRequiringJustification,
      //   };
      //   return memo;
      // }, {} as { [compId: string]: { screenout: boolean; requireNote: boolean } });

      const submittedSelectorIds: string[] = body.competencyEvals.map(ce => ce.selectorId).filter(s => s);

      logger.debug(`${submittedSelectorIds.length} Competency Selectors submitted`);

      //get the competency Selectors which contain pass/fail attributes
      const evalSelectorIds = await CompetencySelectors.findAll({
        attributes: ['point_value', 'competency_id', 'id'],
        where: {
          id: submittedSelectorIds,
        },
      });

      const evalNoteBySelectorId = body.competencyEvals.reduce((m, c) => {
        anyEvalNote += c.note || '';
        m[c.selectorId] = c.note;
        return m;
      }, {} as { [compId: string]: string });

      const evalByCompId = evalSelectorIds.reduce((memo, s) => {
        memo[s.competency_id!] = {
          selectorId: s.id,
          note: evalNoteBySelectorId[s.id],
          point_value: s.point_value!,
        };
        return memo;
      }, {} as { [compId: string]: { selectorId: string; note: string; point_value: number } });

      // Ensure that all selectors are present and valid
      // `where id=submittedSelectorIds & length == length`
      logger.debug(`Fetched ${evalSelectorIds.length} CompetencySelectors`);
      if (evalSelectorIds.length != submittedSelectorIds.length) {
        throw new HttpException(400, 'Competency evaluation selector not found!');
      }
      //#region competency validation

      //#region simple comp validation
      /**
       * Assumes a single implementation where:
       * 0. Has correct tie-breaker status
       * 1. All _active_ competencies must be reviewed
       * 2. All non-experience competencies must have explanations
       * 3. Nothing else matters.
       * */
      //
      const competencyIdsSubmitted = body.competencyEvals.map(ce => ce.competencyId);

      const activeCompetencies = await this.competencyService.getAllActiveForApplicant(evaluatorId, applicantId, assessmentHurdleId);

      // 0. Has correct tie breaker status
      const { isTieBreaker } = activeCompetencies;
      if (isTieBreaker !== body.isTieBreaker) {
        throw new HttpException(
          400,
          `There was an error evaluating ${applicant.name}. It’s possible that an evaluation was submitted by another SME that requires your review. To resolve:
1. Please try to continue to the next applicant, or resubmit your review if the same applicant reappears.

2. If you are unable to review an applicant despite multiple submissions, please flag the applicant with a note about what you observed.

3. If flagging the applicant does not work, please try refreshing the page. If you are still stuck after refreshing the page, please contact HR.`,
        );
      }

      // 1. Check that all active competencies are getting reviewed
      const allCompetenciesReviewed = Object.keys(activeCompetencies.competencies).sort().join('') === competencyIdsSubmitted.sort().join('');
      if (!allCompetenciesReviewed) {
        throw new HttpException(400, 'Review is incomplete');
      }
      // 2. Check that all non-experience competencies have explanations
      const competencyById = activeCompetencies.competencies;
      body.competencyEvals.forEach(ce => {
        const currentDisplayType = competencyById[ce.competencyId].display_type;
        switch (true) {
          // temporarily have both selectors fail if there is no justification.
          case currentDisplayType === displayTypes.selectorsRequiringJustification:
          case currentDisplayType === displayTypes.selectorsWithNoJustification:
            if (!ce.note || !ce.note.length) {
              throw new HttpException(400, `Competency requires a justification: ${competencyById[ce.competencyId].name}`);
            }
            return;
          case currentDisplayType === displayTypes.experience:
          default:
            return;
        }
      });
      //#endregion
      /*
    const applicantReviewedCompetencies = await this.competencyService.getAll;
    // Check Competencies 1: Missing Competencies
    // if all point_values > 0 then we must have all the CompetencyIds submitted
    if (evalSelectorIds.every(ce => ce.point_value! > 0)) {
      const allCompetenciesPresent = allCompetencies.every(c => c.id in evalByCompId);
      //all the ids returned should equal what we expected
      if (!allCompetenciesPresent) {
        throw new HttpException(400, `Competency counts off for eval point_value`);
      }
    }
    // Check Competencies 2: Extra competencies
    // Check for invalid comp submissions
    if (!evalSelectorIds.every(ce => ce.competency_id! in allCompetencyScreenoutStatusById)) {
      throw new HttpException(400, `Invalid Extra Competency Data submitted`);
    }

    // Validate that we have everything we need for each specialty
    /**
     * Validate each specialty
     *
     * Specialty Check 1a: Did applicant fail by screenout?
     * Specialty Check 1b: is there a competency note?
     *
     * Specialty Check 2: are all competencies present?
     * Specialty check 3a: Did applicant fail by point value?
     * Specialty Check 3b: is there an applicant note?
     *
     *\/
    Object.entries(competencyIdsBySpecialty).forEach(([specialtyId, competencyIds]) => {
      const specialty = allSpecialties.find(s => (s.id = specialtyId))!;
      const competencies = competencyIds.map(cid => ({
        id: cid,
        screen_out: allCompetencyScreenoutStatusById[cid].screenout,
        requireNote: allCompetencyScreenoutStatusById[cid].requireNote,
      }));
      logger.debug(`Checking Pass/Fail logic for specialty ${specialtyId} with ${competencyIds.length} competencies`);

      // Specialty Check 1a: Did applicant fail by screenout?
      const failingEvals = evalSelectorIds.filter(es => es.point_value === 0);
      const screenedOut = failingEvals.reduce((screenedOut, es) => {
        if (screenedOut) {
          return true;
        }
        if (allCompetencyScreenoutStatusById[es.competency_id!].screenout) {
          logger.debug(`Screening out on competency ${es.competency_id} with note '${evalByCompId[es.competency_id!].note}'`);
          // Specialty Check 1b: is there a competency note?

          if (allCompetencyScreenoutStatusById[es.competency_id!].requireNote && !evalByCompId[es.competency_id!].note) {
            throw new HttpException(400, 'Failing competencies require a note');
          }
          // applicantScreenedOut = true;
          return true;
        }
        return false;
      }, false);

      if (screenedOut) {
        logger.debug(`Screened out of specialty`);
        // Valid for this specialty
        return;
      }

      // Specialty Check 2: are all competencies present?
      competencies.forEach(c => {
        if (!evalByCompId[c.id].selectorId) {
          throw new HttpException(400, 'All competencies require a value');
        }
      });
      // Add point values to competencies
      const competenciesWithPoints = competencies.map(c => ({ ...c, points: evalByCompId[c.id].point_value }));

      // Specialty check 3a: Did applicant fail by point value?
      const totalVal = competenciesWithPoints.reduce((sum, comp) => (sum += comp.points), 0);
      logger.debug(`Total Score: ${totalVal}`);
      if (totalVal < specialty.points_required!) {
        logger.debug(`Score failing with a value of: ${totalVal}/specialty.points_required`);
        // Specialty Check 3b: is there an applicant note?

        if (!applicantEvaluationNote) {
          throw new HttpException(400, 'Failing specialties require an application note');
        }
      }
    });

    //#endregion
*/
      logger.debug(`Creating evaluation results for ${allApplications.length} applications for applicant ${applicantId}`);
      //insert results
      const appEvals = allApplications.map(a => ({
        application_id: a.id,
        evaluation_note: body.note,
        evaluator: evaluatorId,
        approved: null,
        approver_id: null,
        feedback_timestamp: new Date(),
      }));

      //create a sequelize managed transaction
      const [applicationEvals, competencyEvals] = await dbInstance.transaction(async (t: Transaction) => {
        const applicationEvals = await Promise.all(
          appEvals.map(async ae => (await ApplicationEvaluation.upsert(ae, { transaction: t, returning: true }))[0]),
        );
        // const applicationEvals = await ApplicationEvaluation.bulkCreate(appEvals, {
        //   returning: true,
        //   transaction: t,
        //   updateOnDuplicate: ['evaluation_note'],
        // });
        logger.debug(`[Transaction] Upserted ${applicationEvals.length} ApplicationEvaluations`);

        const compEvals = Object.entries(evalByCompId).map(([compId, evaluation]) => ({
          competency_id: compId,
          applicant: applicantId!,
          evaluator: evaluatorId,
          evaluation_note: evaluation.note,
          competency_selector_id: evaluation.selectorId,
        }));

        const competencyEvals = await Promise.all(
          compEvals.map(async ce => (await CompetencyEvaluation.upsert(ce, { transaction: t, returning: true }))[0]),
        );
        // const competencyEvals = await CompetencyEvaluation.bulkCreate(compEvals, {
        //   returning: true,
        //   transaction: t,
        //   updateOnDuplicate: ['evaluation_note', 'competency_selector_id'],
        // });
        logger.debug(`[Transaction] Upserted ${competencyEvals.length} CompetencyEvaluations`);

        const mappings: any[] = [];
        applicationEvals.forEach(ae => {
          competencyEvals.forEach(ce => {
            mappings.push({ application_evaluation_id: ae.id, competency_evaluation_id: ce.id });
          });
        });

        /**
         * This could be a bulkCreate, but for clarity it will match the pattern above.
         */
        // const createdMappings = await ApplicationEvaluationCompetency.bulkCreate(mappings, { returning: true, transaction: t, ignoreDuplicates: true });

        const createdMappings = await Promise.all(
          mappings.map(async m => (await ApplicationEvaluationCompetency.upsert(m, { transaction: t, returning: true }))[0]),
        );

        logger.debug(
          `[Transaction] Upserted ${createdMappings.length} ApplicationEvaluationCompetency from ${applicationEvals.length} ApplicationEvaluation and ${competencyEvals.length} CompetencyEvaluation`,
        );

        await ApplicationAssignments.upsert(
          { active: false, applicant_id: applicantId, evaluator_id: evaluatorId, assessment_hurdle_id: assessmentHurdleId },
          { transaction: t },
        );

        logger.debug(`[Transaction] Updated evaluator [${evaluatorId}] assignment of ${applicantId} to inactive`);
        /**
         * Only for Resume review - pass evaluations with no note
         */
        if (!anyEvalNote) {
          const assessment = await AssessmentHurdle.findByPk(assessmentHurdleId, {
            attributes: ['require_review_for_all_passing'],
          });
          if (!assessment) {
            throw new Error('No assessment found');
          }
          // We don't do auto validations anymore I guess.
          // if (!assessment.require_review_for_all_passing) {
          //   const evalutaionIds = applicationEvals.map(a => a.id);
          //   const [num] = await ApplicationEvaluation.update(
          //     {
          //       approved: true,
          //       approved_type: approvalTypes.automaticApproval,
          //     },
          //     {
          //       transaction: t,
          //       where: { id: evalutaionIds },
          //       returning: true,
          //     },
          //   );
          //   logger.debug(`ApplicationEvaluation auto-validation for ${num} application evaluations.`);
          // }
        }
        return [applicationEvals, competencyEvals];
      });
      logger.debug(`SubmitEvaluation resulted in ${applicationEvals.length} ApplicationEvals and ${competencyEvals.length} CompetencyEvals`);
      return [applicationEvals, competencyEvals];
    } catch (err) {
      await ApplicationAssignments.upsert({
        active: false,
        applicant_id: applicantId,
        evaluator_id: evaluatorId,
        assessment_hurdle_id: assessmentHurdleId,
      });
      throw err;
    }
  }

  async submitApplicationFeedback(
    body: EvaluationApplicationFeedbackDto,
    assessmentHurdleId: string,
    applicantId: string,
    reviewer: string,
  ): Promise<ApplicantEvaluationFeedback> {
    const [rst] = await ApplicantEvaluationFeedback.upsert(
      {
        id: body.existingId,
        applicant_id: applicantId,
        evaluation_feedback: body.feedback,
        evaluator_id: body.evaluatorId,
        feedback_author_id: reviewer,
        feedback_timestamp: new Date(),
      },
      {
        returning: true,
      },
    );
    logger.debug(`Upserted ${rst.id} ApplicantEvaluationFeedback`);

    const [ApplicationAssignment] = await ApplicationAssignments.upsert({
      active: true,
      applicant_id: applicantId,
      evaluator_id: body.evaluatorId,
      assessment_hurdle_id: assessmentHurdleId!,
    });

    logger.debug(`Updated ApplicationAssignments ${ApplicationAssignment.id} to active due to feedback`);

    return rst;
  }

  async submitApplicationReview(
    db: DBInterface,
    body: EvaluationApplicationReviewSubmitDto,
    reviewerId: string,
    assessmentHurdleId: string,
  ): Promise<ApplicationEvaluation> {
    const assessmentHurdleIds = (
      await Applicant.findAll({
        attributes: ['assessment_hurdle_id'],
        include: [
          {
            required: true,
            model: Application as any,
            attributes: ['id'],

            include: [
              {
                model: ApplicationEvaluation as any,
                required: true,
                attributes: ['id'],
                where: {
                  id: body.evaluationId,
                },
              },
            ],
          },
        ],
      })
    ).flatMap(a => a['assessment_hurdle_id']);

    const canUpdate = assessmentHurdleIds.reduce((id: string | boolean, nextId) => {
      if (!id) return id;
      return id === nextId;
    }, assessmentHurdleId as string);

    if (!canUpdate) {
      throw new HttpException(
        401,
        `Reviewer is unauthorized on applicant set. Reviewer: ${reviewerId} Applicant set: ${JSON.stringify(body.evaluationId)}`,
      );
    }
    // const currentEvals = await ApplicationEvaluation.findAll({
    //   where: {
    //     id: body.evaluationId,
    //   },
    // });
    // // You can only update if the current evaluation is either false or there is no evaluation. Unapproved applications must be returned by the SME.
    // const canBeUpdated = currentEvals
    //   .map(ce => ce.approved)
    //   .reduce((memo, approved) => {
    //     if (!memo) return memo;
    //     if (approved === false) return false;
    //     return true;
    //   }, true);

    // if (!canBeUpdated && body.review) {
    //   throw new HttpException(400, `Review was previously invalidated and must be resubmitted by applicant before it can be updated.`);
    // }
    const [num, updated] = await ApplicationEvaluation.update(
      {
        approved: body.review,
        approver_id: reviewerId,
      },
      {
        where: { id: body.evaluationId },
        returning: true,
      },
    );
    await Promise.all(body.evaluationId.map(async id => await db.auditQuery(`SELECT "audit_evaluation"('${id}');`)));
    const appEval = updated[0];
    const application = await appEval.getApplication();
    await ApplicationAssignments.upsert({
      active: !body.review,
      assessment_hurdle_id: assessmentHurdleId,
      evaluator_id: appEval.evaluator!,
      applicant_id: application.applicant_id!,
    });
    logger.debug(`Review Submission updated ${num} ApplicationEvaluation for ${body.evaluationId}`);
    return updated[0];
  }
}
