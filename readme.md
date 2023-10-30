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

### Life Code:

The caching is fairly aggressive for the build process. This might cause some issues later...

[Prod: main](https://smeqa-rr-tool.app.cloud.gov)
[Stage: Stage](https://smeqa-staging.app.cloud.gov)
[~Demo:~](https://smeqa-demo.app.cloud.gov)
