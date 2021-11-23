import { Router } from 'express';
import CreateUserDto from '../dto/createuser.dto';
import UsersHandler from '../handlers/users.handler';
import validationMiddleware from '../middlewares/validator.middleware';
import AuthenticationMiddleware from '../middlewares/auth.middleware';
import { BaseRouter } from './route';
export default class UsersRoute extends BaseRouter {
  router = Router();
  handler = new UsersHandler();
  authMiddleware = new AuthenticationMiddleware();

  constructor() {
    super();
    this.path = '/users';
    this.initRoutes();
  }

  private initRoutes() {
    this.router.use(`${this.path}`, this.authMiddleware.authorizedAdminToken);

    this.router.get(`${this.path}`, this.handler.getUsers);
    this.router.put(`${this.path}`, validationMiddleware(CreateUserDto, 'body'), this.handler.createUser);
    this.router.get(`${this.path}/:userId`, this.handler.getUserById);
    this.router.get(`${this.path}/email/:userEmail`, this.handler.getUserByEmail);
  }
}
