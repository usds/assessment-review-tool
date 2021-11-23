import CreateAssessmentHurdleDto from '../../dto/createassessmenthurdle.dto';
import HttpException from '../../exceptions/HttpException';
import { AssessmentHurdle } from '../../models/assessment_hurdle';
import { AssessmentHurdleMeta } from '../../models/assessment_hurdle_meta';
import AssessmentHurdleService from '../../services/assessmenthurdle.service';

jest.mock('../../models/assessment_hurdle');

beforeEach(() => {
  jest.resetAllMocks();
});

describe('getBy Tests', () => {
  it('getById returns value', async () => {
    const mockFindByPk = jest.fn();
    mockFindByPk.mockReturnValue({
      id: 'ff844ae0-22ad-47f0-af8f-8e1979cf0483',
      department_name: 'body.departmentName',
      component_name: 'body.componentName',
      position_name: 'body.positionName',
      position_details: 'body.positionDetails',
      locations: 'body.locations',
      start_datetime: new Date(),
      end_datetime: new Date(),
      hurdle_display_type: 1,
      evaluations_required: 1000,
      hr_name: 'body.hrName',
      hr_email: 'body.hrEmail',
    });
    AssessmentHurdle.findByPk = mockFindByPk;
  });
  it('getById returns 400 for empty Id', async () => {
    const svc = new AssessmentHurdleService();
    await expect(svc.getById('')).rejects.toThrowError(HttpException);
  });
  it('getById returns 404 for not found', async () => {
    const mockFindByPk = jest.fn();
    mockFindByPk.mockReturnValue(undefined);
    AssessmentHurdle.findByPk = mockFindByPk;
    const svc = new AssessmentHurdleService();
    await expect(svc.getById('a0490dd1-1933-4148-9d6e-1f3b551d6361')).rejects.toThrowError(HttpException);
  });
});

describe('upsert Tests', () => {
  it('upsert creates item and meta', async () => {
    const mockUpsert = jest.fn();
    mockUpsert.mockReturnValue([
      {
        id: 'ff844ae0-22ad-47f0-af8f-8e1979cf0483',
        department_name: 'body.departmentName',
        component_name: 'body.componentName',
        position_name: 'body.positionName',
        position_details: 'body.positionDetails',
        locations: 'body.locations',
        start_datetime: new Date(),
        end_datetime: new Date(),
        hurdle_display_type: 1,
        evaluations_required: 1000,
        hr_name: 'body.hrName',
        hr_email: 'body.hrEmail',
      },
      true,
    ]);
    AssessmentHurdle.upsert = mockUpsert;
    const mockMetaUpsert = jest.fn();
    mockMetaUpsert.mockReturnValue([
      {
        id: 'fa30e581-4140-4267-bc85-e71ee7bc36cc',
        staffing_assessment_id: 'body.assessmentId',
        staffing_vacancy_id: 'body.vacancyId',
        assessment_hurdle_id: 'ff844ae0-22ad-47f0-af8f-8e1979cf0483',
        staffing_fail_nor: 'body.failNor',
        staffing_pass_nor: 'body.passNor',
        created_at: new Date(),
        updated_at: new Date(),
      },
      true,
    ]);
    AssessmentHurdleMeta.findOrCreate = mockMetaUpsert;

    const mockUpdate = jest.fn();
    AssessmentHurdleMeta.update = mockUpdate;
    const svc = new AssessmentHurdleService();
    const body: CreateAssessmentHurdleDto = {
      existingId: undefined,
      assessmentId: 'assessmentId',
      evaluationsRequired: 2,
      componentName: 'compenentName',
      departmentName: 'deparmentName',
      endDatetime: new Date(),
      startDatetime: new Date(),
      failNor: 'FAIL',
      passNor: 'PASS',
      hrEmail: 'hr@email',
      hrName: 'hr name',
      hurdleDisplayType: 1,
      locations: 'D.C.',
      positionDetails: '',
      positionName: 'positionName',
      vacancyId: 'vacancyId',
      assessmentName: 'AmazingName1',
    };
    const rst = await svc.upsert(body);
    expect(mockUpsert).toBeCalledTimes(1);
    expect(mockMetaUpsert).toBeCalledTimes(1);
    expect(mockUpdate).toBeCalledTimes(0);
    expect(rst.id).toEqual('ff844ae0-22ad-47f0-af8f-8e1979cf0483');
  });
  it('upsert updates existing meta', async () => {
    const mockUpsert = jest.fn();
    mockUpsert.mockReturnValue([
      {
        id: 'ff844ae0-22ad-47f0-af8f-8e1979cf0483',
        department_name: 'body.departmentName',
        component_name: 'body.componentName',
        position_name: 'body.positionName',
        position_details: 'body.positionDetails',
        locations: 'body.locations',
        start_datetime: new Date(),
        end_datetime: new Date(),
        hurdle_display_type: 1,
        evaluations_required: 1000,
        hr_name: 'body.hrName',
        hr_email: 'body.hrEmail',
      },
      true,
    ]);
    AssessmentHurdle.upsert = mockUpsert;
    const mockUpdate = jest.fn();
    mockUpdate.mockReturnValue(true);

    const mockMetaUpsert = jest.fn();
    mockMetaUpsert.mockReturnValue([
      {
        id: 'fa30e581-4140-4267-bc85-e71ee7bc36cc',
        staffing_assessment_id: 'body.assessmentId',
        staffing_vacancy_id: 'body.vacancyId',
        assessment_hurdle_id: 'ff844ae0-22ad-47f0-af8f-8e1979cf0483',
        staffing_fail_nor: 'body.failNor',
        staffing_pass_nor: 'body.passNor',
        created_at: new Date(),
        updated_at: new Date(),
        update: mockUpdate,
      },
      false,
    ]);
    AssessmentHurdleMeta.findOrCreate = mockMetaUpsert;

    AssessmentHurdleMeta.update = mockUpdate;
    const svc = new AssessmentHurdleService();
    const body: CreateAssessmentHurdleDto = {
      existingId: undefined,
      assessmentId: 'assessmentId',
      evaluationsRequired: 2,
      componentName: 'compenentName',
      departmentName: 'deparmentName',
      endDatetime: new Date(),
      startDatetime: new Date(),
      failNor: 'FAIL',
      passNor: 'PASS',
      hrEmail: 'hr@email',
      hrName: 'hr name',
      hurdleDisplayType: 1,
      locations: 'D.C.',
      positionDetails: '',
      positionName: 'positionName',
      vacancyId: 'vacancyId',
      assessmentName: 'SomeGreatName',
    };
    const rst = await svc.upsert(body);
    expect(mockUpsert).toBeCalledTimes(1);
    expect(mockMetaUpsert).toBeCalledTimes(1);
    expect(mockUpdate).toBeCalledTimes(1);
    expect(rst.id).toEqual('ff844ae0-22ad-47f0-af8f-8e1979cf0483');
  });
});
