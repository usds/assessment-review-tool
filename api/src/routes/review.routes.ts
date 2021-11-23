import { Router } from 'express';
import { ApplicantFeedbackSubmitDto } from '../dto/applicantFeedbackSubmit.dto';
import ApplicantHandler from '../handlers/applicant.handler';
import EvaluationHandler from '../handlers/evaluation.handler';
import ReviewHandler from '../handlers/review.handler';
import AuthenticationMiddleware from '../middlewares/auth.middleware';
import validationMiddleware from '../middlewares/validator.middleware';
import { BaseRouter } from './route';

export default class ReviewRouter extends BaseRouter {
  router = Router();
  applicantHandler = new ApplicantHandler();
  evaluationHandler = new EvaluationHandler();
  authMiddleware = new AuthenticationMiddleware();
  reviewHandler = new ReviewHandler();

  constructor() {
    super();
    this.path = '/review/:assessmentHurdleId';
    this.initRoutes();
  }

  private initRoutes() {
    /**
     * Reviewer only routes
     */
    this.router.use(`${this.path}`, this.authMiddleware.authorizedReviewer);

    this.router.put(
      `${this.path}/applicant/:applicantId/applicant_feedback`,
      validationMiddleware(ApplicantFeedbackSubmitDto),
      this.reviewHandler.submitApplicantFeedback,
    );

    this.router.post(
      `${this.path}/applicant/:applicantId/release`,
      validationMiddleware(ApplicantFeedbackSubmitDto),
      this.reviewHandler.releaseApplicant,
    );
  }
}
