import { NextFunction, Request, Response } from 'express';
import DB from '../database';
import { EvaluationApplicationFeedbackDto } from '../dto/evaluationfeedback.dto';
import { EvaluationApplicationReviewSubmitDto } from '../dto/evaluationreviewsubmit.dto';
import EvaluationSubmitDto from '../dto/evaluationsubmit.dto';
import HttpException from '../exceptions/HttpException';
import EvaluationService from '../services/evaluation.service';

export default class EvaluationHandler {
  evaluationSvc = new EvaluationService();

  submitApplicationReview = async (req: Request, res: Response, next: NextFunction) => {
    const body: EvaluationApplicationReviewSubmitDto = req.body;
    const { assessmentHurdleId } = req.params;
    const { id: reviewerId } = req.user!;
    const dbInstance = req.app.settings['Db'] as DB;

    if (!assessmentHurdleId) {
      return next(new HttpException(400, 'Missing or invalid assessment hurdle id'));
    }
    if (!reviewerId) {
      return next(new HttpException(500, 'Missing or invalid user'));
    }
    try {
      const rst = await this.evaluationSvc.submitApplicationReview(dbInstance, body, reviewerId, assessmentHurdleId);
      res.status(201).json({ data: rst, message: 'submitApplicationReview' });
    } catch (error) {
      next(error);
    }
  };

  submitApplicationFeedback = async (req: Request, res: Response, next: NextFunction) => {
    const body: EvaluationApplicationFeedbackDto = req.body;
    const { assessmentHurdleId, applicantId } = req.params;
    const reviewerId = req.user!.id;
    if (!assessmentHurdleId) {
      return next(new HttpException(400, 'Missing or invalid assessment hurdle id'));
    }
    if (!applicantId) {
      return next(new HttpException(400, 'Missing or invalid applicant id'));
    }
    if (!reviewerId) {
      return next(new HttpException(500, 'Missing or invalid user'));
    }
    try {
      const rst = await this.evaluationSvc.submitApplicationFeedback(body, assessmentHurdleId, applicantId, reviewerId);
      res.status(201).json({ data: rst, message: 'submitApplicationFeedback' });
    } catch (error) {
      next(error);
    }
  };

  submitEvaluation = async (req: Request, res: Response, next: NextFunction) => {
    const body: EvaluationSubmitDto = req.body;

    const { assessmentHurdleId, applicantId } = req.params;
    const { id: evaluatorId } = req.user!;

    if (!applicantId) {
      return next(new HttpException(400, 'Missing or invalid applicant id'));
    }
    if (!evaluatorId) {
      return next(new HttpException(400, 'Missing or invalid applicant id'));
    }

    const dbInstance = req.app.settings['Db'] as DB;

    try {
      const rst = await this.evaluationSvc.submitEvaluation(dbInstance, body, assessmentHurdleId, applicantId, evaluatorId);
      res.status(201).json({ data: rst, message: 'submitEvaluation' });
    } catch (error) {
      next(error);
    }
  };
}
