import { NextFunction, Request, Response } from 'express';
import DB from '../database';
import AdminService from '../services/admin.service';

export default class AdminHandler {
  service = new AdminService();

  healthCheck = async (req: Request, res: Response, next: NextFunction) => {
    const dbInstance = req.app.get('Db') as DB;

    try {
      const rst = await this.service.doHealthCheck(dbInstance);
      res.status(200).json({ data: rst, message: 'healthCheck' });
    } catch (error) {
      next(error);
    }
  };
}
