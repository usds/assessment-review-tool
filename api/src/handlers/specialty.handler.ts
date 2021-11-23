import SpecialtyService from '../services/specialty.service';
import { NextFunction, Request, Response } from 'express';
import { Specialty } from '../models/specialty';
import CreateSpecialtyDto from '../dto/createspecialty.dto';
import CreateSpecialtiesDto from '../dto/createspecialties.dto';
import HttpException from '../exceptions/HttpException';

export default class SpecialtyHandler {
  specialtySvc = new SpecialtyService();

  getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllUsersData: Specialty[] = await this.specialtySvc.getAll();
      res.status(200).json({ data: findAllUsersData, message: 'getAll' });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    const { specialtyId } = req.params;
    if (!specialtyId) {
      return next(new HttpException(400, 'Missing or invalid specialty id'));
    }

    try {
      const findOneUserData: Specialty = await this.specialtySvc.getById(specialtyId);
      res.status(200).json({ data: findOneUserData, message: 'getById' });
    } catch (error) {
      next(error);
    }
  };

  getAllMappingsById = async (req: Request, res: Response, next: NextFunction) => {
    const { specialtyId, assessmentHurdleId } = req.params;
    if (!assessmentHurdleId) {
      return next(new HttpException(400, 'Missing or invalid assessment hurdle id'));
    }
    if (!specialtyId) {
      return next(new HttpException(400, 'Missing or invalid specialty id'));
    }
    try {
      const findAll = await this.specialtySvc.getAllMappingsById(specialtyId, assessmentHurdleId);
      res.status(200).json({ data: findAll, message: 'getAllMappingsById' });
    } catch (error) {
      next(error);
    }
  };

  upsert = async (req: Request, res: Response, next: NextFunction) => {
    const item: CreateSpecialtyDto = req.body;
    if (!item.assessmentHurdleId) {
      item.assessmentHurdleId = req.params.assessmentHurdleId;
    }
    if (!item.assessmentHurdleId) {
      return next(new HttpException(400, 'Missing or invalid assessment hurdle id'));
    }
    try {
      const created: Specialty = await this.specialtySvc.upsert(item);
      res.status(201).json({ data: created, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  upsertAll = async (req: Request, res: Response, next: NextFunction) => {
    const items: CreateSpecialtiesDto = req.body;
    const { assessmentHurdleId } = req.params;
    if (!assessmentHurdleId) {
      return next(new HttpException(400, 'Missing or invalid assessment hurdle id'));
    }
    try {
      const created = await this.specialtySvc.upsertAll(items, assessmentHurdleId);
      res.status(201).json({ data: created, message: 'created' });
    } catch (error) {
      next(error);
    }
  };
}
