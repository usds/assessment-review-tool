import HttpException from '../../exceptions/HttpException';
import { Application } from '../../models/application';
import ApplicationService from '../../services/application.service';

jest.mock('../../models/application');

beforeEach(() => {
  jest.resetAllMocks();
});

describe('getBy Tests', () => {
  it('getById returns value', async () => {
    const mockFindByPk = jest.fn();
    mockFindByPk.mockReturnValue({
      id: 'f3a04475-bcb2-4c8b-96cd-d7fddbfe1adb',
      applicant_id: '6afa6a30-2a34-404a-b2ec-a42a0b3e3110',
      specialty_id: '4f2154f8-1221-484d-bd3c-8edddf999e33',
      updated_at: new Date(),
      created_at: new Date(),
    });
    Application.findByPk = mockFindByPk;
    const svc = new ApplicationService();
    const rst = await svc.getById('f3a04475-bcb2-4c8b-96cd-d7fddbfe1adb');
    expect(mockFindByPk).toBeCalledTimes(1);
    expect(rst.id).toEqual('f3a04475-bcb2-4c8b-96cd-d7fddbfe1adb');
  });
  it('getById returns 400 for empty input', async () => {
    const svc = new ApplicationService();
    await expect(svc.getById('')).rejects.toThrowError(HttpException);
  });
  it('getById returns 404 for not found value', async () => {
    const mockFindByPk = jest.fn();
    mockFindByPk.mockReturnValue(undefined);
    Application.findByPk = mockFindByPk;
    const svc = new ApplicationService();
    await expect(svc.getById('f3a04475-bcb2-4c8b-96cd-d7fddbfe1adb')).rejects.toThrowError(HttpException);
    expect(mockFindByPk).toBeCalledTimes(1);
  });
  it('getByIdWithMeta returns value', async () => {
    const mockMetaResolution = jest.fn();
    mockMetaResolution.mockReturnValue({
      id: '0d3098b8-9d39-491c-93c2-389fc0de39cb',
      application_id: '2c1332c1-8b8e-40b4-b135-3583a37f9e69',
      staffing_application_rating_id: 'string',
      staffing_assessment_id: 'string',
      staffing_rating_combination: 'string',
      created_at: new Date(),
      updated_at: new Date(),
    });

    const mockFindByPk = jest.fn();
    mockFindByPk.mockReturnValue({
      id: '2c1332c1-8b8e-40b4-b135-3583a37f9e69',
      applicant_id: '6afa6a30-2a34-404a-b2ec-a42a0b3e3110',
      specialty_id: '4f2154f8-1221-484d-bd3c-8edddf999e33',
      updated_at: new Date(),
      created_at: new Date(),
      getApplicationMetum: mockMetaResolution,
    });

    Application.findByPk = mockFindByPk;
    const svc = new ApplicationService();
    const [rst, rstMeta] = await svc.getByIdWithMeta('6afa6a30-2a34-404a-b2ec-a42a0b3e3110');
    expect(mockFindByPk).toBeCalledTimes(1);
    expect(mockMetaResolution).toBeCalledTimes(1);
    expect(rst.id).toEqual('2c1332c1-8b8e-40b4-b135-3583a37f9e69');
    expect(rstMeta.id).toEqual('0d3098b8-9d39-491c-93c2-389fc0de39cb');
  });
  it('getByIdWithMeta returns 400 for empty input', async () => {
    const svc = new ApplicationService();
    await expect(svc.getByIdWithMeta('')).rejects.toThrowError(HttpException);
  });
  it('getByIdWithMeta returns 404 for not found', async () => {
    const mockFindByPk = jest.fn();
    mockFindByPk.mockReturnValue(undefined);
    Application.findByPk = mockFindByPk;
  });
});
