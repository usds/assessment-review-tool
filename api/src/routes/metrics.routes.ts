import { Router } from 'express';
import MetricsHandler from '../handlers/metrics.handler';
import AuthenticationMiddleware from '../middlewares/auth.middleware';
import { BaseRouter } from './route';

export default class MetricsRouter extends BaseRouter {
  router = Router();
  metricsHandler = new MetricsHandler();
  authMiddleware = new AuthenticationMiddleware();

  constructor() {
    super();
    this.path = '/metrics/assessment_hurdle/:assessmentHurdleId';
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get(`${this.path}/getMetrics`, this.authMiddleware.authorizedReviewer, this.metricsHandler.getOverallStatus);
    this.router.get(`${this.path}/evaluator/`, this.authMiddleware.authorizedEvaluator, this.metricsHandler.getEvaluatorProgress);
  }
}
