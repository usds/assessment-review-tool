import { Applicant } from '../models/applicant';

import { logger } from '../utils/logger';

export default class ReviewService {
  async submitApplicantFeedback(assessmentHurdleId: string, applicantId: string, reviewer: string, feedback: string): Promise<string> {
    await Applicant.update(
      {
        additional_note: feedback,
      },
      {
        where: {
          id: applicantId,
          assessment_hurdle_id: assessmentHurdleId,
        },
        returning: true,
      },
    );
    logger.debug(`Updated applicant note for ${applicantId} from ${reviewer}`);
    return applicantId;
  }
  async updateApplicantFlagStatus(
    assessmentHurdleId: string,
    applicantId: string,
    reviewer: string,
    flagStatus: number,
    flagMessage = '',
  ): Promise<string> {
    await Applicant.update(
      {
        flag_type: flagStatus,
        flag_message: flagMessage,
      },
      {
        where: {
          id: applicantId,
          assessment_hurdle_id: assessmentHurdleId,
        },
        returning: true,
      },
    );
    logger.debug(`Updated flag status for ${applicantId} from ${reviewer}. Flag status ${flagStatus}`);
    return applicantId;
  }
}
