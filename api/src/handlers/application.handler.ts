import { NextFunction, Request, Response } from 'express';
import CreateApplicationDto from '../dto/createapplication.dto';
import CreateApplicationSpecialtyMappingDto from '../dto/createapplicationmapping.dto';
import HttpException from '../exceptions/HttpException';
import { Application } from '../models/application';
import ApplicationService from '../services/application.service';
import { validate as uuidValidate } from 'uuid';
export default class ApplicationHandler {
  applicationSvc = new ApplicationService();

  getById = async (req: Request, res: Response, next: NextFunction) => {
    const { applicationId } = req.params;
    if (!uuidValidate(applicationId)) {
      return next(new HttpException(400, 'No, or invalid, application ID provided.'));
    }
    try {
      const findAllUsersData: Application = await this.applicationSvc.getById(applicationId);
      res.status(200).json({ data: findAllUsersData, message: 'getById' });
    } catch (error) {
      next(error);
    }
  };

  getByIdWithMeta = async (req: Request, res: Response, next: NextFunction) => {
    const { applicationId } = req.params;
    if (!applicationId) {
      return next(new HttpException(400, 'Missing application id'));
    }
    try {
      const [application, meta] = await this.applicationSvc.getByIdWithMeta(applicationId);
      res.status(200).json({ data: { application, applicationMeta: meta }, message: 'getByIdWithMeta' });
    } catch (error) {
      next(error);
    }
  };

  getAllByApplicantId = async (req: Request, res: Response, next: NextFunction) => {
    const { applicantId } = req.params;
    if (!applicantId) {
      return next(new HttpException(400, 'Missing applicantId id'));
    }
    try {
      const findAllUsersData: Application[] = await this.applicationSvc.getAllByApplicantId(applicantId);
      res.status(200).json({ data: findAllUsersData, message: 'getAllByApplicantId' });
    } catch (error) {
      next(error);
    }
  };

  getAllBySpecialtyId = async (req: Request, res: Response, next: NextFunction) => {
    const { specialtyId } = req.params;
    if (!specialtyId) {
      return next(new HttpException(400, 'Missing specialty id'));
    }
    try {
      const findAllUsersData: Application[] = await this.applicationSvc.getAllBySpecialtyId(specialtyId);
      res.status(200).json({ data: findAllUsersData, message: 'getAllBySpecialtyId' });
    } catch (error) {
      next(error);
    }
  };

  upsert = async (req: Request, res: Response, next: NextFunction) => {
    const body: CreateApplicationDto = req.body;
    try {
      const findAllUsersData: Application = await this.applicationSvc.upsert(body);
      res.status(200).json({ data: findAllUsersData, message: 'upsert' });
    } catch (error) {
      next(error);
    }
  };

  createMapping = async (req: Request, res: Response, next: NextFunction) => {
    const body: CreateApplicationSpecialtyMappingDto = req.body;
    const { applicationId, specialtyId } = body;
    if (!specialtyId) {
      return next(new HttpException(400, 'Missing specialty id'));
    }
    if (!applicationId) {
      return next(new HttpException(400, 'Missing applicationId id'));
    }

    try {
      const findAllUsersData: Application = await this.applicationSvc.createMapping(applicationId, specialtyId);
      res.status(200).json({ data: findAllUsersData, message: 'createMapping' });
    } catch (error) {
      next(error);
    }
  };

  deleteMapping = async (req: Request, res: Response, next: NextFunction) => {
    return next(new HttpException(500, 'Handler not implemented'));
    const id = req.params.id;

    try {
      const didDelete = await this.applicationSvc.deleteMappingById(id);
      res.status(didDelete ? 200 : 500).json({ data: didDelete ? 'Ok' : 'Failed', message: 'deleteMappingById' });
    } catch (error) {
      next(error);
    }
  };
}
