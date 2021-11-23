import path from 'path';
import multer from 'multer';
import { CreateApplicantBulkDto } from '../dto/createapplicant.dto';
import CreateAssessmentHurdleDto from '../dto/createassessmenthurdle.dto';
import CreateCompetenciesDto from '../dto/createcompetencies.dto';
import CreateCompetencyDto from '../dto/createcompetency.dto';
import CreateHurdleUserDto from '../dto/createhurdleuser.dto';
import CreateSpecialtiesDto from '../dto/createspecialties.dto';
import CreateSpecialtyDto from '../dto/createspecialty.dto';
import ApplicantHandler from '../handlers/applicant.handler';
import ApplicationAssignmentHandler from '../handlers/applicationassignment.handler';
import AssessmentHurdleHandler from '../handlers/assessmenthurdle.handler';
import CompetencyHandler from '../handlers/competency.handler';
import SpecialtyHandler from '../handlers/specialty.handler';
import UsersHandler from '../handlers/users.handler';
import validationMiddleware from '../middlewares/validator.middleware';

import { BaseRouter } from './route';
import AuthenticationMiddleware from '../middlewares/auth.middleware';
import ExportHandler from '../handlers/export.handler';

const upload = multer({ dest: path.join(__dirname, '..', 'tmp') });
export default class AssessmentHurdleRoute extends BaseRouter {
  handler = new AssessmentHurdleHandler();
  compHandler = new CompetencyHandler();
  specHandler = new SpecialtyHandler();
  applicantHandler = new ApplicantHandler();
  userHandler = new UsersHandler();
  assignmentHandler = new ApplicationAssignmentHandler();
  authMiddleware = new AuthenticationMiddleware();
  exportHandler = new ExportHandler();

  constructor() {
    super();
    this.path = '/assessment-hurdle';
    this.initRoutes();
  }
  private initRoutes() {
    /** Authorized Users (all) */
    this.router.get(`${this.path}/roles`, this.authMiddleware.authenticatedUser, this.handler.getAllForUser);
    /** Authorized Users (all) */

    this.router.get(`${this.path}/:assessmentHurdleId`, this.authMiddleware.authorizedUser, this.handler.getById);

    /** Authorized Evaluator routes */
    this.router.get(`${this.path}/:assessmentHurdleId/next`, this.authMiddleware.authorizedEvaluator, this.assignmentHandler.nextAssignment);
    this.router.get(`${this.path}/:assessmentHurdleId/current`, this.authMiddleware.authorizedEvaluator, this.assignmentHandler.getByEvaluatorId);

    /** Authorized Reviewer routes */
    this.router.get(`${this.path}/:assessmentHurdleId/hrdisplay`, this.authMiddleware.authorizedReviewer, this.handler.getHrDisplay);
    this.router.get(`${this.path}/:assessmentHurdleId/metrics`, this.authMiddleware.authorizedReviewer, this.exportHandler.getResultsFile);

    this.router.get(`${this.path}/export/:assessmentHurdleId/resultsusas`, this.authMiddleware.authorizedReviewer, this.exportHandler.getUSASFile);

    this.router.get(`${this.path}/export/:assessmentHurdleId/audit`, this.authMiddleware.authorizedReviewer, this.exportHandler.getAuditFile);
    /** ADMIN PATHS */
    this.router.use(`${this.path}`, this.authMiddleware.authorizedAdminToken);

    this.router.get(`${this.path}`, this.handler.getAll);
    this.router.put(`${this.path}`, validationMiddleware(CreateAssessmentHurdleDto, 'body'), this.handler.upsert);

    this.router.put(`${this.path}/:assessmentHurdleId/specialty`, validationMiddleware(CreateSpecialtyDto, 'body'), this.specHandler.upsert);
    this.router.put(`${this.path}/:assessmentHurdleId/specialties`, validationMiddleware(CreateSpecialtiesDto, 'body'), this.specHandler.upsertAll);
    this.router.put(`${this.path}/:assessmentHurdleId/competency`, validationMiddleware(CreateCompetencyDto, 'body'), this.compHandler.upsert);
    this.router.put(`${this.path}/:assessmentHurdleId/competencies`, validationMiddleware(CreateCompetenciesDto, 'body'), this.compHandler.upsertAll);
    this.router.get(`${this.path}/:assessmentHurdleId/specialty/:specialtyId`, this.specHandler.getAllMappingsById);
    this.router.get(`${this.path}/:assessmentHurdleId/competency/:competencyId`, this.compHandler.getAllMappingsById);

    this.router.put(
      `${this.path}/:assessmentHurdleId/applicant`,
      validationMiddleware(CreateApplicantBulkDto, 'body'),
      this.applicantHandler.upsertBulk,
    );

    this.router.post(`${this.path}/:assessmentHurdleId/importUSAS`, upload.any(), this.applicantHandler.importUSAS);
    this.router.get(`${this.path}/:assessmentHurdleId/applicant/:applicantId`, this.applicantHandler.getByIdWithMeta);

    this.router.put(
      `${this.path}/:assessmentHurdleId/users`,
      validationMiddleware(CreateHurdleUserDto, 'body'),
      this.userHandler.createUserAndAddToHurdle,
    );
  }
}
