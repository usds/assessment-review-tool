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
describe('Applicant service getBy Tests', () => {
  it('getById returns value', async () => {
    const mockFindByPk = jest.fn();
    mockFindByPk.mockReturnValue(STEVE_TESTER);
    Applicant.findByPk = mockFindByPk;
    const svc = new ApplicantService();
    const rst = await svc.getById(STEVE_TESTER.id);
    expect(mockFindByPk).toBeCalledTimes(1);
    expect(rst.assessment_hurdle_id).toEqual(STEVE_TESTER.assessment_hurdle_id);
  });

  it('getById returns 400 for empty input', async () => {
    const svc = new ApplicantService();
    await expect(svc.getById('')).rejects.toThrowError(HttpException);
  });
  it('getById returns 404 for not found value', async () => {
    const mockFindByPk = jest.fn();
    mockFindByPk.mockReturnValue(undefined);
    Applicant.findByPk = mockFindByPk;
    const svc = new ApplicantService();

    await expect(svc.getById(nullApplicant.id)).rejects.toThrowError(HttpException);
    expect(mockFindByPk).toBeCalledTimes(1);
  });

  it('getByIdWithMeta returns values', async () => {
    const mockMetaResolution = jest.fn();
    mockMetaResolution.mockReturnValue(STEVE_TESTER_META);

    const mockFindByPk = jest.fn();
    mockFindByPk.mockReturnValue({ ...STEVE_TESTER, getApplicantMetum: mockMetaResolution });

    Applicant.findByPk = mockFindByPk;
    const svc = new ApplicantService();

    const [rst, rstMeta] = await svc.getByIdWithMeta(STEVE_TESTER.id, STEVE_TESTER.assessment_hurdle_id);
    expect(mockFindByPk).toBeCalledTimes(1);
    expect(mockMetaResolution).toBeCalledTimes(1);
    expect(rst.id).toEqual(STEVE_TESTER.id);
    expect(rstMeta.id).toEqual(STEVE_TESTER_META.id);
  });

  it('getByIdWithMeta returns 400 for empty input', async () => {
    const svc = new ApplicantService();
    await expect(svc.getByIdWithMeta('', ASSESSMENT_HURDLE_ID)).rejects.toThrowError(HttpException);
  });

  it('getByIdWithMeta returns 404 for not found', async () => {
    const mockFindByPk = jest.fn();
    mockFindByPk.mockReturnValue(undefined);
    Applicant.findByPk = mockFindByPk;
    const svc = new ApplicantService();
    await expect(svc.getByIdWithMeta(nullApplicant.id, ASSESSMENT_HURDLE_ID)).rejects.toThrowError(HttpException);
  });
  it('getByIdWithMeta returns 403 mismatch on hurdleId', async () => {
    const mockMetaResolution = jest.fn();
    mockMetaResolution.mockReturnValue(STEVE_TESTER_META);

    const mockFindByPk = jest.fn();
    mockFindByPk.mockReturnValue({ ...STEVE_TESTER, getApplicantMetum: mockMetaResolution });

    Applicant.findByPk = mockFindByPk;
    const svc = new ApplicantService();
    await expect(svc.getByIdWithMeta(STEVE_TESTER.id, INVALID_HURDLE_ID)).rejects.toThrowError(HttpException);
  });
});
