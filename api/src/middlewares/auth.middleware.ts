import { NextFunction, Request, Response } from 'express';
import passport from 'passport';

import AuthorizationService from '../services/authorization.service';
import { logger } from '../utils/logger';
import { isAdmin } from '../auth/token';
import { validate as uuidValidate } from 'uuid';
import HttpException from '../exceptions/HttpException';
export default class AuthenticationMiddleware {
  authorizationService = new AuthorizationService();
  userExists = (req: Request) => {
    if (!req.user || !req.user.id) {
      throw new HttpException(403, 'No user found');
    }
    return;
  };
  assessmentHurdleExists = (req: Request) => {
    const { assessmentHurdleId } = req.params;
    try {
      uuidValidate(assessmentHurdleId);
    } catch (_err) {
      throw new HttpException(403, 'No assessment hurdle found');
    }
    return;
  };

  authenticatedUser = (req: Request, _res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      return next();
    }
    logger.info(`User is not authenticated: ${JSON.stringify(req.user)}`);
    return next(new Error('User is not authenticated.'));
  };

  userTokenAuthorization = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers['authorization'] && req.headers['authorization'].length) {
      logger.debug(`userTokenAuthorization - authorization header found: ${req.headers['authorization']}`);
      passport.authenticate('token-login', function (err, user) {
        if (err) {
          return next(err);
        }
        if (user) {
          return req.logIn(user, function (err) {
            if (err) {
              return next(err);
            }

            next();
          });
        }
        return next();
      })(req, res, next);
    } else {
      return next();
    }
  };

  authorizedUser = async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const user = req.user!;
      const { assessmentHurdleId } = req.params;
      this.userExists(req);
      this.assessmentHurdleExists(req);
      logger.debug(`authorizedUser for ${user.id} in hurdle ${assessmentHurdleId}`);
      const isAuthorized = await this.authorizationService.isAuthorizedForAssessmentHurdle(assessmentHurdleId, user?.id);
      if (!isAuthorized) {
        throw new Error('User not authorized for this route');
      }
      return next();
    } catch (err) {
      next(err);
    }
  };

  authorizedEvaluator = async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const user = req.user!;
      const { assessmentHurdleId } = req.params;
      logger.debug(`authorizedUserWithRole for ${user.id} in hurdle ${assessmentHurdleId}`);

      const isAuthorized = await this.authorizationService.isAuthorizedForRoleOnAssessmentHurdle(2, assessmentHurdleId, user?.id);
      if (!isAuthorized) {
        throw new Error('User not authorized for this route');
      }
      return next();
    } catch (err) {
      next(err);
    }
  };
  authorizedReviewer = async (req: Request, _res: Response, next: NextFunction) => {
    try {
      const user = req.user!;
      const { assessmentHurdleId } = req.params;
      logger.debug(`authorizedUserWithRole for ${user.id} in hurdle ${assessmentHurdleId}`);
      const isAuthorized = await this.authorizationService.isAuthorizedForRoleOnAssessmentHurdle(1, assessmentHurdleId, user?.id);
      if (!isAuthorized) {
        throw new Error('User not authorized for this route');
      }
      return next();
    } catch (err) {
      next(err);
    }
  };

  /** Admins are authorized for _all_ routes currently */
  authorizedAdminToken = (req: Request, _res: Response, next: NextFunction) => {
    if (req.headers['authorization'] && req.headers['authorization'].length) {
      if (isAdmin(req.headers['authorization'])) {
        return next();
      }
      return next(new HttpException(403, `Admin token invalid for route ${req.path}`));
    }
    return next(new HttpException(401, `Admin token not found for route ${req.path}`));
  };
}
