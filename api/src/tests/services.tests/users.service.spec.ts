// import request from 'supertest';
// import App from '../../app';
// import CreateUserDto from '../../dto/createuser.dto';
import CreateHurdleUserDto, { CreateHurdleUserPairDto } from '../../dto/createhurdleuser.dto';
import CreateUserDto from '../../dto/createuser.dto';
import HttpException from '../../exceptions/HttpException';
import { AppUser } from '../../models/app_user';
import { AssessmentHurdleUser } from '../../models/assessment_hurdle_user';
//import UsersRoute from '../../routes/users.routes';
import UserService from '../../services/users.service';

jest.mock('../../models/app_user');

beforeEach(() => {
  jest.resetAllMocks();
});

describe('getBy Tests', () => {
  it('getById returns value', async () => {
    const mockFindByPk = jest.fn();
    mockFindByPk.mockReturnValue({
      id: '0f0fb145-5e26-4732-b72d-73560645a544',
      email: 'testuser@omb.eop.gov',
      name: 'Steve Tester',
      meta_user_type: 1,
      created_at: new Date(),
      updated_at: new Date(),
    });

    AppUser.findByPk = mockFindByPk;

    const svc = new UserService();
    const user = await svc.getUserById('0f0fb145-5e26-4732-b72d-73560645a544');
    expect(mockFindByPk).toBeCalledTimes(1);
    expect(user.email).toEqual('testuser@omb.eop.gov');
  });

  it('getById throws 400 error for empty value', async () => {
    const svc = new UserService();
    await expect(svc.getUserById('')).rejects.toThrowError(HttpException);
  });

  it('getByID throws 404 error for not found user', async () => {
    const mockFindByPk = jest.fn();
    mockFindByPk.mockReturnValue(undefined);

    AppUser.findByPk = mockFindByPk;
    const svc = new UserService();
    await expect(svc.getUserById('0122a8d8-a183-400d-93fe-b59c03eb4075')).rejects.toThrowError(HttpException);
    expect(mockFindByPk).toBeCalledTimes(1);
  });

  it('getByEmail returns user', async () => {
    const mockFindByPk = jest.fn();
    mockFindByPk.mockReturnValue({
      id: '0f0fb145-5e26-4732-b72d-73560645a544',
      email: 'testuser@omb.eop.gov',
      name: 'Steve Tester',
      meta_user_type: 1,
      created_at: new Date(),
      updated_at: new Date(),
    });

    AppUser.findOne = mockFindByPk;

    const svc = new UserService();
    const rst = await svc.getUserByEmail('testuser@omb.eop.gov');
    expect(rst.email).toEqual('testuser@omb.eop.gov');
  });

  it('getByEmail returns 400 for emptyEmail', async () => {
    const svc = new UserService();
    await expect(svc.getUserByEmail('')).rejects.toThrowError(HttpException);
  });

  it('getByEmail returns 404 for not found email', async () => {
    const mockFindByPk = jest.fn();
    mockFindByPk.mockReturnValue(undefined);

    AppUser.findByPk = mockFindByPk;
    const svc = new UserService();
    await expect(svc.getUserByEmail('testuser@omb.eop.gov')).rejects.toThrowError(HttpException);
  });
});

describe('createUserAndAddToHurdle Tests', () => {
  it('returns 400 for missing hurdle Id', async () => {
    const svc = new UserService();
    const body = new CreateHurdleUserDto();
    const hurdleId = '';
    await expect(svc.createUserAndAddToHurdle(body, hurdleId)).rejects.toThrowError(HttpException);
  });

  it('findOrCreate called correct number of times for single input', async () => {
    const appUserFindOrCreate = jest.fn();
    const hurdleUserFindOrCreate = jest.fn();

    AppUser.findOrCreate = appUserFindOrCreate;
    AssessmentHurdleUser.findOrCreate = hurdleUserFindOrCreate;

    appUserFindOrCreate.mockReturnValue([
      {
        id: '0f0fb145-5e26-4732-b72d-73560645a544',
        email: 'test.hr@omb.eop.gov',
        name: 'Test HR',
        meta_user_type: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      true,
    ]);

    hurdleUserFindOrCreate.mockReturnValue([
      {
        app_user_id: '0f0fb145-5e26-4732-b72d-73560645a544',
        assessment_hurdle_id: 'da269580-0b7d-47d3-863a-5acf23fa371d',
        role: 1,
      },
      true,
    ]);

    const svc = new UserService();
    const body = new CreateHurdleUserDto();
    const assessmentHurdleId = 'da269580-0b7d-47d3-863a-5acf23fa371d';
    const pair: CreateHurdleUserPairDto = {
      role: 1,
      users: [new CreateUserDto('test.hr@omb.eop.gov', 'Test HR')],
    };

    body.userSetup = [pair];

    const rst = await svc.createUserAndAddToHurdle(body, assessmentHurdleId);
    expect(rst).toHaveLength(1);
    expect(appUserFindOrCreate).toBeCalledTimes(1);
    expect(hurdleUserFindOrCreate).toBeCalledTimes(1);

    const single = rst[0];
    expect(single.app_user_id).toEqual('0f0fb145-5e26-4732-b72d-73560645a544');
    expect(single.assessment_hurdle_id).toEqual('da269580-0b7d-47d3-863a-5acf23fa371d');
  });
});
