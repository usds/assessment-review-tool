import { NextFunction, Request, Response } from 'express';
import CreateHurdleUserDto from '../dto/createhurdleuser.dto';
import CreateUserDto from '../dto/createuser.dto';
import HttpException from '../exceptions/HttpException';
import { AppUser } from '../models/app_user';
import { AssessmentHurdleUser } from '../models/assessment_hurdle_user';
import UserService from '../services/users.service';

export default class UsersHandler {
  userService = new UserService();

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllUsersData: AppUser[] = await this.userService.getAllUsers();
      res.status(200).json({ data: findAllUsersData, message: 'getAllUsers' });
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    if (!userId) {
      return next(new HttpException(400, 'Missing id for user'));
    }
    try {
      const findOneUserData: AppUser = await this.userService.getUserById(userId);
      res.status(200).json({ data: findOneUserData, message: 'getUserById' });
    } catch (error) {
      next(error);
    }
  };

  getUserByEmail = async (req: Request, res: Response, next: NextFunction) => {
    const { userEmail } = req.params;
    if (!userEmail) {
      return next(new HttpException(400, 'Missing email for user'));
    }
    try {
      const findOneUserData: AppUser = await this.userService.getUserByEmail(userEmail);
      res.status(200).json({ data: findOneUserData, message: 'getUserByEmail' });
    } catch (error) {
      next(error);
    }
  };

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    const userData: CreateUserDto = req.body;
    try {
      const createUserData: AppUser = await this.userService.createUser(userData);
      res.status(201).json({ data: createUserData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  createUserAndAddToHurdle = async (req: Request, res: Response, next: NextFunction) => {
    const userData: CreateHurdleUserDto = req.body;
    const assessmentHurdleId = req.params.assessmentHurdleId;
    try {
      const created: AssessmentHurdleUser[] = await this.userService.createUserAndAddToHurdle(userData, assessmentHurdleId);
      res.status(201).json({ data: created, message: 'created' });
    } catch (error) {
      next(error);
    }
  };
}
