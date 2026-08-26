import mysql, { Pool, PoolConnection, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { databaseConfig } from '../config/database.config.js';
import { logger } from '../utils/logger.js';

export class MySQLDatabaseClient {
  private static instance: MySQLDatabaseClient;
  private pool: Pool | null = null;

  private constructor() {}

  public static getInstance(): MySQLDatabaseClient {
    if (!MySQLDatabaseClient.instance) {
      MySQLDatabaseClient.instance = new MySQLDatabaseClient();
    }
    return MySQLDatabaseClient.instance;
  }

  public async connect(): Promise<Pool> {
    if (this.pool) {
      return this.pool;
    }

    try {
      logger.info(`Connecting to MySQL database at ${databaseConfig.host}:${databaseConfig.port}...`);

      try {
        const initConnection = await mysql.createConnection({
          host: databaseConfig.host,
          port: databaseConfig.port,
          user: databaseConfig.user,
          password: databaseConfig.password,
          ssl: databaseConfig.ssl,
        });

        await initConnection.query(`CREATE DATABASE IF NOT EXISTS \`${databaseConfig.database}\`;`);
        await initConnection.end();
      } catch (initErr: any) {
        logger.warn(`Notice during database creation check: ${initErr.message || initErr}`);
      }

      this.pool = mysql.createPool(databaseConfig);

      const connection = await this.pool.getConnection();
      logger.info(`Successfully established MySQL pool connection to database "${databaseConfig.database}".`);
      connection.release();

      return this.pool;
    } catch (error) {
      logger.error('Failed to connect to MySQL database:', error);
      throw error;
    }
  }

  public getPool(): Pool {
    if (!this.pool) {
      throw new Error('MySQL Database connection pool has not been initialized. Call connect() first.');
    }
    return this.pool;
  }

  public async query<T extends RowDataPacket[]>(sql: string, params: any[] = []): Promise<T> {
    const pool = this.getPool();
    const [rows] = await pool.query<T>(sql, params);
    return rows;
  }

  public async execute(sql: string, params: any[] = []): Promise<ResultSetHeader> {
    const pool = this.getPool();
    const [result] = await pool.execute<ResultSetHeader>(sql, params);
    return result;
  }

  public async getConnection(): Promise<PoolConnection> {
    const pool = this.getPool();
    return await pool.getConnection();
  }

  public async isHealthy(): Promise<boolean> {
    try {
      if (!this.pool) return false;
      const connection = await this.pool.getConnection();
      await connection.ping();
      connection.release();
      return true;
    } catch {
      return false;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.pool) {
      logger.info('Closing MySQL connection pool...');
      await this.pool.end();
      this.pool = null;
      logger.info('MySQL connection pool closed.');
    }
  }
}

export const mysqlClient = MySQLDatabaseClient.getInstance();
