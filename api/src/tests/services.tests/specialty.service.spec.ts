import CreateSpecialtyDto from '../../dto/createspecialty.dto';
import HttpException from '../../exceptions/HttpException';
import { Competency } from '../../models/competency';
import { Specialty } from '../../models/specialty';
import { SpecialtyCompetencies } from '../../models/specialty_competencies';
import SpecialtyService from '../../services/specialty.service';

jest.mock('../../models/specialty');
jest.mock('../../models/competency');
jest.mock('../../models/specialty_competencies');

beforeEach(() => {
  jest.resetAllMocks();
});

describe('getBy tests', () => {
  it('getById return values', async () => {
    const mockFindByPk = jest.fn();
    mockFindByPk.mockReturnValue({
      id: 'd5acadd1-015a-46a9-b147-71ad84af8d87',
      local_id: 'local',
      name: 'Name',
      assessment_hurdle_id: 'a321bdde-2494-4778-8b00-1429482ce0db',
      points_required: 1404,
      created_at: new Date(),
      updated_at: new Date(),
    });

    Specialty.findByPk = mockFindByPk;

    const svc = new SpecialtyService();
    const rst = await svc.getById('d5acadd1-015a-46a9-b147-71ad84af8d87');
    expect(mockFindByPk).toBeCalledTimes(1);
    expect(rst.id).toEqual('d5acadd1-015a-46a9-b147-71ad84af8d87');
  });

  it('getById returns 400 for empty input', async () => {
    const svc = new SpecialtyService();
    await expect(svc.getById('')).rejects.toThrowError(HttpException);
  });
  it('getById returns 404 for not found value', async () => {
    const mockFindByPk = jest.fn();
    mockFindByPk.mockReturnValue(undefined);
    Specialty.findByPk = mockFindByPk;
    const svc = new SpecialtyService();
    await expect(svc.getById('d5acadd1-015a-46a9-b147-71ad84af8d87')).rejects.toThrowError(HttpException);
  });
  it('getAllMappingsById returns value', async () => {
    const mockFindAll = jest.fn();
    mockFindAll.mockReturnValue([
      {
        id: 'c271341e-1c2e-4395-a43e-7de7990a0e53',
        specialty_id: '12157d0e-1e8f-4023-b4d6-87152620f747',
        competency_id: 'b9b8decb-9326-401c-9696-ab2e7205022f',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
    SpecialtyCompetencies.findAll = mockFindAll;

    const mockCount = jest.fn();
    mockCount.mockReturnValue(1);

    Specialty.count = mockCount;

    const svc = new SpecialtyService();
    const rst = await svc.getAllMappingsById('12157d0e-1e8f-4023-b4d6-87152620f747', 'a321bdde-2494-4778-8b00-1429482ce0db');
    expect(mockFindAll).toBeCalledTimes(1);
    expect(mockCount).toBeCalledTimes(1);
    expect(rst.length).toEqual(1);
  });
  it('getAllMappingsById returns 400 for empty input', async () => {
    const svc = new SpecialtyService();
    await expect(svc.getAllMappingsById('', '699b6b20-9ad7-4f43-b383-fe355e4459a5')).rejects.toThrowError(HttpException);
  });
  it('getAllMappingsById returns 400 for bad specialtyId', async () => {
    const mockCount = jest.fn();
    mockCount.mockReturnValue(0);

    Specialty.count = mockCount;
    const svc = new SpecialtyService();
    await expect(svc.getAllMappingsById('0a14c115-092f-4dee-81f8-8c6c19c508b7', '699b6b20-9ad7-4f43-b383-fe355e4459a5')).rejects.toThrowError(
      HttpException,
    );
  });
});

describe('upsert Tests', () => {
  it('upsert creates items and mapping', async () => {
    const mockedSpecialtyId = '17a7ff65-276b-4f3f-b83c-755a7d7c4c7f';
    const mockedHurdleId = '162ad702-cb0b-4cd5-93c6-a75bb61d9df0';
    const mockedCompetencyId = '9ca97f0b-ea04-4c57-a3eb-dca828773b8c';
    const mockUpsert = jest.fn();
    mockUpsert.mockReturnValue([
      {
        id: mockedSpecialtyId,
        local_id: 'local',
        name: 'Name',
        assessment_hurdle_id: mockedHurdleId,
        points_required: 239394,
      },
      true,
    ]);
    Specialty.upsert = mockUpsert;

    const mockFindOrCreate = jest.fn();

    mockFindOrCreate.mockReturnValue([
      {
        id: '7550b8e2-73a6-462e-9896-7bed49e35674',
        specialty_id: mockedSpecialtyId,
        competency_id: mockedCompetencyId,
        created_at: new Date(),
        updated_at: new Date(),
      },
      true,
    ]);
    SpecialtyCompetencies.findOrCreate = mockFindOrCreate;
    const findAllCompetenciesMock = jest.fn();
    findAllCompetenciesMock.mockReturnValue([{ local_id: 'comp1', id: mockedCompetencyId }]);
    Competency.findAll = findAllCompetenciesMock;

    const svc = new SpecialtyService();
    const body: CreateSpecialtyDto = {
      localId: 'localId',
      existingId: undefined,
      assessmentHurdleId: mockedHurdleId,
      name: 'Name',
      pointsRequired: 15,
      competencyLocalIds: ['comp1'],
    };
    jest.spyOn(SpecialtyCompetencies, 'findOrCreate');

    const rst = await svc.upsert(body);
    expect(mockUpsert).toBeCalledTimes(1);
    expect(mockFindOrCreate).toBeCalledTimes(1);
    expect(mockFindOrCreate).toHaveBeenCalledWith({
      where: { specialty_id: mockedSpecialtyId, competency_id: mockedCompetencyId },
      defaults: {
        competency_id: mockedCompetencyId,
        specialty_id: mockedSpecialtyId,
      },
    });
    expect(rst.id).toEqual(mockedSpecialtyId);
  });

  it('upsert does not create mapping with empty competency ids', async () => {
    const mockedSpecialtyId = '17a7ff65-276b-4f3f-b83c-755a7d7c4c7f';
    const mockedHurdleId = '162ad702-cb0b-4cd5-93c6-a75bb61d9df0';
    const mockedCompetencyId = '9ca97f0b-ea04-4c57-a3eb-dca828773b8c';
    const mockUpsert = jest.fn();
    mockUpsert.mockReturnValue([
      {
        id: mockedSpecialtyId,
        local_id: 'local',
        name: 'Name',
        assessment_hurdle_id: mockedHurdleId,
        points_required: 239394,
      },
      true,
    ]);
    Specialty.upsert = mockUpsert;

    const mockFindOrCreate = jest.fn();

    SpecialtyCompetencies.findOrCreate = mockFindOrCreate;
    const svc = new SpecialtyService();
    const body: CreateSpecialtyDto = {
      localId: 'localId',
      existingId: undefined,
      assessmentHurdleId: mockedHurdleId,
      name: 'Name',
      pointsRequired: 15,
      competencyLocalIds: [],
    };
    const findAllCompetenciesMock = jest.fn();
    findAllCompetenciesMock.mockReturnValue([{ local_id: 'comp1', id: mockedCompetencyId }]);
    Competency.findAll = findAllCompetenciesMock;
    const rst = await svc.upsert(body);
    expect(mockUpsert).toBeCalledTimes(1);
    expect(mockFindOrCreate).toBeCalledTimes(0);
    expect(rst.id).toEqual(mockedSpecialtyId);
  });
});
