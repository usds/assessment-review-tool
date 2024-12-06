# Creating a new hiring action

For any hiring action that you create you will need 5 files:

- `applicants.csv`
- `assessmentHurdle.json`
- `competencies.json`
- `specialties.json`
- `users.json`

Examples of these are all located in `resumeYesNoOnlySmall`, with more details below.

## Applicants.csv
These should be exported from USA Staffing after the hiring action has been set up correctly to export and import candidates. This file should not be changed at all, but should be able to be uploaded directly into the tool. 

There are exceptions to this, for example when doing complex hiring actions or hiring for multiple positions/grades.

Fields that you need to pay specific attention to here are:
`Vacancy ID`, `Assessment ID`, and `Rating Combination`

The Vacancy ID and Assessment ID should match those in the `assessmentHurdle.json` and the Rating Combination should match the `localId` field in the `specialties.json` file.

## assessmentHurdle.json

This file sets up your hiring action with both meta details and also also decides how many evaluations will be required for each action.

Due to the prototype nature of this application, there are some fields that are not used, which will be listed below:

- departmentName: String
- componentName: String
- positionName: String
- assessmentName: String - e.g. Resume Review or Written Assessment
- positionDetails: String - e.g. GS 10
- locations: String
- startDatetime: Datetime - unused
- endDatetime: Datetime - unused
- hurdleDisplayType: integer - use 1
- evaluationsRequired: integer
- hrEmail: string
- hrName: string
- vacancyId: string
- assessmentId: string

## competencies.json

This file lists out all the competencies and possible selections for them. 

A competency has:
- name: string - the name of the competency
- localId: string - an unexposed unique identifier for the competency that will be used in the `specialties.json` file.
- definition: string -  this is shown in an expandable field when evaluators want to review their understanding of the competency/field.
- requiredProficiencyDefinition: string - this is always shown above the selectors for an evaluator.
- displayType: integer - This is used to change how the competency is displayed, default to 1 unless you have a specific, known, use case.
- sortOrder: integer
- screenOut: boolean - whether a failure in this field overrides point value summations that could pass a candidate, usually true.
- selectors: These are the possible radio values that an evaluator will see when doing an evaluation:
    - displayName: string - the text next to the radio button
    - defaultText: string - what will be filled in for the reason when this is selected.
    - sortOrder: integer
    - pointValue: integer - this determines how many "points" this selector is worth. These points are used to determine if a candidate passes, meets, or exceeds a specialty.

## specialties.json

This file contains all the specialties that an action is evaluating. Due to the prototype nature of the application we recommend only using one.
- name: string - unused by the frontend, but useful for auditing and understanding what is going on.
- categoryRatings: the only valid categories are "does_not_meet", "meets", and "exceeds". "Exceeds" is not required, but "meets" and "does_not_meet" are.  The points are the sum total of all competency points required to pass. If any of the competencies failed were `screenOut` competencies, then the applicant will fail this specialty regardless of their total sum of points. The `nor` code is what will be put into the exported file from the tool for re-upload into USA Staffing.
- localId: string - this should match the `Rating Combination` from the `applicants.csv` that is being evaluated by this specialty.
- competencyLocalIds: `[string]` - a list of the `competencies.json` `localId`s that comprise the evaluation of this specialty.

## users.json

There are two roles: 
Role of type `1` are HR uses, role of type `2` are SME users.