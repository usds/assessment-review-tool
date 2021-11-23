import { Request } from 'express';
import { Strategy } from 'passport-custom';
import { headerTokens } from '../config';
import { LoginUserDetails } from '../interfaces/loginUser.interface';
import UserService from '../services/users.service';
import { logger } from '../utils/logger';

// @ts-ignore

const demoStrategy = new Strategy(async function (req: Request, done) {
  const bearerHeader = req.headers['authorization'];
  const userService = new UserService();

  logger.debug(`Received Token Header: ${bearerHeader}`);

  if (!headerTokens) {
    logger.error(`Headers Tokens in configuration returned null for environment`);
    return done(null, null);
  }

  if (bearerHeader) {
    const bearer = bearerHeader.split(' ');
    const bearerToken = bearer[1];
    const user: LoginUserDetails = {
      hasUser: true,
      email: '',
      name: 'token',
      id: bearerToken,
    };
    if (!Object.values(headerTokens).includes(bearerToken) || bearerToken === null) {
      logger.warn(`Attempt to use invalid token ${bearerToken}`);
      return done(null, null);
    }
    switch (bearerToken) {
      case headerTokens.evaluator_one:
        user.email = 'smeqa_evaluator_one@usds.gov';
        break;
      case headerTokens.evaluator_two:
        user.email = 'smeqa_evaluator_two@usds.gov';
        break;
      case headerTokens.evaluator_three:
        user.email = 'smeqa_evaluator_three@usds.gov';
        break;
      case headerTokens.evaluator_four:
        user.email = 'smeqa_evaluator_four@usds.gov';
        break;
      case headerTokens.evaluator_five:
        user.email = 'smeqa_evaluator_five@usds.gov';
        break;
      case headerTokens.reviewer:
        user.email = 'smeqa_reviewer@usds.gov';
        break;
      case headerTokens.admin:
        logger.debug(`Admin token`);
        user.email = 'admin@usds.gov';
        user.hasUser = false;
        break;
      default:
        throw new Error('Token not assigned email');
    }

    logger.debug(`Setting user as ${user.email}`);

    if (user.hasUser) {
      user.id = (await userService.getUserByEmail(user.email)).id;
    }
    return done(null, user);
  } else {
    return done(null, null);
  }
});

function isAdmin(bearerHeader: string) {
  const bearer = bearerHeader.split(' ');
  const bearerToken = bearer[1];
  return bearerToken === headerTokens.admin;
}

export { demoStrategy, isAdmin };
