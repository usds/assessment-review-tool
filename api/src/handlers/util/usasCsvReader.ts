import path from 'path';
import fs from 'fs';

import { parse } from 'fast-csv';
import { validateOrReject, ValidationError } from 'class-validator';

import BulkUSASApplicationsDto, { USASApplicationDto } from '../../dto/BulkApplicantApplications.dto';
import { logger } from '../../utils/logger';
import HttpException from '../../exceptions/HttpException';

export default class USASCsvReader {
  static async parseFile(filePath: string): Promise<BulkUSASApplicationsDto> {
    return new Promise<BulkUSASApplicationsDto>((resolve, reject) => {
      const bulkApplications: BulkUSASApplicationsDto = new BulkUSASApplicationsDto();
      const fileRowPromise: Promise<any>[] = [];
      fs.createReadStream(path.resolve(filePath))
        .pipe(parse({ headers: true }))
        .on('error', reject)
        .on('data', (row: any) => {
          if (!row || !row['Application Number']) {
            logger.warn('Row empty or applicant without USAS number');
            return;
          }
          fileRowPromise.push(
            new Promise((nestedResolve): void => {
              const application = new USASApplicationDto();
              application.firstName = row['Applicant First Name'];
              application.lastName = row['Applicant Last Name'];
              application.middleName = row['Applicant Middle Name'];
              application.staffingApplicationId = row['Application ID'];
              application.staffingApplicationNumber = row['Application Number'];
              application.staffingAssessmentId = row['Assessment ID'];
              application.staffingRatingCombination = row['Rating Combination'];
              application.staffingRatingId = row['Application Rating ID'];
              bulkApplications.applications.push(application);
              nestedResolve(null);
            }),
          );
        })
        .on('end', () =>
          Promise.all(fileRowPromise)
            .then(async () => {
              await validateOrReject(bulkApplications);
              resolve(bulkApplications);
            })
            .catch(errors => {
              if (errors.length > 0) {
                // @ts-ignore
                const message = errors.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
                reject(new HttpException(400, message));
              }
            }),
        );
    });
  }
}
