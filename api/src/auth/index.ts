import passport from 'passport';
import { generateStrategy } from './loginGov';
import UserService from '../services/users.service';
import { logger } from '../utils/logger';
import { AppUser } from '../models/app_user';
import { demoStrategy } from './token';
import { LoginUserDetails } from '../interfaces/loginUser.interface';

const userService = new UserService();

passport.serializeUser((loginUserDetails: LoginUserDetails, done) => {
  if (!loginUserDetails) {
    logger.error('No User found');
    return done(new Error('No user'));
  }
  if (!loginUserDetails.hasUser) {
    logger.debug(`All authorization should be done via headers - no user will be deserialized`);
    return done(null, 'no-user');
  }

  if (loginUserDetails.id) {
    logger.debug(`Serializing user ${loginUserDetails.email} - id: ${loginUserDetails.id}`);
    return done(null, loginUserDetails.id);
  }
  logger.debug(`No user found to serialize`);
  return done(new Error('No valid user types'));
});

passport.deserializeUser(async (id: string, done) => {
  if (id === 'no-user') {
    return done(null, null);
  }
  logger.info(`Deserializing user with: ${id}`);
  try {
    const user: AppUser = await userService.getUserById(id);
    if (!user) {
      throw new Error('There was an error retrieving your user, please reach out for support');
    }
    logger.info(`User deserialized: ${user.email}`);

    return done(null, user);
  } catch (err) {
    done(err);
  }
});

export default async function authSetup() {
  try {
    const oidcLoa1Strat = await generateStrategy();
    passport.use('oidc-loa-1', oidcLoa1Strat);
    logger.debug(oidcLoa1Strat);
  } catch (err) {
    logger.error('Error setting up login.gov');
    logger.error('Are your security-groups right?');
    logger.error(JSON.stringify(err));
  }
  passport.use('token-login', demoStrategy);
}
