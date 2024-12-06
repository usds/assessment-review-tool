Cold Start:

To change your space or org for the cloud foundry session:
`$ cf target -o gsa-tts-usdc -s prod`

1. Cloud.gov: Create application shell with APP_NAME
    - APP_NAME will be the application name
    - The shell is the empty cloud.gov instance
    - This will also be your route
2. Services ->micro  Create new service -> Market place service -> DB_NAME
    - RDS psql
    - Bind to application created in step 1 - no parameters
        - if this fails, follow the binding steps in `db/README.md`
    - For prod, ensure it's `small-redundant`
3. Ensure that you have the correct permissions:
    - Space needs to have "trusted local_networks_egress" security group
    - to see secuirty groups for your space: `$ cf space <space> `
    - you need `public_networks_egress` to be part of the running security group.
    - To update this: use the following example: 
        `cf bind-security-group public_networks_egress gsa-tts-usdc --space staging`
        `cf bind-security-group public_networks_egress <ORG> --space <SPACE>`
4. Create Github action deployment secrets:
    - ```sh
        $ export SPACE_DEPLOYER_NAME=<SERVICE_ACCOUNT_NAME>
        $ cf create-service cloud-gov-service-account space-deployer $SPACE_DEPLOYER_NAME
        $ cf create-service-key $SPACE_DEPLOYER_NAME ${SPACE_DEPLOYER_NAME}_KEY
        $ cf service-key $SPACE_DEPLOYER_NAME ${SPACE_DEPLOYER_NAME}_KEY
    ```
        - This will output the CF_USERNAME and CF_PASSWORD
5. Add service keys to github actions
    - set CF_USERNAME and CF_PASSWORD to {env}_CF_PASSWORD and {env}_CF_USERNAME in github actions
    - these are referenced in `.github/workflows`
    - ensure correct `organization` and `space` in `.github/workflows`
    - if the workflow uses `cf_command`, ensure that it is pushing to the correct app
    - ensure correct `name` `urls` and `services` in `.deploy${ENV}`
    - ensure buildpack supports your node version in `api/package.json` https://github.com/cloudfoundry/nodejs-buildpack/releases
6. Run a deployment
7. Confirm you can connect to the DB:
    > `$ cf connect-to-service $APP_NAME $DB_NAME`
8. Update the DB by running the migrations
    > Ensure that api/package.json has correct APP_NAME for tunnel
    > Create Tunnel: `api $ npm run tunnel:stage`
    > Grab the postgres uri: `cf curl /v2/apps/$(cf app --guid $APP_NAME)/env | jq -r '[.system_env_json.VCAP_SERVICES."aws-rds"[0].credentials | .uri]'`
    > Create a `db/local_env.sh` file and ensure it has a line as follows:
    ```
    # Staging Env
    export POSTGRES=postgres://<USERNAME>:<PASSWORD>@localhost:<PORT>/<DB_NAME>
    # You should only need to replace the URL with "localhost". The username, password, port, and db name should all work.
    ```
    > Once this is done, you should be able to run `db/migrations.sh`
9. Create the Admin token for uploads:
    `$ cf set-env $APP_NAME ADMIN_TOKEN <RANDOM STRING>`
    `$ cf restage $APP_NAME`
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
