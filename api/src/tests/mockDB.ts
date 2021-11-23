/* eslint-disable @typescript-eslint/no-unused-vars */
import { QueryOptionsWithType, QueryTypes, Transaction } from 'sequelize/types';
import { DBInterface } from '../database';
import { mocked } from 'ts-jest/utils';

export default class MockDB implements DBInterface {
  public sequelize = {
    transaction: mocked(({} as unknown) as Transaction),
    query: jest.fn(),
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  initConnection(): void {}
  async transaction<T>(autoCallback: (t: Transaction) => PromiseLike<T>): Promise<T> {
    return autoCallback(this.sequelize.transaction);
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  async query<T extends object>(
    sql: string | { query: string; values: unknown[] },
    options: QueryOptionsWithType<QueryTypes.SELECT> & { plain: true },
  ): Promise<T> {
    return new Promise((reject, resolve) => {
      resolve(this.sequelize.query());
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  close(): void {}
}
