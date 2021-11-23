import { NextFunction, Request, Response } from 'express';
import AssessmentHurdleService from '../services/assessmenthurdle.service';
import { AssessmentHurdle } from '../models/assessment_hurdle';
import CreateAssessmentHurdleDto from '../dto/createassessmenthurdle.dto';
import HttpException from '../exceptions/HttpException';

export default class AssessmentHurdleHandler {
  assessmentHurdleSvc = new AssessmentHurdleService();

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllUsersData: AssessmentHurdle[] = await this.assessmentHurdleSvc.getAll();
      res.status(200).json({ data: findAllUsersData, message: 'getAll' });
    } catch (error) {
      next(error);
    }
  };
  getAllForUser = async (req: Request, res: Response, next: NextFunction) => {
    const { id: currentUserId } = req.user!;
    if (!currentUserId) {
      return next(new HttpException(500, 'Missing current user'));
    }

    try {
      // @ts-ignore
      const findAllUsersData: AssessmentHurdle[] = await this.assessmentHurdleSvc.getAllWithUserRoles(currentUserId);

      res.status(200).json({ data: findAllUsersData, message: 'getAllForUser' });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    const { assessmentHurdleId } = req.params;
    if (!assessmentHurdleId) {
      return next(new HttpException(400, 'Missing or invalid assessment hurdle id'));
    }
    try {
      const findOneUserData: AssessmentHurdle = await this.assessmentHurdleSvc.getById(assessmentHurdleId);
      res.status(200).json({ data: findOneUserData, message: 'getById' });
    } catch (error) {
      next(error);
    }
  };

  upsert = async (req: Request, res: Response, next: NextFunction) => {
    const item: CreateAssessmentHurdleDto = req.body;
    try {
      const created: AssessmentHurdle = await this.assessmentHurdleSvc.upsert(item);
      res.status(201).json({ data: created, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  getHrDisplay = async (req: Request, res: Response, next: NextFunction) => {
    const { id: currentUserId } = req.user!;
    const { assessmentHurdleId } = req.params;
    if (!assessmentHurdleId) {
      return next(new HttpException(400, 'Missing or invalid assessment hurdle id'));
    }
    if (!currentUserId) {
      return next(new HttpException(500, 'Missing current user'));
    }
    try {
      const rst = await this.assessmentHurdleSvc.getHrDisplay(assessmentHurdleId, currentUserId);
      res.status(200).json({ data: rst, message: 'getHrDisplay' });
    } catch (error) {
      next(error);
    }
  };
}
