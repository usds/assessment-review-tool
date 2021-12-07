## About

This is the OPM Hiring Pilot's web app (front and backend) for the SME Qualification Assessment (SME-QA) hiring process.

The first version of this app will contain the resume review checklist used by both HR and SMEs.

# SME-QA Assessment Review Tool (ART)

The SME-QA Assessment Review Tool is a micro-app built for evaluating competency/TKS/KSA/etc statements against applicant provided materials - usually in the form of a resume and/or portfolio. Each statement can be evaluated against the materials until the applicant either passes or fails the evaluation, at which point the evaluator is able to move on.

The evaluator will see all of the competencies for the positions that an applicant applied for; each competency/TKS/KSA statement is evaulatued individually, and if the applicant's materials do not show that they meet the bar required, then the evaluator selects the reason why and is able to add/edit their commentary on why.

If all competencies are met and that applicant passes, then the evaluator is able to supply commentary on the entire application on why their decision was made.

Once submitted, the evaluation with any reasons provided will then be reviewed and validated, usually by HR. This allows the _reviewer_ to reject the _evaluator's_ evaluation if there issues with the evaluation and for the evaluator to amend it.

### Stack:

- nodejs/express
- react/redux
- postgres
- cloud.gov
- [cf cli](https://github.com/cloudfoundry/cli)

## CD Setup

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

### Deployment:

The caching is fairly aggressive for the build process. This might cause some issues later...

[Branch: Stage](https://smeqa-staging.app.cloud.gov) - smeqa-stage-service - smeqa-stage-key
[~Branch: Demo~](https://smeqa-demo.app.cloud.gov)
[~Branch: main~](https://smeqa-rr.app.cloud.gov)
