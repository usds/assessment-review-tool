import crypto from 'crypto';

import { Client, ClientMetadata, Issuer, Strategy } from 'openid-client';
import jose from 'node-jose';

import { openIdConfig } from '../config';
import { logger } from '../utils/logger';
import { LoginUserDetails } from '../interfaces/loginUser.interface';
import { AppUser } from '../models/app_user';
import UserService from '../services/users.service';

const logoutObject: { issuer: Issuer<Client> | null } = { issuer: null };
async function generateStrategy() {
  const userService = new UserService();
  const secretKey = openIdConfig.secretKey;
  const [key, issuer] = await Promise.all([jose.JWK.asKey(secretKey, 'pem'), Issuer.discover(openIdConfig.issuerDiscover)]);
  logger.info(`Key successfully read`);

  logoutObject.issuer = issuer;
  logger.info(`OpenId Issuer set to ${issuer.issuer}`);

  const clientOptions: ClientMetadata = {
    client_id: openIdConfig.clientId,
    token_endpoint_auth_method: 'private_key_jwt',
    id_token_signed_response_alg: 'RS256',
  };
  const params = {
    response_type: 'code',
    acr_values: 'http://idmanagement.gov/ns/assurance/ial/1',
    scope: 'email',
    redirect_uri: openIdConfig.redirectUri,
    nonce: randomString(32),
    state: randomString(32),
    prompt: 'select_account',
  };

  // @ts-ignore
  const client = new issuer.Client(clientOptions, key.keystore.toJSON(true));

  // Because... clock drift is #real.
  client.CLOCK_TOLERANCE = 5;

  // @ts-ignore
  const oidcLoa1Strat = new Strategy({ client, params }, function (tokenset, userInfo, done) {
    const { email, email_verified } = userInfo;
    // sub, iss, id_token, id
    if (!email_verified) {
      logger.debug(`${email} is not verified with login.gov`);
      return done(new Error('Email has not been verified; please verify with login.gov'));
    }
    return userService
      .getUserByEmail(email.toLowerCase())
      .then((appUser: AppUser) => {
        const { email, id, name } = appUser;
        if (!id) {
          return done(new Error('No user found'), null);
        }
        const user: LoginUserDetails = {
          email,
          id,
          hasUser: true,
          name,
        };
        return done(null, user);
      })
      .catch(err => {
        logger.debug(`Login.gov error ${JSON.stringify(err)}`);
        done(err);
      });
  });
  return oidcLoa1Strat;
}

function randomString(length: number) {
  return crypto.randomBytes(length).toString('hex'); // source: https://github.com/18F/fs-permit-platform/blob/c613a73ae320980e226d301d0b34881f9d954758/server/src/util.es6#L232-L237
}

//  devStrategy, demoStrategy,
export { generateStrategy, logoutObject };
