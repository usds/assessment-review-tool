import path from 'path';
import fs from 'fs';
// const REDSREGEX = /"uri": "(redis:\/\/.*)"/;
const PSQLREGEX = /"uri": "(postgres:\/\/.*)"/;

export interface OpenIDConfiguration {
  issuerDiscover: string;
  clientId: string;
  redirectUri: string;
  secretKey: string;
}

export class SessionConfiguration {
  secret: string;
  name: string;
  saveUninitialized: boolean;
  resave: boolean;
  cookie: { secure: boolean; httpOnly: boolean; maxAge: number };
  store: any | undefined;

  constructor(secret: string | undefined, name: string | undefined) {
    this.secret = secret || 'big ole bunch of junk text';
    this.name = name || 'sess';
    this.resave = false;
    this.saveUninitialized = true;
    this.cookie = { secure: false, httpOnly: true, maxAge: 60000 * 60 * 24 };
  }

  public setStore(store: any) {
    this.store = store;
  }
}
let buildVersion = '';
// for... reasons.
try {
  const packageJSONBuffer = fs.readFileSync(path.join(__dirname, '../../package.json'));
  const packageJSON = JSON.parse(packageJSONBuffer.toString());
  buildVersion = packageJSON.version || 'Version error';
} catch (e) {
  const packageJSONBuffer = fs.readFileSync(path.join(__dirname, '../package.json'));
  const packageJSON = JSON.parse(packageJSONBuffer.toString());
  buildVersion = packageJSON.version || 'Version error';
}

// These users don't exist in prod - so :shrug:
// You _have_ to put in an admin token to populate your local DB.
const headerTokenString = {
  evaluator_one: 'evaluator_one' + process.env.DEMO_TOKEN,
  evaluator_two: 'evaluator_two' + process.env.DEMO_TOKEN,
  evaluator_three: 'evaluator_three' + process.env.DEMO_TOKEN,
  evaluator_four: 'evaluator_four' + process.env.DEMO_TOKEN,
  evaluator_five: 'evaluator_five' + process.env.DEMO_TOKEN,
  reviewer: 'reviewer' + process.env.DEMO_TOKEN,
  admin: process.env?.ADMIN_TOKEN || null,
};

const env = process.env.APP_ENV?.toString() || 'development';
// logger.info(`Database Connection Set to ${env}`);

const dbURI: string =
  process.env.POSTGRES_URI ||
  (process.env.VCAP_SERVICES && process.env.VCAP_SERVICES.match(PSQLREGEX)![1]) ||
  'postgres://docker_pg_user:docker_pg_pw@docker_db:5432/docker_db';

const openIdConfig: OpenIDConfiguration = {
  issuerDiscover: process.env.ISSUER_DISCOVER || 'https://idp.int.identitysandbox.gov/.well-known/openid-configuration',
  clientId: process.env.CLIENT_ID || 'urn:gov:gsa:openidconnect.profiles:sp:sso:opm_usds:sme_qa',
  redirectUri: process.env.REDIRECT_URI || 'http://localhost:9000/login/auth',
  secretKey: process.env.LOGIN_KEY || '',
};
const sessionConfig: SessionConfiguration = new SessionConfiguration(process.env?.SESSION_SECRET, process.env.NODE_ENV?.toString());

// @ts-ignore
const headerTokens: { [tokenName: string]: string } = headerTokenString;

export { env };
export { dbURI };
export { openIdConfig };
export { sessionConfig };
export { headerTokens };
export { buildVersion };
