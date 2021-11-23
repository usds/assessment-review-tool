import sequelize from 'sequelize';
import { DBInterface } from '../database';

export default class AdminService {
  async doHealthCheck(dbInstance: DBInterface): Promise<boolean> {
    const rst = await dbInstance.query('select 1+1 as result', {
      type: sequelize.QueryTypes.SELECT,
      raw: false, //don't have a model definition for your query
      plain: true, //sequelize will only return the first
    });
    return rst !== null && rst !== undefined;
  }
}
