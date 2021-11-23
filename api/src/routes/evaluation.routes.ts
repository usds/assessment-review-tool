import { Router } from 'express';
import ApplicantFlagDto from '../dto/applicantflag.dto';
import { EvaluationApplicationFeedbackDto } from '../dto/evaluationfeedback.dto';
import { EvaluationApplicationReviewSubmitDto } from '../dto/evaluationreviewsubmit.dto';
import EvaluationSubmitDto from '../dto/evaluationsubmit.dto';
import ApplicantHandler from '../handlers/applicant.handler';
import EvaluationHandler from '../handlers/evaluation.handler';
import AuthenticationMiddleware from '../middlewares/auth.middleware';
import validationMiddleware from '../middlewares/validator.middleware';
import { BaseRouter } from './route';

export default class EvaluationRouter extends BaseRouter {
  router = Router();
  applicantHandler = new ApplicantHandler();
  evaluationHandler = new EvaluationHandler();
  authMiddleware = new AuthenticationMiddleware();

  constructor() {
    super();
    this.path = '/evaluation/:assessmentHurdleId';
    this.initRoutes();
  }

  private initRoutes() {
    this.router.put(
      `${this.path}/application/review`,
      this.authMiddleware.authorizedReviewer,
      validationMiddleware(EvaluationApplicationReviewSubmitDto, 'body'),
      this.evaluationHandler.submitApplicationReview,
    );

    this.router.put(
      `${this.path}/feedback/:applicantId`,
      this.authMiddleware.authorizedReviewer,
      validationMiddleware(EvaluationApplicationFeedbackDto, 'body'),
      this.evaluationHandler.submitApplicationFeedback,
    );
    this.router.post(
      `${this.path}/flag/:applicantId`,
      this.authMiddleware.authorizedUser,
      validationMiddleware(ApplicantFlagDto, 'body'),
      this.applicantHandler.flag,
    );

    /**
     * Evaluator only routes
     */
    this.router.use(`${this.path}`, this.authMiddleware.authorizedEvaluator);
    this.router.put(`${this.path}/recuse/:applicantId`, this.applicantHandler.recuse);
    this.router.get(`${this.path}/display/:applicantId`, this.applicantHandler.getDisplay);
    this.router.put(`${this.path}/submit/:applicantId`, validationMiddleware(EvaluationSubmitDto, 'body'), this.evaluationHandler.submitEvaluation);

    // this.router.get(`${this.path}/:hurdleId/stats/:applicantId`);
  }
}
