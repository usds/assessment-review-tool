import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { createObjectCsvWriter } from 'csv-writer';
import { exec } from 'child_process';
const writer = createObjectCsvWriter;

const data_monster = '/Users/kelvinluu-usds/Projects/SME-QA-Tool/api/agencyInfo/prod/DSC/DATAMGT.xlsx';
const data_upload = '/Users/kelvinluu-usds/Projects/SME-QA-Tool/api/agencyInfo/prod/DSC/data/applicants';
const data_modifier = '111';
const dataAction = [data_monster, data_upload, data_modifier];

const cyber_monster = '/Users/kelvinluu-usds/Projects/SME-QA-Tool/api/agencyInfo/prod/DSC/INFOSEC.xlsx';
const cyber_upload = '/Users/kelvinluu-usds/Projects/SME-QA-Tool/api/agencyInfo/prod/DSC/cyber/applicants';
const cyber_modifier = '222';
const cyberAction = [cyber_monster, cyber_upload, cyber_modifier];

const design_monster = '/Users/kelvinluu-usds/Projects/SME-QA-Tool/api/agencyInfo/prod/DSC/ENTARCH.xlsx';
const design_upload = '/Users/kelvinluu-usds/Projects/SME-QA-Tool/api/agencyInfo/prod/DSC/design/applicants';
const design_modifier = '333';
const designAction = [design_monster, design_upload, design_modifier];

const product_monster = '/Users/kelvinluu-usds/Projects/SME-QA-Tool/api/agencyInfo/prod/DSC/Project.xlsx';
const product_upload = '/Users/kelvinluu-usds/Projects/SME-QA-Tool/api/agencyInfo/prod/DSC/product/applicants';
const product_modifier = '444';
const productAction = [product_monster, product_upload, product_modifier];

const swe_monster = '/Users/kelvinluu-usds/Projects/SME-QA-Tool/api/agencyInfo/prod/DSC/APPSW.xlsx';
const swe_upload = '/Users/kelvinluu-usds/Projects/SME-QA-Tool/api/agencyInfo/prod/DSC/swe/applicants';
const swe_modifier = '555';
const sweAction = [swe_monster, swe_upload, swe_modifier];

[dataAction, cyberAction, designAction, productAction, sweAction].forEach(([MONSTER_FILE, UPLOADFILE, MODIFIER]) => {
  exec(`xlsx2csv ${MONSTER_FILE} --all`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error ${error.message}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
    fs.writeFileSync(`${UPLOADFILE}_original.csv`, stdout);
    const results = parse(stdout, {
      columns: true,
      skip_empty_lines: true,
      fromLine: 4,
      relax_column_count_less: true,
    }).map(record => {
      return {
        'Vacancy ID': record['PHASE ID'],
        'Assessment ID': record['PHASE ID'],
        'Application ID': `${MODIFIER}${record['ID']}`,
        'Application Rating ID': `${MODIFIER}${record['ID']}`,
        'Applicant Last Name': record['LAST NAME'],
        'Applicant First Name': record['FIRST NAME'],
        'Applicant Middle Name': record['MIDDLE NAME'],
        'Application Number': `${MODIFIER}${record['ID']}`,
        'Rating Combination': record['PHASE ID'],
      };
    });

    const writeCleaned = writer({
      path: `${UPLOADFILE}.csv`,
      header: [
        { id: 'Vacancy ID', title: 'Vacancy ID' },
        { id: 'Assessment ID', title: 'Assessment ID' },
        { id: 'Application ID', title: 'Application ID' },
        { id: 'Application Rating ID', title: 'Application Rating ID' },
        { id: 'Applicant Last Name', title: 'Applicant Last Name' },
        { id: 'Applicant First Name', title: 'Applicant First Name' },
        { id: 'Applicant Middle Name', title: 'Applicant Middle Name' },
        { id: 'Application Number', title: 'Application Number' },
        { id: 'Rating Combination', title: 'Rating Combination' },
      ],
    });
    writeCleaned
      .writeRecords(results)
      .then(() => console.log('done'))
      .catch(console.error);
  });
});
//  Assessment Vehicle should be "SME Resume Review"
