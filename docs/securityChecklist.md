# Security checklist

- Cloud foundry deploy credentials last update
  - stage: November 2021
  - prod: December 2021
- Login.gov credentials last update:
  - stage: November 2021
  - prod: ???
- Dependency check: ???

### Dependency Checking

In addition to the npm dependency checking, there are additional dependency checks that can be done via https://github.com/jeremylong/DependencyCheck.

Reference:

```sh
dependency-check --project "SME-QA-Tool" --scan ".../SME-QA-Tool/api/" --out "./security/dependency-check-api.html"
```
