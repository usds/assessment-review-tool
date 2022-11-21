## Pre-requisites
- Xcode select (for OSX)
- homebrew
    - jq
    - nvm
- psql

## Tunnel Access For Direct DB access
1. cd into ../api/
2. `npm run tunnel:stage`
    - this can also be `npm run tunnel:prod` for production access
3. Retrieve the db uri access string:
    - e.g. via APP_NAME=smeqa-staging && myapp_guid=$(cf app --guid $APP_NAME) && cf curl /v2/apps/$myapp_guid/env
    - system_env_json.VCAP_SERVICES.aws-rds.credentials.uri
4. change the host to your localhost, e.g.:
    - `postgres://fakeuser:fakepassword@cg-aws-broker-dfsjhdlfksd.sjkdhfksdf.us-gov-west-1.rds.amazonaws.com:5432/fakedbname`
    - Should become: `postgres://fakeuser:fakepassword@localhost:5432/fakedbname` (pattern is `postgres://<user>:<pass>@<host>:<port>/<db>`)
5. run in the cli `psql postgres://fakeuser:fakepassword@localhost:5432/fakedbname`
6. You are now in the DB

To see any existing columns, use the db/migrations files for reference
To remove a hiring action `DELETE FROM assessment_hurdle where ID = '<ID>'`