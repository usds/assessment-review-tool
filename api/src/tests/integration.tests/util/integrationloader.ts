import fs from 'fs';
import path from 'path';

import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';

import DB from '../../../database';
import { logger } from '../../../utils/logger';
import USASCsvReader from '../../../handlers/util/usasCsvReader';

import { Applicant } from '../../../models/applicant';
import { AppUser } from '../../../models/app_user';
import { AssessmentHurdle } from '../../../models/assessment_hurdle';
import CreateAssessmentHurdleDto from '../../../dto/createassessmenthurdle.dto';
import CreateCompetenciesDto from '../../../dto/createcompetencies.dto';
import CreateSpecialtiesDto from '../../../dto/createspecialties.dto';
import CreateHurdleUserDto from '../../../dto/createhurdleuser.dto';

import AssessmentHurdleService from '../../../services/assessmenthurdle.service';
import CompetencyService from '../../../services/competency.service';
import SpecialtyService from '../../../services/specialty.service';
import ApplicantService from '../../../services/applicant.service';
import UserService from '../../../services/users.service';

export enum IntegrationFiles {
  Applicants = 'applicants.csv',
  AssessmentHurdle = 'assessmentHurdle.json',
  Competencies = 'competencies.json',
  Specialties = 'specialties.json',
  Users = 'users.json',
}

export default class IntegrationLoader {
  dataFolderPath: string;
  db: DB;

  constructor(dataFolderPath: string) {
    this.dataFolderPath = dataFolderPath;
    this.checkPath();
    this.db = new DB();
  }

  private checkPath() {
    const check = path.join(this.dataFolderPath, IntegrationFiles.Users);
    if (!fs.existsSync(check)) {
      throw new Error(`Data files do not exist at ${this.dataFolderPath}`);
    }
  }

  async checkDatabaseSchema() {
    await this.db.sequelize.sync();
  }

  async loadTestingData(
    randomizeMeta = false,
    purgeFirst = false,
  ): Promise<{
    assessmentHurdleId: string;
    applicantCount: number;
    applicantIds: string[];
  }> {
    if (purgeFirst) {
      logger.warn('Purging data'!);
      await this.purgeTestingData();
    }
    logger.info(`Loading Test Data from ${this.dataFolderPath}`);
    const rawAssessmentHurdle: CreateAssessmentHurdleDto = JSON.parse(this.readJsonFile(IntegrationFiles.AssessmentHurdle));
    const validationHurdle = await validate(plainToClass(CreateAssessmentHurdleDto, rawAssessmentHurdle), { skipMissingProperties: true });
    if (validationHurdle.length > 0) this.throwValidationErrors(validationHurdle);

    if (randomizeMeta) {
      // This will prevent meta collisions when it's not necessary to use meta data.
      rawAssessmentHurdle.vacancyId = uuidv4();
      rawAssessmentHurdle.assessmentId = uuidv4();
    }

    const svc = new AssessmentHurdleService();
    const rst = await svc.upsert(rawAssessmentHurdle);
    const assessmentHurdleId = rst.id;

    logger.info(`Created AssessmentHurdle ${rst.id}`);

    const rawCompetencies: CreateCompetenciesDto = JSON.parse(this.readJsonFile(IntegrationFiles.Competencies));

    rawCompetencies.assessmentHurdleId = rst.id;
    rawCompetencies.competencies.forEach(rc => {
      rc.assessmentHurdleId = rst.id;
    });

    const validationComps = await validate(plainToClass(CreateCompetenciesDto, rawCompetencies), { skipMissingProperties: true });
    if (validationComps.length > 0) this.throwValidationErrors(validationComps);

    const compService = new CompetencyService();

    const competencies = await compService.upsertAll(rawCompetencies, assessmentHurdleId);
    logger.info(`Created ${competencies.length} Competencies`);

    const rawSpecialties: CreateSpecialtiesDto = JSON.parse(this.readJsonFile(IntegrationFiles.Specialties));

    const validationSpecialties = await validate(plainToClass(CreateSpecialtiesDto, rawSpecialties), { skipMissingProperties: true });
    if (validationSpecialties.length > 0) this.throwValidationErrors(validationComps);

    const specService = new SpecialtyService();
    const specialties = await specService.upsertAll(rawSpecialties, rst.id);
    logger.info(`Created ${specialties.length} Specialties`);

    const applicantService = new ApplicantService();
    const csvPath = path.join(this.dataFolderPath, IntegrationFiles.Applicants);
    const rawApplications = await USASCsvReader.parseFile(csvPath);

    const applicants = await applicantService.bulkUSASUpsert(rawApplications, rst.id);
    logger.info(`Created ${applicants.length} applicants`);

    const rawUsers: CreateHurdleUserDto = JSON.parse(this.readJsonFile(IntegrationFiles.Users));
    const validationUsers = await validate(plainToClass(CreateHurdleUserDto, rawUsers), { skipMissingProperties: true });
    if (validationUsers.length > 0) this.throwValidationErrors(validationComps);

    const userService = new UserService();

    const users = await userService.createUserAndAddToHurdle(rawUsers, assessmentHurdleId);
    logger.info(`Created ${users.length} Users`);

    await rst.reload();
    return {
      assessmentHurdleId: rst.id,
      applicantCount: applicants.length,
      applicantIds: applicants.map(a => a.id),
    };
  }

  private async purgeTestingData() {
    await Applicant.destroy({
      truncate: true,
      cascade: true,
    });
    await AssessmentHurdle.destroy({
      truncate: true,
      cascade: true,
    });
    await AppUser.destroy({
      truncate: true,
      cascade: true,
    });
  }

  private readJsonFile(file: IntegrationFiles): string {
    return fs.readFileSync(path.join(this.dataFolderPath, file), {
      encoding: 'utf-8',
      flag: 'r',
    });
  }

  private throwValidationErrors(validationHurdle: ValidationError[]) {
    // @ts-ignore
    const message = validationHurdle.map((error: ValidationError) => Object.values(error.constraints)).join(', ');
    throw new Error(message);
  }
}
