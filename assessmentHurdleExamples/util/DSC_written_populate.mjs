import fs from "fs";
import { parse } from "csv-parse/sync";
import { createObjectCsvWriter } from "csv-writer";
const HRUsers = [
  {
    email: "kelvin.t.luu@omb.eop.gov",
    name: "Kelvin Luu",
  },
  {
    email: "william.slack@cms.hhs.gov",
    name: "Will Slack",
  },
  { email: "chris.kuang@gsa.gov", name: "chris.kuang@gsa.gov" },
  { email: "caitlin.gandhi@gsa.gov", name: "caitlin.gandhi@gsa.gov" },
  { email: "maria.danilova@gsa.gov", name: "maria.danilova@gsa.gov" },
  { email: "reona.shannon@gsa.gov", name: "reona.shannon@gsa.gov" },
  { email: "sylvia.velez-zuniga@gsa.gov", name: "sylvia.velez-zuniga@gsa.gov" },
  { email: "stephanie.bernstein@gsa.gov", name: "stephanie.bernstein@gsa.gov" },
  { email: "loyola.ukpokodu@gsa.gov", name: "loyola.ukpokodu@gsa.gov" },
];

const writer = createObjectCsvWriter;

const dataApplicantStart =
  "/Users/kelvinluu-usds/Projects/assessment-review-tool/assessmentHurdleExamples/prod/DSC/data";
const dataApplicantWritten =
  "/Users/kelvinluu-usds/Projects/assessment-review-tool/assessmentHurdleExamples/prod/DSC_written/data";
const dataTrack = "data_assessment_id_1_written";
const dataModifier = "111";
const dataAction = [
  dataApplicantStart,
  dataModifier,
  dataTrack,
  dataApplicantWritten,
];

const cyberApplicantStart =
  "/Users/kelvinluu-usds/Projects/assessment-review-tool/assessmentHurdleExamples/prod/DSC/cyber";
const cyberApplicantWritten =
  "/Users/kelvinluu-usds/Projects/assessment-review-tool/assessmentHurdleExamples/prod/DSC_written/cyber";
const cyberModifier = "222";
const cyberTrack = "cyber_assessment_1_written";
const cyberAction = [
  cyberApplicantStart,
  cyberModifier,
  cyberTrack,
  cyberApplicantWritten,
];

const designApplicantStart =
  "/Users/kelvinluu-usds/Projects/assessment-review-tool/assessmentHurdleExamples/prod/DSC/design";
const designApplicantWritten =
  "/Users/kelvinluu-usds/Projects/assessment-review-tool/assessmentHurdleExamples/prod/DSC_written/design";
const designModifier = "333";
const designTrack = "design_assessment_1_written";
const designAction = [
  designApplicantStart,
  designModifier,
  designTrack,
  designApplicantWritten,
];

const productApplicantStart =
  "/Users/kelvinluu-usds/Projects/assessment-review-tool/assessmentHurdleExamples/prod/DSC/product";
const productApplicantWritten =
  "/Users/kelvinluu-usds/Projects/assessment-review-tool/assessmentHurdleExamples/prod/DSC_written/product";
const productModifier = "444";
const productTrack = "product_assessment_1_written";
const productAction = [
  productApplicantStart,
  productModifier,
  productTrack,
  productApplicantWritten,
];

const sweApplicantStart =
  "/Users/kelvinluu-usds/Projects/assessment-review-tool/assessmentHurdleExamples/prod/DSC/swe";
const sweApplicantSWritten =
  "/Users/kelvinluu-usds/Projects/assessment-review-tool/assessmentHurdleExamples/prod/DSC_written/swe";
const sweModifier = "555";
const sweTrack = "swe_assessment_1_written";
const sweAction = [
  sweApplicantStart,
  sweModifier,
  sweTrack,
  sweApplicantSWritten,
];

