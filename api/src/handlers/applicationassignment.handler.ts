import { NextFunction, Request, Response } from 'express';
import HttpException from '../exceptions/HttpException';
import ApplicationAssignmentService from '../services/application_assignment.service';

export default class ApplicationAssignmentHandler {
  applicationAssignmentSvc = new ApplicationAssignmentService();

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rst = await this.applicationAssignmentSvc.getAll();
      res.status(200).json({ data: rst, message: 'getAll' });
    } catch (error) {
      next(error);
    }
  };

  getByEvaluatorId = async (req: Request, res: Response, next: NextFunction) => {
    const { assessmentHurdleId } = req.params;
    const { id: currentUserId } = req.user!;
    if (!assessmentHurdleId) {
      return next(new HttpException(400, 'Missing or invalid assessment hurdle id'));
    }
    if (!currentUserId) {
      return next(new HttpException(500, 'Missing current user'));
    }
    try {
      const rst = await this.applicationAssignmentSvc.getByEvaluatorId(currentUserId, assessmentHurdleId);
      res.status(200).json({ data: rst, message: 'getByEvaluatorId' });
    } catch (error) {
      next(error);
    }
  };

  nextAssignment = async (req: Request, res: Response, next: NextFunction) => {
    const { assessmentHurdleId } = req.params;
    const { id: currentUserId } = req.user!;
    if (!assessmentHurdleId) {
      return next(new HttpException(400, 'Missing or invalid assessment hurdle id'));
    }
    if (!currentUserId) {
      return next(new HttpException(500, 'Missing current user'));
    }
    try {
      const rst = await this.applicationAssignmentSvc.nextQueue(assessmentHurdleId, currentUserId);
      res.status(200).json({ data: rst, message: 'nextAssignment' });
    } catch (error) {
      next(error);
    }
  };
}
