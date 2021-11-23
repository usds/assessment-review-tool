import HttpException from '../../exceptions/HttpException';
import { Competency } from '../../models/competency';
import CompetencyService from '../../services/competency.service';
import { SpecialtyCompetencies } from '../../models/specialty_competencies';
import { CompetencySelectors } from '../../models/competency_selectors';
import CreateCompetencyDto from '../../dto/createcompetency.dto';

jest.mock('../../models/competency');
jest.mock('../../models/specialty_competencies');
jest.mock('../../models/competency_selectors');

beforeEach(() => {
  jest.resetAllMocks();
});

describe('getBy Tests', () => {
  it('getById returns value', async () => {
    const mockFindByPk = jest.fn();
    mockFindByPk.mockReturnValue({
      id: 'cea8afa4-869c-49a6-b0ce-3bf52d21ea86',
      name: 'string',
      definition: 'string',
      required_proficiency_definition: 'string',
      display_type: 0,
      screen_out: false,
      created_at: new Date(),
      updated_at: new Date(),
    });
    Competency.findByPk = mockFindByPk;
    const svc = new CompetencyService();
    const rst = await svc.getById('cea8afa4-869c-49a6-b0ce-3bf52d21ea86');
    expect(mockFindByPk).toBeCalledTimes(1);
    expect(rst.id).toEqual('cea8afa4-869c-49a6-b0ce-3bf52d21ea86');
  });
  it('getById returns 400 for empty value', async () => {
    const svc = new CompetencyService();
    await expect(svc.getById('')).rejects.toThrowError(HttpException);
  });
  it('getById returns 404 for not found value', async () => {
    const mockFindByPk = jest.fn();
    mockFindByPk.mockReturnValue(undefined);
    Competency.findByPk = mockFindByPk;
    const svc = new CompetencyService();
    await expect(svc.getById('')).rejects.toThrowError(HttpException);
  });
});

