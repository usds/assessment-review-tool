import { NextFunction, Request, Response } from 'express';
import CreateCompetenciesDto from '../dto/createcompetencies.dto';
import CreateCompetencyDto from '../dto/createcompetency.dto';
import HttpException from '../exceptions/HttpException';
import { Competency } from '../models/competency';
import CompetencyService from '../services/competency.service';

export default class CompetencyHandler {
  competencySvc = new CompetencyService();
  getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllUsersData: Competency[] = await this.competencySvc.getAll();
      res.status(200).json({ data: findAllUsersData, message: 'getAll' });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    const { competencyId } = req.params;
    if (!competencyId) {
      return next(new HttpException(400, 'Missing or invalid competency id'));
    }
    try {
      const findOneUserData: Competency = await this.competencySvc.getById(competencyId);
      res.status(200).json({ data: findOneUserData, message: 'getById' });
    } catch (error) {
      next(error);
    }
  };

  getAllMappingsById = async (req: Request, res: Response, next: NextFunction) => {
    const { competencyId } = req.params;
    if (!competencyId) {
      return next(new HttpException(400, 'Missing or invalid competency id'));
    }
    try {
      const findAll = await this.competencySvc.getAllMappingsById(competencyId);
      res.status(200).json({ data: findAll, message: 'getAllMappingsById' });
    } catch (error) {
      next(error);
    }
  };

  upsert = async (req: Request, res: Response, next: NextFunction) => {
    const item: CreateCompetencyDto = req.body;
    let { assessmentHurdleId } = req.params;
    if (!assessmentHurdleId) {
      assessmentHurdleId = item.assessmentHurdleId!;
    }

    if (!assessmentHurdleId) {
      return next(new HttpException(400, 'Missing or invalid assessment hurdle id'));
    }

    try {
      const created: Competency = await this.competencySvc.upsert(item, assessmentHurdleId);
      res.status(201).json({ data: created, message: 'created' });
    } catch (error) {
      next(error);
    }
  };
  upsertAll = async (req: Request, res: Response, next: NextFunction) => {
    const item: CreateCompetenciesDto = req.body;

    let { assessmentHurdleId } = req.params;
    if (!assessmentHurdleId) {
      assessmentHurdleId = item.assessmentHurdleId!;
    }

    if (!assessmentHurdleId) {
      return next(new HttpException(400, 'Missing or invalid assessment hurdle id'));
    }
    try {
      const created: Competency[] = await this.competencySvc.upsertAll(item, assessmentHurdleId);
      res.status(201).json({ data: created, message: 'created' });
    } catch (error) {
      next(error);
    }
  };
}