const newApplicantList = parse(
  fs.readFileSync(
    "/Users/kelvinluu-usds/Projects/assessment-review-tool/assessmentHurdleExamples/prod/DSC_written/all_applicants.csv"
  ),
  {
    columns: true,
    skip_empty_lines: true,
  }
).reduce(
  (memo, applicant) => {
    let track = "";
    switch (applicant["Track"]) {
      case "Cybersecurity(INFOSEC)":
        track = cyberTrack;
        break;
      case "Data Science & Analytics(DATAMGT)":
        track = dataTrack;
        break;
      case "Design(ENTARCH)":
        track = designTrack;
        break;
      case "Product Management(Project Manager)":
        track = productTrack;
        break;
      case "Software Engineering(APPSW)":
        track = sweTrack;
        break;
      default:
        throw new Error("track not found" + applicant["track"]);
    }

    memo[track].push({
      id: applicant["Applicant ID"],
      name: applicant["Applicant Name"],
      sme: applicant["SME"],
    });
    return memo;
  },
  {
    [cyberTrack]: [],
    [dataTrack]: [],
    [designTrack]: [],
    [productTrack]: [],
    [sweTrack]: [],
  }
);
fs.writeFileSync(
  "/Users/kelvinluu-usds/Projects/assessment-review-tool/assessmentHurdleExamples/prod/DSC_written/all_applicants.json",
  JSON.stringify(newApplicantList)
);
const applicantMisMatches = [];
[dataAction, cyberAction, designAction, productAction, sweAction].forEach(
  ([APPLICANTFILE, MODIFIER, TRACK, WRITTENFILE]) => {
    const allTrackApplicants = parse(
      fs.readFileSync(`${APPLICANTFILE}/applicants.csv`),
      {
        columns: true,
        skip_empty_lines: true,
      }
    ).reduce((memo, applicant) => {
      memo[applicant["Application Number"]] = applicant;
      return memo;
    }, {});
    const currentUsers = {};

    const applicantList = newApplicantList[TRACK].map((applicant) => {
      const applicantData = allTrackApplicants[`${MODIFIER}${applicant.id}`];
      if (!applicantData) {
        throw new Error("applicant not found, id: " + applicant.id);
      }
      if (
        `${applicantData["Applicant First Name"].trim()} ${applicantData[
          "Applicant Last Name"
        ].trim()}` != applicant.name.trim()
      ) {
        applicantMisMatches.push([applicant, applicantData, TRACK]);
        return;
      }
      if (currentUsers[applicant.sme]) {
        currentUsers[applicant.sme].push(
          `${applicantData["Applicant First Name"].trim()} ${applicantData[
            "Applicant Middle Name"
          ].trim()} ${applicantData["Applicant Last Name"].trim()}`
        );
      } else {
        currentUsers[applicant.sme] = [
          `${applicantData["Applicant First Name"].trim()} ${applicantData[
            "Applicant Middle Name"
          ].trim()} ${applicantData["Applicant Last Name"].trim()}`,
        ];
      }
      return {
        ...applicantData,
      };
    }).filter((applicant) => applicant);
    const writeCleaned = writer({
      path: `${WRITTENFILE}/applicants.csv`,
      header: [
        { id: "Vacancy ID", title: "Vacancy ID" },
        { id: "Assessment ID", title: "Assessment ID" },
        { id: "Application ID", title: "Application ID" },
        { id: "Application Rating ID", title: "Application Rating ID" },
        { id: "Applicant Last Name", title: "Applicant Last Name" },
        { id: "Applicant First Name", title: "Applicant First Name" },
        { id: "Applicant Middle Name", title: "Applicant Middle Name" },
        { id: "Application Number", title: "Application Number" },
        { id: "Rating Combination", title: "Rating Combination" },
      ],
    });
    writeCleaned
      .writeRecords(applicantList)
      .then(() => console.log("done"))
      .catch(console.error);
    const usersJSON = {
      userSetup: [
        {
          role: 1,
          users: HRUsers,
        },
        {
          role: 2,
          users: Object.keys(currentUsers).map((user) => ({
            email: user.toLowerCase(),
            name: user.toLowerCase(),
          })),
        },
      ],
    };
    /**
     * This generates a sql file that first sets ALL users to inactive queues
     * so that they cannot be assigned to any applicants.
     *
     * Then it sets the assigned users to the correct queues.
     */
    fs.writeFileSync(`${WRITTENFILE}/users.json`, JSON.stringify(usersJSON));
    let SQL = `
    INSERT INTO application_assignments(
      evaluator_id
      ,applicant_id
      ,assessment_hurdle_id
      ,active
    ) (SELECT 
        ahu.app_user_id
        , a.id
        , a.assessment_hurdle_id
        , false 
        FROM applicant a
        LEFT JOIN assessment_hurdle_user ahu ON ahu.assessment_hurdle_id = a.assessment_hurdle_id 
        LEFT JOIN assessment_hurdle ah ON ah.id = a.assessment_hurdle_id
        LEFT JOIN assessment_hurdle_meta am ON am.assessment_hurdle_id = ah.id
        WHERE am.staffing_assessment_id = '${TRACK}')
    ON CONFLICT ON CONSTRAINT unique_combo_eval_app
    DO UPDATE 
    SET active = false;

    INSERT INTO application_assignments(
      active
      ,applicant_id
      ,evaluator_id
      ,assessment_hurdle_id
    )
    SELECT 
      true
      , a.id applicant_id
      , app_user.id app_user_id
      , ah.id
      FROM applicant a
      LEFT JOIN (VALUES
      ${Object.entries(currentUsers).flatMap(([user, applicants]) =>
        applicants.map(
          (applicant) =>
            `('${user.replace("'", "''")}', '${applicant.replace("'", "''")}')`
        )
      )}
      ) AS temp_users(email, name) ON LOWER(REPLACE(temp_users.name, ' ', '')) = LOWER(REPLACE(a.name, ' ', ''))
      LEFT JOIN app_user ON LOWER(REPLACE(app_user.email, ' ','')) = LOWER(REPLACE(temp_users.email, ' ',''))
      LEFT JOIN assessment_hurdle ah on ah.id = a.assessment_hurdle_id
      LEFT JOIN assessment_hurdle_meta ahm on ahm.assessment_hurdle_id = ah.id
      WHERE ahm.staffing_assessment_id = '${TRACK}'
      ON CONFLICT ON CONSTRAINT unique_combo_eval_app 
      DO UPDATE 
      SET active = true;;
    `;
    // write new user files for each track based on actual SME's assigned
    fs.writeFileSync(
      `${WRITTENFILE}/userAssignments.json`,
      JSON.stringify(Object.entries(currentUsers))
    );
    // Write out SQL per a track
    fs.writeFileSync(
      `${WRITTENFILE}/userAssignments.sql`,
      SQL.replace(/\n/g, " ").replace(/\s+/g, " ")
    );
  }
);
// Save the mis-matched applicants for manual review
fs.writeFileSync(
  "/Users/kelvinluu-usds/Projects/assessment-review-tool/assessmentHurdleExamples/prod/DSC_written/bad_data_applicants.json",
  JSON.stringify(applicantMisMatches)
);
