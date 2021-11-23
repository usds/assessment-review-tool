import HttpException from '../../exceptions/HttpException';
import { ApplicationAssignments, ApplicationAssignmentsAttributes } from '../../models/application_assignments';
import { AssessmentHurdleUser } from '../../models/assessment_hurdle_user';
import ApplicationAssignmentService from '../../services/application_assignment.service';
import { ApplicantRecusals } from '../../models/applicant_recusals';

jest.mock('../../models/application_assignments');
jest.mock('../../models/applicant');
jest.mock('../../models/applicant_recusals');

beforeEach(() => {
  jest.resetAllMocks();
});

describe('nextQueue tests', () => {
  it('empty parameters throw 403', async () => {
    const svc = new ApplicationAssignmentService();

    await expect(svc.nextQueue('', '')).rejects.toThrowError(HttpException);
  });
  it('currentUser is not part of hurdle throws 403', async () => {
    const mockCount = jest.fn();
    mockCount.mockReturnValue(0);

    AssessmentHurdleUser.count = mockCount;

    const svc = new ApplicationAssignmentService();
    await expect(svc.nextQueue('02f84756-5a81-4512-a618-7d318fe12bd4', '4c0b8a4a-1810-4a62-9323-e95d52fe9c28')).rejects.toThrowError(HttpException);
  });
  it('existing active queue record returns existing', async () => {
    const mockCount = jest.fn();
    mockCount.mockReturnValue(1);

    AssessmentHurdleUser.count = mockCount;
    const mockRescusalsCount = jest.fn();
    mockRescusalsCount.mockReturnValue(0);
    ApplicantRecusals.count = mockRescusalsCount;

    const mockExisting = jest.fn();
    const existing: ApplicationAssignmentsAttributes = {
      id: '0e887e46-7202-40b9-8283-602bb7472d77',
      applicant_id: '126a71c9-3ea9-4682-b42c-7541df0955d8',
      assessment_hurdle_id: 'c8fadb4f-9f09-4d34-a8d2-ad2ed04f98a1',
      evaluator_id: 'aab062d1-1649-4fac-b5d7-1e33ca0d0605',
      active: true,
      updated_at: new Date(),
      created_at: new Date(),
    };
    mockExisting.mockReturnValue(existing);
    ApplicationAssignments.findOne = mockExisting;
    const svc = new ApplicationAssignmentService();
    const rst = await svc.nextQueue('c8fadb4f-9f09-4d34-a8d2-ad2ed04f98a1', 'aab062d1-1649-4fac-b5d7-1e33ca0d0605');
    expect(rst).not.toBeNull();
    expect(rst!.applicant_id).toEqual('0e887e46-7202-40b9-8283-602bb7472d77');
  });
  // it('empty queue returns null', async () => {
  //   const mockCount = jest.fn();
  //   mockCount.mockReturnValue(1);

  //   AssessmentHurdleUser.count = mockCount;

  //   const mockRescusalsCount = jest.fn();
  //   mockRescusalsCount.mockReturnValue(0);
  //   ApplicantRecusals.count = mockRescusalsCount;

  //   const mockExisting = jest.fn();
  //   mockExisting.mockReturnValue(undefined);
  //   ApplicationAssignments.findOne = mockExisting;

  //   const findAllMock = jest.fn();
  //   findAllMock.mockReturnValue([]);
  //   ApplicantStatusMetricsAgg.findAll = findAllMock;

  //   const findAllApplicantsMock = jest.fn();
  //   findAllApplicantsMock.mockReturnValue([]);
  //   Applicant.findAll = findAllApplicantsMock;

  //   const findallAssignmentsMock = jest.fn();
  //   findallAssignmentsMock.mockReturnValue([]);
  //   ApplicationAssignments.findAll = findallAssignmentsMock;

  //   const svc = new ApplicationAssignmentService();
  //   const rst = await svc.nextQueue('2e2549c8-5282-4d78-8fce-e64d8a17807f', '9521ab6d-969c-4cbe-9270-c4ec5182b09a');
  //   expect(rst).toBeNull();
  // });
  // it('works and returns valid assignment', async () => {
  //   const mockCount = jest.fn();
  //   mockCount.mockReturnValue(1);

  //   AssessmentHurdleUser.count = mockCount;

  //   const mockRescusalsCount = jest.fn();
  //   mockRescusalsCount.mockReturnValue(0);
  //   ApplicantRecusals.count = mockRescusalsCount;

  //   const mockExisting = jest.fn();
  //   mockExisting.mockReturnValue(undefined);
  //   ApplicationAssignments.findOne = mockExisting;

  //   const findAllMock = jest.fn();

  //   const assignment: ApplicantStatusMetricsAggAttributes = {
  //     applicant_id: 'c13c726e-bb4b-4c09-9c1f-86ada96c4b8a',
  //     amendment_count: 0,
  //     completed_count: 0,
  //     pending_evaluation_count: 1,
  //     review_count: 0,
  //   };
  //   findAllMock.mockReturnValue([assignment]);

  //   ApplicantStatusMetricsAgg.findAll = findAllMock;
  //   const findAllApplicantsMock = jest.fn();
  //   findAllApplicantsMock.mockReturnValue([]);
  //   Applicant.findAll = findAllApplicantsMock;

  //   const findallAssignmentsMock = jest.fn();
  //   findallAssignmentsMock.mockReturnValue([]);
  //   ApplicationAssignments.findAll = findallAssignmentsMock;

  //   const mockCreate = jest.fn();
  //   const created: ApplicationAssignmentsAttributes = {
  //     applicant_id: 'c13c726e-bb4b-4c09-9c1f-86ada96c4b8a',
  //     assessment_hurdle_id: 'd669f94a-7170-4cc0-b9c2-d05b328c603b',
  //     evaluator_id: 'a3538f22-71a8-44e8-b789-5ec330798ad2',
  //     id: '820be164-562f-4dfa-8ce0-fd68f787d80f',
  //     active: true,
  //     created_at: new Date(),
  //     updated_at: new Date(),
  //   };
  //   mockCreate.mockReturnValue(created);
  //   ApplicationAssignments.create = mockCreate;

  //   const svc = new ApplicationAssignmentService();
  //   const rst = await svc.nextQueue('d669f94a-7170-4cc0-b9c2-d05b328c603b', 'a3538f22-71a8-44e8-b789-5ec330798ad2');
  //   expect(rst).not.toBeNull();
  //   expect(rst!.applicant_id).toEqual('820be164-562f-4dfa-8ce0-fd68f787d80f');
  // });

  // it('Recused Evaluator+Applicant combo does not return assignement', async () => {
  //   const mockCount = jest.fn();
  //   mockCount.mockReturnValue(1);

  //   AssessmentHurdleUser.count = mockCount;

  //   const mockRescusalsCount = jest.fn();
  //   mockRescusalsCount.mockImplementation(obj => {
  //     return obj.where.applicant_id === 'c13c726e-bb4b-4c09-9c1f-86ada96c4b8a' ? 1 : 0;
  //   });
  //   ApplicantRecusals.count = mockRescusalsCount;

  //   const mockExisting = jest.fn();
  //   mockExisting.mockReturnValue(undefined);
  //   ApplicationAssignments.findOne = mockExisting;

  //   const findAllMock = jest.fn();

  //   const assignment: ApplicantStatusMetricsAggAttributes = {
  //     applicant_id: 'c13c726e-bb4b-4c09-9c1f-86ada96c4b8a',
  //     amendment_count: 0,
  //     completed_count: 0,
  //     pending_evaluation_count: 1,
  //     review_count: 0,
  //   };
  //   const assignment1: ApplicantStatusMetricsAggAttributes = {
  //     applicant_id: '800a37ae-9bab-4897-a4f5-7b3a412e96d6',
  //     amendment_count: 0,
  //     completed_count: 0,
  //     pending_evaluation_count: 1,
  //     review_count: 0,
  //   };
  //   findAllMock.mockReturnValue([assignment, assignment1]);

  //   ApplicantStatusMetricsAgg.findAll = findAllMock;

  //   const findAllFlaggedApplicantsMock = jest.fn();
  //   findAllFlaggedApplicantsMock.mockReturnValue([]);
  //   Applicant.findAll = findAllFlaggedApplicantsMock;

  //   const findallAssignmentsMock = jest.fn();
  //   findallAssignmentsMock.mockReturnValue(['c13c726e-bb4b-4c09-9c1f-86ada96c4b8a', '800a37ae-9bab-4897-a4f5-7b3a412e96d6']);
  //   ApplicationAssignments.findAll = findallAssignmentsMock;

  //   const mockCreate = jest.fn();
  //   mockCreate.mockImplementation(obj => {
  //     expect(obj.applicant_id).toEqual('800a37ae-9bab-4897-a4f5-7b3a412e96d6');
  //     const created: ApplicationAssignmentsAttributes = {
  //       applicant_id: obj.applicant_id,
  //       assessment_hurdle_id: 'd669f94a-7170-4cc0-b9c2-d05b328c603b',
  //       evaluator_id: 'a3538f22-71a8-44e8-b789-5ec330798ad2',
  //       id: '820be164-562f-4dfa-8ce0-fd68f787d80f',
  //       active: true,
  //       created_at: new Date(),
  //       updated_at: new Date(),
  //     };
  //     return created;
  //   });

  //   ApplicationAssignments.create = mockCreate;

  //   const svc = new ApplicationAssignmentService();
  //   const rst = await svc.nextQueue('d669f94a-7170-4cc0-b9c2-d05b328c603b', 'a3538f22-71a8-44e8-b789-5ec330798ad2');
  //   expect(rst).not.toBeNull();
  //   expect(rst!.applicant_id).toEqual('820be164-562f-4dfa-8ce0-fd68f787d80f');
  // });

  // it('Flagged applicant should not be returned', async () => {
  //   const mockCount = jest.fn();
  //   mockCount.mockReturnValue(1);

  //   AssessmentHurdleUser.count = mockCount;

  //   const mockRescusalsCount = jest.fn();
  //   mockRescusalsCount.mockReturnValue(0);
  //   ApplicantRecusals.count = mockRescusalsCount;

  //   const mockExisting = jest.fn();
  //   mockExisting.mockReturnValue(undefined);
  //   ApplicationAssignments.findOne = mockExisting;

  //   const findAllMock = jest.fn();

  //   const assignment: ApplicantStatusMetricsAggAttributes = {
  //     applicant_id: 'c13c726e-bb4b-4c09-9c1f-86ada96c4b8a',
  //     amendment_count: 0,
  //     completed_count: 0,
  //     pending_evaluation_count: 1,
  //     review_count: 0,
  //   };
  //   findAllMock.mockReturnValue([assignment]);

  //   ApplicantStatusMetricsAgg.findAll = findAllMock;

  //   const findAllApplicantsMock = jest.fn();
  //   const flaggedApplicant: ApplicantAttributes = {
  //     id: '040d2ee4-19f6-4730-9c72-e479af131178',
  //     flag_type: 1,
  //     flag_message: 'Flagged',
  //     assessment_hurdle_id: 'd669f94a-7170-4cc0-b9c2-d05b328c603b',
  //   };
  //   findAllApplicantsMock.mockReturnValue([flaggedApplicant]);
  //   Applicant.findAll = findAllApplicantsMock;

  //   const findallAssignmentsMock = jest.fn();
  //   findallAssignmentsMock.mockReturnValue([]);
  //   ApplicationAssignments.findAll = findallAssignmentsMock;

  //   const mockCreate = jest.fn();

  //   mockCreate.mockImplementation(obj => {
  //     expect(obj.applicant_id).toEqual('c13c726e-bb4b-4c09-9c1f-86ada96c4b8a');
  //     const created: ApplicationAssignmentsAttributes = {
  //       applicant_id: 'c13c726e-bb4b-4c09-9c1f-86ada96c4b8a',
  //       assessment_hurdle_id: 'd669f94a-7170-4cc0-b9c2-d05b328c603b',
  //       evaluator_id: 'a3538f22-71a8-44e8-b789-5ec330798ad2',
  //       id: '820be164-562f-4dfa-8ce0-fd68f787d80f',
  //       active: true,
  //       created_at: new Date(),
  //       updated_at: new Date(),
  //     };
  //     return created;
  //   });
  //   ApplicationAssignments.create = mockCreate;

  //   const svc = new ApplicationAssignmentService();
  //   const rst = await svc.nextQueue('d669f94a-7170-4cc0-b9c2-d05b328c603b', 'a3538f22-71a8-44e8-b789-5ec330798ad2');
  //   expect(rst).not.toBeNull();
  //   expect(rst!.applicant_id).toEqual('820be164-562f-4dfa-8ce0-fd68f787d80f');
  // });
});
