import { Router } from 'express';
import AuthenticationHandler from '../handlers/authentication.handler';
import { BaseRouter } from './route';

/**
 * All routes after this will require a user to be logged in
 */
export default class AuthenticationRouter extends BaseRouter {
  router = Router();
  handler = new AuthenticationHandler();

  constructor() {
    super();
    this.basePath = '/';
    this.path = '/';
    this.initRoutes();
  }

  private initRoutes() {
    this.router.get(`/login/auth`, this.handler.loginUser);
    this.router.get(`/logout`, this.handler.logoutUser);
    this.router.get(`/login/check`, this.handler.checkUser);
    this.router.post(`/login/token`, this.handler.tokenLogin);
  }
}
