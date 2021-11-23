import AdminHandler from '../handlers/admin.handler';
import ExportHandler from '../handlers/export.handler';
import AuthenticationMiddleware from '../middlewares/auth.middleware';
import { BaseRouter } from './route';

export default class AdminRoute extends BaseRouter {
  handler = new AdminHandler();
  exportHandler = new ExportHandler();
  authMiddleware = new AuthenticationMiddleware();

  constructor() {
    super();
    this.path = '/admin';
    this.initRoutes();
  }
  initRoutes() {
    this.router.get(`${this.path}/health`, this.handler.healthCheck);
    this.router.get(`${this.path}/export/:assessmentHurdleId/audit`, this.authMiddleware.authorizedAdminToken, this.exportHandler.getAuditFile);
    this.router.get(`${this.path}/export/:assessmentHurdleId/results`, this.authMiddleware.authorizedAdminToken, this.exportHandler.getResultsFile);

    this.router.get(`${this.path}/export/:assessmentHurdleId/resultsusas`, this.authMiddleware.authorizedAdminToken, this.exportHandler.getUSASFile);

    // this.router.get(`${this.path}/export/:assessmentHurdleId/recusals`, this.authMiddleware.authorizedAdminToken, this.exportHandler.getRecusedFile);
    // this.router.get(`${this.path}/export/:assessmentHurdleId/flagged`, this.authMiddleware.authorizedAdminToken, this.exportHandler.getFlaggedFile);
  }
}
