import { Request, Response } from 'express';
import passport from 'passport';
import { logger } from '../utils/logger';

export default class AuthenticationHandler {
  loginUser = (req: Request, res: Response) => {
    passport.authenticate('oidc-loa-1', (err, user, info) => {
      logger.debug(`Login.gov info ${JSON.stringify(info)}`);
      if (err) {
        logger.error(`Login.gov error ${JSON.stringify(err)}`);
        res.status(500).send({ data: null, message: 'There was an issue with login.gov or you are unauthorized to access this system.' });
        return;
      }
      if (!user) {
        logger.debug('No user');
        res.redirect('/');
        return;
      }
      req.logIn(user, err => {
        if (err) {
          logger.error(`Error logging user in: ${JSON.stringify(err)}`);
          res.status(500).send({ data: null, message: 'There was an issue with login.' });
          return;
        }
        logger.debug(`User Logging in: ${JSON.stringify(user)}`);
        res.redirect('/');
        return;
      });
    })(req, res);
  };

  checkUser = (req: Request, res: Response) => {
    return res.status(200).send({ data: req.user || null, message: 'checkUser' });
  };
  logoutUser = (req: Request, res: Response) => {
    req.logout();
    res.redirect('/');
    return;
  };

  tokenLogin = (req: Request, res: Response) => {
    passport.authenticate('token-login', (err, user) => {
      if (err) {
        logger.error(`Error with token login ${JSON.stringify(err)}`);
        res.status(500).send({ data: err, message: 'Error' });
        return;
      }

      if (!user) {
        logger.info('No user found for token login');
        res.status(404).send({ data: null, message: 'user not found' });
      }

      return req.logIn(user, err1 => {
        if (err1) {
          logger.error(`Error with token login ${JSON.stringify(err)}`);
          res.status(500).send({ data: err1, message: 'Error' });
          return;
        }
        logger.debug(`User Logging in: ${JSON.stringify(user)}`);
        res.status(200).send({ data: user.id, message: 'tokenLogin' });
        return;
      });
    })(req, res);
  };
}
