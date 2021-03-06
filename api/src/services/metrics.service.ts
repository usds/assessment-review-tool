import { Op } from 'sequelize';

import { logger } from '../utils/logger';

import { Applicant } from '../models/applicant';
import { ApplicantStatusMetrics } from '../models/applicant_status_metrics';
import { AssessmentHurdle } from '../models/assessment_hurdle';
import { AssessmentHurdleUser } from '../models/assessment_hurdle_user';
import { ApplicantRecusals, ApplicationAssignments, ApplicationEvaluationAgg, AppUser, ReviewerMetrics } from '../models/init-models';
import { EvaluatorMetrics } from '../models/evaluator_metrics';

type ApplicantNameKey = { [applicantId: string]: string };
type AppUserNameKey = { [appUserId: string]: { name: string; email: string; role: number } };
export default class MetricsService {
  private async _getApplicantNames(hurdleId: string): Promise<ApplicantNameKey> {
    const applicants = await Applicant.findAll({
      where: {
        assessment_hurdle_id: hurdleId,
      },
    });

    return applicants.reduce((memo, a) => {
      memo[a.id] = a.name!;
      return memo;
    }, {} as ApplicantNameKey);
  }
  private async _getUserNames(hurdleId: string): Promise<AppUserNameKey> {
    const assessmentHurdleEvaluators = await AssessmentHurdleUser.findAll({
      where: {
        assessment_hurdle_id: hurdleId,
      },
      attributes: ['role'],
      include: [
        {
          model: AppUser as any,
          required: true,
          attributes: ['id', 'email', 'name'],
        },
      ],
    });
    return assessmentHurdleEvaluators
      .flatMap(e => {
        return { id: e.AppUser.id, name: e.AppUser.name, email: e.AppUser.email, role: e.role };
      })
      .reduce((memo, appuser) => {
        memo[appuser.id] = { name: appuser.name!, email: appuser.email!, role: appuser.role };
        return memo;
      }, {} as AppUserNameKey);
  }
  async getOverallMetrics(hurdleId: string) {
    const applicantNames = await this._getApplicantNames(hurdleId);
    const appUserNames = await this._getUserNames(hurdleId);

    const applicants = await ApplicantStatusMetrics.findAll({
      where: {
        assessment_hurdle_id: hurdleId,
      },
    });

    const evaluatorMetrics = (
      await EvaluatorMetrics.findAll({
        where: {
          assessment_hurdle_id: hurdleId,
          evaluator: { [Op.ne]: null },
        },
      })
    ).reduce((memo, em) => {
      memo[em.evaluator!] = em;
      return memo;
    }, {} as { [evaluator: string]: EvaluatorMetrics });

    const evaluators = Object.entries(appUserNames)
      .map(([userId, userDetails]) => {
        if (userDetails.role != 2) {
          return null;
        }
        if (evaluatorMetrics[userId]) {
          return evaluatorMetrics[userId];
        }
        return {
          id: userId,
          name: userDetails.name,
          assessment_hurdle_id: hurdleId,
          pending_review: 0,
          pending_amendment: 0,
          completed: 0,
          recusals: 'No data',
        } as unknown as EvaluatorMetrics;
      })
      .filter(e => e);
    const reviewers = await ReviewerMetrics.findAll({
      where: {
        assessment_hurdle_id: hurdleId,
      },
    });

    const assignments = await this.getCurrentAssignments(hurdleId, appUserNames, applicantNames);

    return {
      applicants,
      evaluators,
      reviewers,
      assignments,
    };
  }

  async getCurrentAssignments(hurdleId: string, evaluators: AppUserNameKey, applicants: ApplicantNameKey) {
    const assingments = await ApplicationAssignments.findAll({
      where: { assessment_hurdle_id: hurdleId, active: true },
      attributes: ['id', 'evaluator_id', 'applicant_id', 'updated_at'],
    });

    return assingments.map(a => {
      const { evaluator_id, applicant_id, updated_at, id } = a;
      return {
        id,
        evaluator: evaluators[evaluator_id].name,
        applicant: applicants[applicant_id],
        updated_at: new Date(updated_at!).toLocaleString(),
      };
    });
  }

  async getReviewerMetrics(hurdleId: string) {
    logger.debug(`Generating getReviewerMetrics for hurdle ${hurdleId}`);

    const reviewerMetrics = await ReviewerMetrics.findAll({
      where: {
        assessment_hurdle_id: hurdleId,
      },
    });

    return reviewerMetrics.map(rm => {
      const reviewerId = rm.reviewer_id!;
      return {
        id: reviewerId,
        name: rm.name!,
        email: rm.email!,
        pending_amendment: rm.pending_amendment!,
        adjudicated: rm.adjudicated!,
      };
    });
  }

  async getHiringActionAggregates(hurdleId: string) {
    const { evaluations_required } = (await AssessmentHurdle.findByPk(hurdleId, {
      attributes: ['evaluations_required'],
    }))!;
    const totalApplicants = await Applicant.count({
      where: {
        assessment_hurdle_id: hurdleId,
      },
    });
    const applicantMetrics = await ApplicantStatusMetrics.findAll({
      where: {
        assessment_hurdle_id: hurdleId,
      },
    });
    const totalEvaluationsNeeded = Math.floor(evaluations_required * totalApplicants * 1.2);

    const totalEvaluations = applicantMetrics.reduce((memo, { evaluators }) => {
      memo += +evaluators!;
      return memo;
    }, 0);

    return {
      totalEvaluations,
      totalEvaluationsNeeded,
      totalApplicants,
    };
  }
  async getEvaluatorTotals(assessment_hurdle_id: string, evaluator: string) {
    const evaluatorMetrics = await EvaluatorMetrics.findOne({
      where: {
        assessment_hurdle_id,
        evaluator,
      },
    });
    return evaluatorMetrics;
  }
}
