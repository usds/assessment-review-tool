import { NextFunction, Request, Response } from 'express';
import { ApplicantFeedbackSubmitDto } from '../dto/applicantFeedbackSubmit.dto';
import HttpException from '../exceptions/HttpException';
import ReviewService from '../services/review.service';

export default class EvaluationHandler {
  reviewSvc = new ReviewService();

  submitApplicantFeedback = async (req: Request, res: Response, next: NextFunction) => {
    const { feedback }: ApplicantFeedbackSubmitDto = req.body;
    const { id: reviewerId } = req.user!;
    const { assessmentHurdleId, applicantId } = req.params;
    // is applicant in assessment hurdle?

    if (!assessmentHurdleId) {
      return next(new HttpException(400, 'Missing or invalid assessment hurdle id'));
    }

    try {
      const rst = await this.reviewSvc.submitApplicantFeedback(assessmentHurdleId, applicantId, reviewerId, feedback!);
      res.status(201).json({ data: rst, message: 'submitApplicantReview' });
    } catch (error) {
      next(error);
    }
  };

  releaseApplicant = async (req: Request, res: Response, next: NextFunction) => {
    const { id: reviewerId } = req.user!;
    const { assessmentHurdleId, applicantId } = req.params;
    // is applicant in assessment hurdle?

    if (!assessmentHurdleId) {
      return next(new HttpException(400, 'Missing or invalid assessment hurdle id'));
    }

    try {
      const rst = await this.reviewSvc.updateApplicantFlagStatus(assessmentHurdleId, applicantId, reviewerId, 0);
      res.status(201).json({ data: rst, message: 'releaseApplicant' });
    } catch (error) {
      next(error);
    }
  };
}
