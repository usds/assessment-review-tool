## CI/CD

```sh
cf create-service cloud-gov-service-account space-deployer <service-account-name>
cf create-service-key <service-account-name> <service-key-name>
cf service-key <service-account-name> <service-key-name>
```

See : https://cloud.gov/docs/services/cloud-gov-service-account/

Pushing up keys:

```sh
<EXAMPLE_KEY>=`cat ./util/<keyfile>.key` cf set-env <app> <VAR> "$<EXAMPLE_KEY>"
```

### Deployment:

[Branch: Stage](https://smeqa-staging.app.cloud.gov)
[Branch: Demo](https://smeqa-demo.app.cloud.gov)
[Branch: main](https://smeqa-rr.app.cloud.gov)
