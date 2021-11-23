import CreateHurdleUserDto from '../dto/createhurdleuser.dto';
import CreateUserDto from '../dto/createuser.dto';
import HttpException from '../exceptions/HttpException';
import { AppUser } from '../models/app_user';
import { AssessmentHurdleUser } from '../models/assessment_hurdle_user';
import { logger } from '../utils/logger';

export default class UserService {
  async getAllUsersByHurdle(assessmentHurdle: string): Promise<AssessmentHurdleUser[]> {
    const rst = await AssessmentHurdleUser.findAll({
      where: { assessment_hurdle_id: assessmentHurdle },
      include: [{ model: AppUser as any, required: true }],
    });
    return rst;
  }
  async getAllUsers(): Promise<AppUser[]> {
    const rst: AppUser[] = await AppUser.findAll();
    return rst;
  }

  async getUserById(id: string): Promise<AppUser> {
    const findUser = await AppUser.findByPk(id);
    if (!findUser) throw new HttpException(404, 'Not Found');
    return findUser;
  }

  async getUserByEmail(email: string): Promise<AppUser> {
    const findUser = await AppUser.findOne({ where: { email: email.toLowerCase() } });
    if (!findUser) throw new HttpException(404, 'Not Found');
    return findUser;
  }

  async createUser(newUser: CreateUserDto): Promise<AppUser> {
    const createUser = await AppUser.create({
      email: newUser.email.toLowerCase(),
      name: newUser.name,
    });
    return createUser;
  }

  async createUserAndAddToHurdle(container: CreateHurdleUserDto, assessmentHurdleId: string): Promise<AssessmentHurdleUser[]> {
    logger.debug(`createUserAndAddToHurdle for ${container.userSetup.length} userSetup pairs`);
    const allResults = await Promise.all(
      container.userSetup.flatMap(async body => {
        const userRecords: AppUser[] = await Promise.all(
          body.users.map(async u => {
            const [rst] = await AppUser.findOrCreate({
              where: { email: u.email.toLowerCase() },
              defaults: {
                email: u.email.toLowerCase(),
                name: u.name,
              },
            });
            return rst;
          }),
        );
        const mapped = await Promise.all(
          userRecords.map(async ur => {
            const [rst, created] = await AssessmentHurdleUser.findOrCreate({
              where: { app_user_id: ur.id, assessment_hurdle_id: assessmentHurdleId },
              defaults: {
                app_user_id: ur.id,
                assessment_hurdle_id: assessmentHurdleId!,
                role: body.role,
              },
            });
            if (!created) {
              rst.update({
                app_user_id: ur.id,
                assessment_hurdle_id: assessmentHurdleId!,
                role: body.role,
              });
            }
            return rst;
          }),
        );
        return mapped;
      }),
    );
    //this shouldn't be needed
    return allResults.flat();
  }
}
