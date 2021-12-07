# CD Setup

1. Create a copy of `~/.github/workflows/push-staging.yml` for your branch
2. Update `Build frontend` to include demo accounts or not
3. Update `Deploy to cloud.gov` with appropriate secret credentials and manifest file (see below):
   - `cf_username: ${{secrets.<CF_USERNAME>}}`
   - `cf_password: ${{secrets.<CF_PASSWORD>}}`
   - `cf_manifest: <manifest.yml>`
   - determine if you need rolling deploys and possibly add a `cf_command`
4. Create a copy of `~/stage-manifest.yml` with appropriate variables
   - `instances: <number of instances>`
   - `memory: <memory>`
   - `APP_ENV: <app_env>`
   - `AUTH_CALLBACK_ROOT_URL: <CALLBACK ROOT>`
   - `REDIRECT_URI: <REDIRECT URI>`
   - `services: - <ATTACHED SERVICES>`

Generating a CF deploy user
NOTE: There should only be one per an app. These should never be shared across environments.

```sh
cf create-service cloud-gov-service-account space-deployer <service-account-name>
#  use cf services to see existing services
cf create-service-key <service-account-name> <service-key-name>
cf service-key <service-account-name> <service-key-name>
```

Add these to github secrets with the appropriate labels

See : https://cloud.gov/docs/services/cloud-gov-service-account/

Pushing up environmental variables:

```sh
export <EXAMPLE_KEY>=`cat ./util/<keyfile>.key`
cf set-env <app> <VAR> "$<EXAMPLE_KEY>"
```
