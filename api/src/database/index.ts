import Sequelize, { QueryOptionsWithType, QueryTypes, Transaction } from 'sequelize';
import { dbURI, env } from '../config';
import { logger } from '../utils/logger';
import { initModels } from '../models/init-models';

logger.info(`Database Connection for "${env}" set to ${dbURI.match(/@(.*)/)![0]}`);

export interface DBInterface {
  initConnection(): void;
  transaction<T>(autoCallback: (t: Transaction) => PromiseLike<T>): Promise<T>;
  close(): void;
  // eslint-disable-next-line @typescript-eslint/ban-types
  query<T extends object>(
    sql: string | { query: string; values: unknown[] },
    options: QueryOptionsWithType<QueryTypes.SELECT> & { plain: true },
  ): Promise<T>;
  auditQuery(sql: string): void;
}

export default class DB implements DBInterface {
  public sequelize: Sequelize.Sequelize;

  constructor(autoInit = true) {
    this.sequelize = new Sequelize.Sequelize(dbURI, {
      pool: {
        min: 0,
        max: 30,
        acquire: 30000,
        idle: 3000,
      },
      logQueryParameters: env === 'development',
      logging: (query, time) => {
        logger.debug(`${time}ms ${query}`);
      },
      timezone: 'utc',
      benchmark: true,
      define: {
        updatedAt: 'updated_at',
        createdAt: 'created_at',
        timestamps: false,
      },
      ssl: false
    });
    try {
      initModels(this.sequelize);
    } catch (err) {
      logger.error(`DB initialization error ${JSON.stringify(err)}`);
    }
    if (autoInit) {
      this.initConnection();
    }
  }

  public initConnection() {
    logger.info('Initializing DB connection.');
    return new Promise((resolve, reject) => {
      this.sequelize
        .authenticate()
        .then(() => {
          logger.info('🟢 The database is connected.');
          resolve(true);
        })
        .catch((error: Error) => {
          logger.error(`🔴 Unable to connect to the database: ${JSON.stringify(error)}.`);
          reject(false);
        });
    });
  }

  /**
   * Wrapper around @see Sequelize.transaction
   * @param autoCallback Callback for the transaction
   */
  public async transaction<T>(autoCallback: (t: Transaction) => PromiseLike<T>): Promise<T> {
    return this.sequelize.transaction(autoCallback);
  }

  /**
   * Wrapper around @see Sequelize.query
   * @param sql string
   * @param options QueryOptionsWithType
   */
  // eslint-disable-next-line @typescript-eslint/ban-types
  public async query<T extends object>(
    sql: string | { query: string; values: unknown[] },
    options: QueryOptionsWithType<QueryTypes.SELECT> & { plain: true },
  ): Promise<T>  {
    return this.sequelize.query(sql, options);
  }

  public async auditQuery(sql: string): Promise<void> {
    this.sequelize.query(sql, { raw: true });
    return;
  }

  public close() {
    logger.error(`🔴 Closing DB.`);
    return this.sequelize.close();
  }
}
