Cold Start:
1. Cloud.gov: Create application shell with APP_NAME
    - APP_NAME will be the application name
    - The shell is the empty cloud.gov instance
    - This will also be your route
2. Services ->micro  Create new service -> Market place service -> DB_NAME
    - RDS psql
    - For prod, ensure it's redundant
3. Ensure that you have the correct permissions:
    - Space needs to have "trusted local_networks_egress" security group
4. Create Github action deployment secrets:
    - cf create-service cloud-gov-service-account space-deployer $SPACE_DEPLOYER_NAME
    - cf create-service-key $SPACE_DEPLOYER_NAME $SPACE_DEPLOYER_NAME_KEY
    - cf service-key $SPACE_DEPLOYER_NAME $SPACE_DEPLOYER_NAME_KEY
        - This will output the CF_USERNAME and CF_PASSWORD
5. Add service keys to github actions
    - set CF_USERNAME and CF_PASSWORD to {env}_CF_PASSWORD and {env}_CF_USERNAME in github
6. Run a deployment
7. Confirm you can connect to the DB:
    > cf connect-to-service $APP_NAME $DB_NAME
8. Update the DB by running the migrations
9. Create login.gov creds: https://developers.login.gov/oidc/getting-started/
    - See `util/gencert.sh`
10. Create an app in the login.gov partner dashboard
11. Set your env vars:
    - APP_ENV - Should be set by manifest
    - REDIRECT_URI - Should be set by manifest
    - SESSION_SECRET - anything really
    - CLIENT_ID - login.gov issuer
    - ISSUER_DISCOVER - login.gov discover URI
    - LOGIN_KEY - private key attached to cert generated in step
        ```sh
        export PRIVATE_KEY=`cat <PRIVATE_KEY.PEM>`
        cf set-env example-name-staging LOGIN_KEY "$PRIVATE_KEY"
        ```
    - use `cf set-env`
12. for production: create _another_ login.gov app and have it promoted to prod

## EXAMPLE VALUES:
APP_NAME = example-name-staging
DB_NAME = example-name-staging-db
SPACE_DEPLOYER_NAME = example-name-staging-deployer
SPACE_DEPLOYER_NAME_KEY = example-name-staging-deployer-key
CLIENT_ID = urn:gov:gsa:openidconnect.profiles:sp:sso:omb:usds
ISSUER_DISCOVER = https://idp.int.identitysandbox.gov/.well-known/openid-configuration
SESSION_SECRET = asiduf24kzx
LOGIN_KEY = `cat <PRIVATE_KEY.PEM>`
export PRIVATE_KEY=`cat <PRIVATE_KEY.PEM>`
cf set-env example-name-staging LOGIN_KEY "$PRIVATE_KEY"
