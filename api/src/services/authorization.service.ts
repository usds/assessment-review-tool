import { AssessmentHurdleUser } from '../models/assessment_hurdle_user';
export default class AuthorizationService {
  isAuthorizedForAssessmentHurdle = async (assessmentHurdleId: string, userId: string) => {
    const rst = await AssessmentHurdleUser.findOne({
      attributes: ['id'],
      where: {
        assessment_hurdle_id: assessmentHurdleId,
        app_user_id: userId,
      },
    });
    return rst;
  };
  isAuthorizedForRoleOnAssessmentHurdle = async (requiredRole: number, assessmentHurdleId: string, userId: string) => {
    const rst = await AssessmentHurdleUser.findOne({
      attributes: ['id'],
      where: {
        assessment_hurdle_id: assessmentHurdleId,
        app_user_id: userId,
        role: requiredRole,
      },
    });
    return rst;
  };
}