describe('mapping to Specialty Tests', () => {
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
    const svc = new CompetencyService();
    const rst = await svc.getAllMappingsById('b9b8decb-9326-401c-9696-ab2e7205022f');
    expect(mockFindAll).toBeCalledTimes(1);
    expect(rst.length).toEqual(1);
  });
  it('getAllMappingsById returns 400 for empty Value', async () => {
    const svc = new CompetencyService();
    await expect(svc.getAllMappingsById('')).rejects.toThrowError(HttpException);
  });
  it('getallMappingsById returns 404 for not found', async () => {
    const mockFindAll: jest.Mock<SpecialtyCompetencies[] | undefined> = jest.fn();
    mockFindAll.mockReturnValue(undefined);
    const svc = new CompetencyService();
    await expect(svc.getAllMappingsById('b9b8decb-9326-401c-9696-ab2e7205022f')).rejects.toThrowError(HttpException);
  });
  it('upsert creates Record and mappings', async () => {
    const assessmentHurdleId = 'b06834f1-e9a0-48d4-81a8-a65967e487f7';
    const mockUpsert = jest.fn();
    mockUpsert.mockReturnValue([
      {
        id: '026dca8d-6246-4ba4-ac4a-6bec5116a5be',
        definition: 'Something',
        name: 'Competency',
        required_proficiency_definition: 'yep',
        display_type: 1,
        screen_out: false,
      },
      true,
    ]);

    Competency.upsert = mockUpsert;

    const mockUpsertSelectors = jest.fn();
    mockUpsertSelectors.mockReturnValue({
      id: 'dc5a6c49-7657-4330-b3bc-334672df75c8',
      competency_id: '026dca8d-6246-4ba4-ac4a-6bec5116a5be',
      display_name: 'Meets Selector',
      point_value: 1000,
      default_text: 'Yep',
      sort_order: 1,
      created_at: new Date(),
      updated_at: new Date(),
    });

    CompetencySelectors.create = mockUpsertSelectors;

    const svc = new CompetencyService();
    const body: CreateCompetencyDto = {
      existingId: undefined,
      name: 'yep',
      localId: 'localId',
      definition: 'definition',
      displayType: 1,
      requiredProficiencyDefinition: 'rpd',
      screenOut: false,
      assessmentHurdleId,
      selectors: [
        {
          defaultText: 'defaultText',
          displayName: 'displayName',
          pointValue: 1000,
          sortOrder: 1,
          existingId: undefined,
          competencyId: '',
        },
      ],
    };
    const rst = await svc.upsert(body, assessmentHurdleId);
    expect(mockUpsert).toBeCalledTimes(1);
    expect(mockUpsertSelectors).toBeCalledTimes(1);
    expect(rst.id).toEqual('026dca8d-6246-4ba4-ac4a-6bec5116a5be');
  });
  it('upsert does not create mapping without specialtyId', async () => {
    const mockUpsert = jest.fn();
    mockUpsert.mockReturnValue([
      {
        id: '026dca8d-6246-4ba4-ac4a-6bec5116a5be',
        definition: 'Something',
        name: 'Competency',
        required_proficiency_definition: 'yep',
        display_type: 1,
        screen_out: false,
      },
      true,
    ]);

    Competency.upsert = mockUpsert;

    const mockUpsertSelectors = jest.fn();
    mockUpsertSelectors.mockReturnValue({
      id: 'dc5a6c49-7657-4330-b3bc-334672df75c8',
      competency_id: '026dca8d-6246-4ba4-ac4a-6bec5116a5be',
      display_name: 'Meets Selector',
      point_value: 1000,
      default_text: 'Yep',
      sort_order: 1,
      created_at: new Date(),
      updated_at: new Date(),
    });

    CompetencySelectors.create = mockUpsertSelectors;
    const svc = new CompetencyService();
    const assessmentHurdleId = 'b06834f1-e9a0-48d4-81a8-a65967e487f7';
    const body: CreateCompetencyDto = {
      existingId: undefined,
      localId: 'localId',
      name: 'yep',
      definition: 'definition',
      assessmentHurdleId,
      displayType: 1,
      requiredProficiencyDefinition: 'rpd',
      screenOut: false,
      selectors: [
        {
          defaultText: 'defaultText',
          displayName: 'displayName',
          pointValue: 1000,
          sortOrder: 1,
          existingId: undefined,
          competencyId: '',
        },
      ],
    };
    const rst = await svc.upsert(body, assessmentHurdleId);
    expect(mockUpsert).toBeCalledTimes(1);
    expect(mockUpsertSelectors).toBeCalledTimes(1);
    expect(rst.id).toEqual('026dca8d-6246-4ba4-ac4a-6bec5116a5be');
  });
  it('upsert does not create selectors without selectors', async () => {
    const mockUpsert = jest.fn();
    mockUpsert.mockReturnValue([
      {
        id: '026dca8d-6246-4ba4-ac4a-6bec5116a5be',
        definition: 'Something',
        name: 'Competency',
        required_proficiency_definition: 'yep',
        display_type: 1,
        screen_out: false,
      },
      true,
    ]);

    Competency.upsert = mockUpsert;

    const mockUpsertSelectors = jest.fn();
    mockUpsertSelectors.mockReturnValue({
      id: 'dc5a6c49-7657-4330-b3bc-334672df75c8',
      competency_id: '026dca8d-6246-4ba4-ac4a-6bec5116a5be',
      display_name: 'Meets Selector',
      point_value: 1000,
      default_text: 'Yep',
      sort_order: 1,
      created_at: new Date(),
      updated_at: new Date(),
    });

    CompetencySelectors.create = mockUpsertSelectors;
    const svc = new CompetencyService();
    const assessmentHurdleId = 'b06834f1-e9a0-48d4-81a8-a65967e487f7';
    const body: CreateCompetencyDto = {
      existingId: undefined,
      localId: 'localId',
      name: 'yep',
      definition: 'definition',
      assessmentHurdleId,
      displayType: 1,
      requiredProficiencyDefinition: 'rpd',
      screenOut: false,
      selectors: [],
    };
    const rst = await svc.upsert(body, assessmentHurdleId);
    expect(mockUpsert).toBeCalledTimes(1);
    expect(mockUpsertSelectors).toBeCalledTimes(0);
    expect(rst.id).toEqual('026dca8d-6246-4ba4-ac4a-6bec5116a5be');
  });
});
