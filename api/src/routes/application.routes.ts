import CreateApplicationDto from '../dto/createapplication.dto';
import CreateApplicationSpecialtyMappingDto from '../dto/createapplicationmapping.dto';
import ApplicationHandler from '../handlers/application.handler';
import AuthenticationMiddleware from '../middlewares/auth.middleware';
import validationMiddleware from '../middlewares/validator.middleware';
import { BaseRouter } from './route';

export default class ApplicationRouter extends BaseRouter {
  handler = new ApplicationHandler();
  authMiddleware = new AuthenticationMiddleware();

  constructor() {
    super();
    this.path = '/application';
    this.initRoutes();
  }

  initRoutes() {
    // It's unclear if any of these are used aside from the creation scripts
    // Locking them behind an admin token.
    this.router.use(`${this.path}`, this.authMiddleware.authorizedAdminToken);

    this.router.get(`${this.path}/:applicationId`, this.handler.getById);
    this.router.get(`${this.path}/:applicationId/meta`, this.handler.getByIdWithMeta);
    this.router.get(`${this.path}/applicant/:applicantId`, this.handler.getAllByApplicantId);
    this.router.get(`${this.path}/specialty/:specialtyId`, this.handler.getAllBySpecialtyId);

    this.router.put(`${this.path}/`, validationMiddleware(CreateApplicationDto, 'body'), this.handler.upsert);
    this.router.put(`${this.path}/mapping`, validationMiddleware(CreateApplicationSpecialtyMappingDto, 'body'), this.handler.createMapping);
    this.router.delete(`${this.path}/mapping`, validationMiddleware(CreateApplicationSpecialtyMappingDto, 'body'), this.handler.deleteMapping);
  }
}
