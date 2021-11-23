import path from 'path';

import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import compression from 'compression';
import session from 'express-session';
import passport from 'passport';

import DB from './database';
import { dbURI, sessionConfig, buildVersion } from './config';
import { logger, stream } from './utils/logger';

import Routes from './interfaces/routes.interface';

import errorMiddleware from './middlewares/error.middleware';
import AuthenticationRouter from './routes/authentication.routes';
import AuthenticationMiddleware from './middlewares/auth.middleware';
import authSetup from './auth';
import HttpException from './exceptions/HttpException';

export default class App {
  app: express.Application;
  port: number;
  env: string;
  db: DB;
  authMiddleWare: AuthenticationMiddleware;
  serverReady: Promise<boolean>;
  constructor(port: number, env: string, routes: Routes[]) {
    this.app = express();
    this.port = port;
    this.env = env;
    this.db = new DB();
    this.authMiddleWare = new AuthenticationMiddleware();
    this.serverReady = new Promise((resolve, reject) => {
      const authPromise = authSetup();
      const dbPromise = this.db.initConnection();
      Promise.all([authPromise, dbPromise])
        .then(() => {
          resolve(true);
        })
        .catch(err => {
          reject(err);
        });
    });
    this.initMiddleWare();
    this.initRoutes(routes);
  }

  listen() {
    this.app
      .listen(this.port, () => {
        logger.info(`Started on Port ${this.port}`);
      })
      .on('error', (err: any) => {
        logger.error(err);

        logger.error(`Port ${this.port} is in use`);
      });
  }

  getServer(): express.Application {
    return this.app;
  }

  cleanup() {
    try {
      console.error(`Cleaning up app`);
      this.db.close();
      logger.destroy();
    } catch (error) {
      console.error(`Failed to cleanup App: ${error}`);
    }
  }

  private initMiddleWare() {
    this.app.set('Db', this.db);

    if (this.env === 'production') {
      this.app.use(morgan('combined', { stream }));
      this.app.use(cors({ origin: 'your.domain.com' }));
    } else {
      this.app.use(morgan('dev', { stream }));
      this.app.use(cors({ origin: true }));
    }

    this.app.set('trust proxy', 1);

    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    const sc = sessionConfig;

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pgSession = require('connect-pg-simple')(session);
    sc.setStore(
      new pgSession({
        createTableIfMissing: true,
        conString: dbURI,
        errorLog: logger.error,
      }),
    );
    this.app.use(session(sc));
    this.app.use(passport.initialize());
    this.app.use(passport.session());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(this.authMiddleWare.userTokenAuthorization);
    this.app.use(express.static(path.join(__dirname, 'client/')));
  }

  private initRoutes(routes: Routes[]) {
    this.app.use(new AuthenticationRouter().router);

    this.app.get('/serverInfo', (req, res) => {
      res.status(200).json({ buildVersion });
    });

    routes.forEach(route => {
      this.app.use(route.basePath!, this.authMiddleWare.authenticatedUser, route.router);
      route.router.stack.forEach(value => {
        // Handle straight middleware usage
        if (!value || !value.route) {
          return;
        }
        const keys = Object.keys(value.route.methods);
        logger.info(`Registered Route at [${keys.join(',')}] ${value.route.path}`);
      });
    });
    logger.info(`Registered Route for 404`);
    this.app.get('/api', (_req: Request, _res: Response, next: NextFunction) => {
      return next(new HttpException(404, 'Resource not found'));
    });
    this.app.get('*', (_req: Request, res: Response) => {
      return res.sendFile(path.join(__dirname, './client/index.html'));
    });
    this.app.use(errorMiddleware);
  }
}
