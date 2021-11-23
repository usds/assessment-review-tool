import HttpException from '../../exceptions/HttpException';
import { Applicant } from '../../models/applicant';
import { ApplicantMeta } from '../../models/applicant_meta';
import { Application } from '../../models/application';
import { ApplicationMeta } from '../../models/application_meta';
import ApplicantService from '../../services/applicant.service';
import { Specialty } from '../../models/specialty';
import BulkUSASApplicationsDto, { USASApplicationDto } from '../../dto/BulkApplicantApplications.dto';

jest.mock('../../models/applicant');
jest.mock('../../models/specialty');
beforeEach(() => {
  jest.resetAllMocks();
});

const ASSESSMENT_HURDLE_ID = '542e7535-3ab5-494d-ad08-b6b0bbc9abb9';
const INVALID_HURDLE_ID = '92aebbb5-94a1-4c7d-9b3c-c2fae5691122';
const STEVE_TESTER = {
  id: '0f0fb145-5e26-4732-b72d-73560645a544',
  name: 'Steve Tester',
  assessment_hurdle_id: ASSESSMENT_HURDLE_ID,
  created_at: new Date(),
  updated_at: new Date(),
};
const STEVE_TESTER_META = {
  id: '3482edff-5f9e-4839-b3a8-7c5f9de4ae18',
  staffing_first_name: 'Steve',
  staffing_last_name: 'Tester',
  staffing_application_number: '098765432',
  staffing_application_id: '34567890',
  applicant_id: '0f0fb145-5e26-4732-b72d-73560645a544',
};

