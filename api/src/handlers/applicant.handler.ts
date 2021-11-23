import path from 'path';
import { NextFunction, Request, Response } from 'express';
import ApplicantFlagDto from '../dto/applicantflag.dto';
import CreateApplicantDto, { CreateApplicantBulkDto } from '../dto/createapplicant.dto';
import { Applicant } from '../models/applicant';
import { ApplicantRecusals } from '../models/applicant_recusals';
import ApplicantService from '../services/applicant.service';
import BulkUSASApplicationsDto from '../dto/BulkApplicantApplications.dto';
import { logger } from '../utils/logger';
import USASCsvReader from './util/usasCsvReader';
import { validate as uuidValidate } from 'uuid';
import HttpException from '../exceptions/HttpException';
import DB from '../database';

export default class ApplicantHandler {
  applicantSvc = new ApplicantService();

  getAll = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllUsersData: Applicant[] = await this.applicantSvc.getAll();
      res.status(200).json({ data: findAllUsersData, message: 'getAll' });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    const { applicantId } = req.params;
    if (!uuidValidate(applicantId)) {
      return next(new HttpException(400, 'No, or invalid, applicant ID provided.'));
    }
    try {
      const applicant: Applicant = await this.applicantSvc.getById(applicantId);
      res.status(200).json({ data: applicant, message: 'getUserById' });
    } catch (error) {
      next(error);
    }
  };

  getByIdWithMeta = async (req: Request, res: Response, next: NextFunction) => {
    const { assessmentHurdleId, applicantId } = req.params;
    if (!uuidValidate(applicantId)) {
      return next(new HttpException(400, 'No, or invalid, applicant ID provided.'));
    }
    if (!uuidValidate(assessmentHurdleId)) {
      return next(new HttpException(400, 'No, or invalid, assessment hurdle ID provided.'));
    }
    try {
      const rst = await this.applicantSvc.getByIdWithMeta(applicantId, assessmentHurdleId);
      res.status(200).json({ data: rst, message: 'getByIdWithMeta' });
    } catch (error) {
      next(error);
    }
  };

  upsert = async (req: Request, res: Response, next: NextFunction) => {
    const item: CreateApplicantDto = req.body;
    const { assessmentHurdleId } = req.params;
    if (!uuidValidate(assessmentHurdleId)) {
      return next(new HttpException(400, 'No, or invalid, assessment hurdle ID provided.'));
    }
    try {
      const created: Applicant = await this.applicantSvc.upsert(item, assessmentHurdleId);
      res.status(201).json({ data: created, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  upsertBulk = async (req: Request, res: Response, next: NextFunction) => {
    const item: CreateApplicantBulkDto = req.body;
    const { assessmentHurdleId } = req.params;
    if (!uuidValidate(assessmentHurdleId)) {
      return next(new HttpException(400, 'No, or invalid, assessment hurdle ID provided.'));
    }
    try {
      const created: Applicant[] = await this.applicantSvc.bulkUpsert(item, assessmentHurdleId);
      res.status(201).json({ data: created, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  recuse = async (req: Request, res: Response, next: NextFunction) => {
    const { applicantId } = req.params;
    const { id: currentUserId } = req.user!;

    if (!uuidValidate(applicantId)) {
      return next(new HttpException(400, 'No, or invalid, applicant ID provided.'));
    }
    if (!uuidValidate(currentUserId)) {
      return next(new HttpException(500, 'User id invalid - this is a server error.'));
    }
    // try {
    //   const item: ApplicantRecusals = await this.applicantSvc.recuse(applicantId, currentUserId);
    const dbInstance = req.app.settings['Db'] as DB;

    try {
      const item: ApplicantRecusals = await this.applicantSvc.recuse(dbInstance, applicantId, currentUserId);
      res.status(201).json({ data: item, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  flag = async (req: Request, res: Response, next: NextFunction) => {
    const body: ApplicantFlagDto = req.body;
    const flagMessage = body.flagMessage;
    const applicantId = req.params.applicantId;
    const userEmail = req.user!.email;
    const userId = req.user!.id;
    if (!uuidValidate(applicantId)) {
      return next(new HttpException(400, 'No, or invalid, applicant ID provided.'));
    }
    if (!userEmail || !userId) {
      return next(new HttpException(500, 'User invalid - this is a server error.'));
    }
    // TODO: check if user is in hiring action.
    try {
      const result: Applicant = await this.applicantSvc.flag(applicantId, 1, `${userEmail}: ${flagMessage}`, userId);
      res.status(200).json({ data: result, message: 'flagged' });
    } catch (error) {
      next(error);
    }
  };

  importUSAS = async (req: Request, res: Response, next: NextFunction) => {
    const { assessmentHurdleId } = req.params;
    if (!uuidValidate(assessmentHurdleId)) {
      return next(new HttpException(400, 'No, or invalid, assessment hurdle ID provided.'));
    }
    try {
      // @ts-ignore
      const filePath = req.files[0].path;
      logger.debug(`Processing file at location ${path.resolve(filePath)}`);
      const validatedBulkApplicants: BulkUSASApplicationsDto = await USASCsvReader.parseFile(filePath);
      const created: Applicant[] = await this.applicantSvc.bulkUSASUpsert(validatedBulkApplicants, assessmentHurdleId);
      res.status(201).json({ data: created, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  getDisplay = async (req: Request, res: Response, next: NextFunction) => {
    const { applicantId } = req.params;
    const { id: currentUserId } = req.user!;
    if (!uuidValidate(applicantId)) {
      return next(new HttpException(400, 'No, or invalid, applicant ID provided.'));
    }
    if (!uuidValidate(currentUserId)) {
      return next(new HttpException(500, 'User id invalid - this is a server error.'));
    }
    try {
      logger.info('passed validation');
      const rst = await this.applicantSvc.getDisplay(applicantId, currentUserId);
      res.status(200).json({ data: rst, message: 'getDisplay' });
    } catch (error) {
      logger.error('Error');
      next(error);
    }
  };
}