const nullApplicant = {
  id: 'f4486698-7209-46e7-9069-73a3cf3debca',
};
describe('Applicant service bulk tests', () => {
  it('bulkUSASUpsert maps specialties by localID and upserts multiple applications', async () => {
    const svc = new ApplicantService();
    const mockGetSpecialtyByHurdleId = jest.fn();
    const hurdleId = '542e7535-3ab5-494d-ad08-b6b0bbc9abb9';
    const core_13Id = '000e7535-3ab5-494d-ad08-b6b0bbc9abb9';
    const core_14Id = '001e7535-3ab5-494d-ad08-b6b0bbc9abb9';
    const spec1_13Id = '100e7535-3ab5-494d-ad08-b6b0bbc9abb9';
    const spec1_14Id = '101e7535-3ab5-494d-ad08-b6b0bbc9abb9';
    const spec2_13Id = '200e7535-3ab5-494d-ad08-b6b0bbc9abb9';
    const spec2_14Id = '201e7535-3ab5-494d-ad08-b6b0bbc9abb9';

    mockGetSpecialtyByHurdleId.mockReturnValue([
      {
        id: core_13Id,
        name: 'core',
        local_id: '0000-13(Core)',
        assessment_hurdle_id: hurdleId,
        points_required: 4,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: core_14Id,
        name: 'core',
        local_id: '0000-14(Core)',
        assessment_hurdle_id: hurdleId,
        points_required: 40,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: spec1_13Id,
        name: 'Specialty one',
        local_id: '0000-13(Specialty 1)',
        assessment_hurdle_id: hurdleId,
        points_required: 5,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: spec1_14Id,
        name: 'Specialty one',
        local_id: '0000-14(Specialty 1)',
        assessment_hurdle_id: hurdleId,
        points_required: 50,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: spec2_13Id,
        name: 'Specialty two',
        local_id: '0000-13(Specialty 2)',
        assessment_hurdle_id: hurdleId,
        points_required: 5,
        created_at: new Date(),
        updated_at: new Date(),
      },
      ,
      {
        id: spec2_14Id,
        name: 'Specialty two',
        local_id: '0000-14(Specialty 2)',
        assessment_hurdle_id: hurdleId,
        points_required: 50,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
    const mockUpsertApplicant = jest.fn();
    mockUpsertApplicant.mockImplementation(e => [{ ...e, id: 'app_id' }]);
    const mockFindOrCreateApplicantMeta = jest.fn();
    mockFindOrCreateApplicantMeta.mockImplementation(e => [e, e]);
    const mockUpsertApplication = jest.fn();
    let core13Count = 0;
    let core14Count = 0;
    let spec1_13Count = 0;
    let spec1_14Count = 0;
    let spec2_13Count = 0;
    let spec2_14Count = 0;
    mockUpsertApplication.mockImplementation(e => {
      expect(e.applicant_id).toBeTruthy();
      switch (e.specialty_id) {
        case core_13Id:
          core13Count++;
          break;
        case core_14Id:
          core14Count++;
          break;
        case spec1_13Id:
          spec1_13Count++;
          break;
        case spec1_14Id:
          spec1_14Count++;
          break;
        case spec2_13Id:
          spec2_13Count++;
          break;
        case spec2_14Id:
          spec2_14Count++;
          break;
        default:
          throw new Error('No specialty Id');
      }
      return [e];
    });
    const mockFindOrCreateApplicationMeta = jest.fn();
    mockFindOrCreateApplicationMeta.mockImplementation(e => [e, e]);
    Specialty.findAll = mockGetSpecialtyByHurdleId;

    Applicant.upsert = mockUpsertApplicant;
    ApplicantMeta.findOrCreate = mockFindOrCreateApplicantMeta;
    Application.upsert = mockUpsertApplication;
    ApplicationMeta.findOrCreate = mockFindOrCreateApplicationMeta;

    const body = new BulkUSASApplicationsDto();
    const applicantOne = {
      firstName: 'Applicant 1 First Name',
      lastName: 'Applicant 1 Last Name',
      middleName: 'Applicant 1 Middle Name',
      applicationId: '1111',
      applicationNumber: 'AAAA',
    };
    const applicantTwo = {
      firstName: 'Applicant 2 First Name',
      lastName: 'Applicant 2 Last Name',
      middleName: 'Applicant 2 Middle Name',
      applicationId: '2222',
      applicationNumber: 'BBBB',
    };
    const applicantThree = {
      firstName: 'Applicant 3 First Name',
      lastName: 'Applicant 3 Last Name',
      middleName: 'Applicant 3 Middle Name',
      applicationId: '3333',
      applicationNumber: 'CCCC',
    };
    const assessmentId = '0000';

    // application.staffingRatingCombination = row['Rating Combination'];
    // application.staffingRatingId = row['Application Rating ID'];
    body.applications = [
      { ...applicantOne, staffingRatingCombination: '0000-13(Core)', staffingRatingId: '1-1' },
      { ...applicantOne, staffingRatingCombination: '0000-14(Core)', staffingRatingId: '1-2' },
      { ...applicantOne, staffingRatingCombination: '0000-13(Specialty 1)', staffingRatingId: '1-3' },
      { ...applicantOne, staffingRatingCombination: '0000-14(Specialty 1)', staffingRatingId: '1-4' },
      { ...applicantOne, staffingRatingCombination: '0000-13(Specialty 2)', staffingRatingId: '1-5' },
      { ...applicantOne, staffingRatingCombination: '0000-14(Specialty 2)', staffingRatingId: '1-6' },
      { ...applicantTwo, staffingRatingCombination: '0000-13(Core)', staffingRatingId: '1-7' },
      { ...applicantTwo, staffingRatingCombination: '0000-14(Core)', staffingRatingId: '1-8' },
      { ...applicantTwo, staffingRatingCombination: '0000-13(Specialty 1)', staffingRatingId: '1-9' },
      { ...applicantTwo, staffingRatingCombination: '0000-14(Specialty 1)', staffingRatingId: '1-10' },
      { ...applicantTwo, staffingRatingCombination: '0000-13(Specialty 2)', staffingRatingId: '1-11' },
      { ...applicantTwo, staffingRatingCombination: '0000-14(Specialty 2)', staffingRatingId: '1-12' },
      { ...applicantThree, staffingRatingCombination: '0000-13(Core)', staffingRatingId: '1-13' },

      { ...applicantThree, staffingRatingCombination: '0000-13(Specialty 1)', staffingRatingId: '1-14' },

      { ...applicantThree, staffingRatingCombination: '0000-13(Specialty 2)', staffingRatingId: '1-15' },
    ].map(a => {
      const application = new USASApplicationDto();
      application.firstName = a.firstName;
      application.lastName = a.lastName;
      application.middleName = a.middleName;
      application.staffingApplicationId = a.applicationId;
      application.staffingApplicationNumber = a.applicationNumber;
      application.staffingRatingId = a.staffingRatingId;
      application.staffingAssessmentId = assessmentId;
      application.staffingRatingCombination = a.staffingRatingCombination;
      return application;
    });

    const applicants = await svc.bulkUSASUpsert(body, hurdleId);
    const totalApplicantCount = 3;
    const totalApplicationsCount = 15;

    expect(applicants.length).toBe(totalApplicantCount);
    const applicantNames = applicants.map(a => a.name);
    expect(applicantNames).toContain(`${applicantOne.firstName} ${applicantOne.middleName} ${applicantOne.lastName}`);
    expect(applicantNames).toContain(`${applicantTwo.firstName} ${applicantTwo.middleName} ${applicantTwo.lastName}`);
    expect(applicantNames).toContain(`${applicantThree.firstName} ${applicantThree.middleName} ${applicantThree.lastName}`);
    // Validate that specialty matching works as expected
    expect(core13Count).toBe(body.applications.filter(e => e.staffingRatingCombination === '0000-13(Core)').length);
    expect(core14Count).toBe(body.applications.filter(e => e.staffingRatingCombination === '0000-14(Core)').length);
    expect(spec1_13Count).toBe(body.applications.filter(e => e.staffingRatingCombination === '0000-13(Specialty 1)').length);
    expect(spec1_14Count).toBe(body.applications.filter(e => e.staffingRatingCombination === '0000-14(Specialty 1)').length);
    expect(spec2_13Count).toBe(body.applications.filter(e => e.staffingRatingCombination === '0000-13(Specialty 2)').length);
    expect(spec2_14Count).toBe(body.applications.filter(e => e.staffingRatingCombination === '0000-14(Specialty 2)').length);
    // Valdidate correct calls for upserts are made
    expect(mockUpsertApplicant).toBeCalledTimes(totalApplicantCount);
    expect(mockFindOrCreateApplicantMeta).toBeCalledTimes(totalApplicantCount);
    expect(mockUpsertApplication).toBeCalledTimes(totalApplicationsCount);
    expect(mockFindOrCreateApplicationMeta).toBeCalledTimes(totalApplicationsCount);
  });

  it('bulkUSASUpsert fails if the applications cannot match specialties', async () => {
    const svc = new ApplicantService();
    const mockGetSpecialtyByHurdleId = jest.fn();
    const hurdleId = '542e7535-3ab5-494d-ad08-b6b0bbc9abb9';
    const core_13Id = '000e7535-3ab5-494d-ad08-b6b0bbc9abb9';
    const core_14Id = '001e7535-3ab5-494d-ad08-b6b0bbc9abb9';
    const spec1_13Id = '100e7535-3ab5-494d-ad08-b6b0bbc9abb9';
    const spec1_14Id = '101e7535-3ab5-494d-ad08-b6b0bbc9abb9';
    const spec2_13Id = '200e7535-3ab5-494d-ad08-b6b0bbc9abb9';
    const spec2_14Id = '201e7535-3ab5-494d-ad08-b6b0bbc9abb9';

    mockGetSpecialtyByHurdleId.mockReturnValue([
      {
        id: core_13Id,
        name: 'core',
        local_id: '0000-13(Core)',
        assessment_hurdle_id: hurdleId,
        points_required: 4,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: core_14Id,
        name: 'core',
        local_id: '0000-14(Core)',
        assessment_hurdle_id: hurdleId,
        points_required: 40,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: spec1_13Id,
        name: 'Specialty one',
        local_id: '0000-13(Specialty 1)',
        assessment_hurdle_id: hurdleId,
        points_required: 5,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: spec1_14Id,
        name: 'Specialty one',
        local_id: '0000-14(Specialty 1)',
        assessment_hurdle_id: hurdleId,
        points_required: 50,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: spec2_13Id,
        name: 'Specialty two',
        local_id: '0000-13(Specialty 2)',
        assessment_hurdle_id: hurdleId,
        points_required: 5,
        created_at: new Date(),
        updated_at: new Date(),
      },
      ,
      {
        id: spec2_14Id,
        name: 'Specialty two',
        local_id: '0000-14(Specialty 2)',
        assessment_hurdle_id: hurdleId,
        points_required: 50,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
    const mockUpsertApplicant = jest.fn();
    mockUpsertApplicant.mockImplementation(e => [{ ...e, id: 'app_id' }]);
    const mockFindOrCreateApplicantMeta = jest.fn();
    mockFindOrCreateApplicantMeta.mockImplementation(e => [e, e]);
    const mockUpsertApplication = jest.fn();
    mockUpsertApplication.mockImplementation(e => {
      return [e];
    });
    const mockFindOrCreateApplicationMeta = jest.fn();
    mockFindOrCreateApplicationMeta.mockImplementation(e => [e, e]);
    Specialty.findAll = mockGetSpecialtyByHurdleId;

    Applicant.upsert = mockUpsertApplicant;
    ApplicantMeta.findOrCreate = mockFindOrCreateApplicantMeta;
    Application.upsert = mockUpsertApplication;
    ApplicationMeta.findOrCreate = mockFindOrCreateApplicationMeta;

    const body = new BulkUSASApplicationsDto();
    const applicantOne = {
      firstName: 'Applicant 1 First Name',
      lastName: 'Applicant 1 Last Name',
      middleName: 'Applicant 1 Middle Name',
      applicationId: '1111',
      applicationNumber: 'AAAA',
    };
    const applicantTwo = {
      firstName: 'Applicant 2 First Name',
      lastName: 'Applicant 2 Last Name',
      middleName: 'Applicant 2 Middle Name',
      applicationId: '2222',
      applicationNumber: 'BBBB',
    };
    const applicantThree = {
      firstName: 'Applicant 3 First Name',
      lastName: 'Applicant 3 Last Name',
      middleName: 'Applicant 3 Middle Name',
      applicationId: '3333',
      applicationNumber: 'CCCC',
    };
    const assessmentId = '0000';

    // application.staffingRatingCombination = row['Rating Combination'];
    // application.staffingRatingId = row['Application Rating ID'];
    body.applications = [
      { ...applicantOne, staffingRatingCombination: '0000-13(Core)', staffingRatingId: '1-1' },
      { ...applicantOne, staffingRatingCombination: '0000-14(Core)', staffingRatingId: '1-2' },
      { ...applicantOne, staffingRatingCombination: '0000-13(Specialty 1)', staffingRatingId: '1-3' },
      { ...applicantOne, staffingRatingCombination: '0000-14(Specialty 1)', staffingRatingId: '1-4' },
      { ...applicantOne, staffingRatingCombination: '0000-13(Specialty 2)', staffingRatingId: '1-5' },
      { ...applicantOne, staffingRatingCombination: '0000-14(Specialty 2)', staffingRatingId: '1-6' },
      { ...applicantTwo, staffingRatingCombination: 'mismatched ratingCombination', staffingRatingId: '1-7' },
      { ...applicantTwo, staffingRatingCombination: '0000-14(Core)', staffingRatingId: '1-8' },
      { ...applicantTwo, staffingRatingCombination: '0000-13(Specialty 1)', staffingRatingId: '1-9' },
      { ...applicantTwo, staffingRatingCombination: '0000-14(Specialty 1)', staffingRatingId: '1-10' },
      { ...applicantTwo, staffingRatingCombination: '0000-13(Specialty 2)', staffingRatingId: '1-11' },
      { ...applicantTwo, staffingRatingCombination: '0000-14(Specialty 2)', staffingRatingId: '1-12' },
      { ...applicantThree, staffingRatingCombination: '0000-13(Core)', staffingRatingId: '1-13' },

      { ...applicantThree, staffingRatingCombination: '0000-13(Specialty 1)', staffingRatingId: '1-14' },

      { ...applicantThree, staffingRatingCombination: '0000-13(Specialty 2)', staffingRatingId: '1-15' },
    ].map(a => {
      const application = new USASApplicationDto();
      application.firstName = a.firstName;
      application.lastName = a.lastName;
      application.middleName = a.middleName;
      application.staffingApplicationId = a.applicationId;
      application.staffingApplicationNumber = a.applicationNumber;
      application.staffingRatingId = a.staffingRatingId;
      application.staffingAssessmentId = assessmentId;
      application.staffingRatingCombination = a.staffingRatingCombination;
      return application;
    });
    await expect(svc.bulkUSASUpsert(body, hurdleId)).rejects.toThrowError(HttpException);
    expect(mockUpsertApplicant).toBeCalledTimes(0);
    expect(mockFindOrCreateApplicantMeta).toBeCalledTimes(0);
    expect(mockUpsertApplication).toBeCalledTimes(0);
    expect(mockFindOrCreateApplicationMeta).toBeCalledTimes(0);
  });
});
