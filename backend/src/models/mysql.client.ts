import mysql, { Pool, RowDataPacket, ResultSetHeader, PoolConnection } from 'mysql2/promise';
import { databaseConfig } from '../config/database.config.js';
import { logger } from '../utils/logger.js';

// Global MySQL connection pool for easy database queries
export const pool: Pool = mysql.createPool(databaseConfig);

export class MySQLDatabaseClient {
  private static instance: MySQLDatabaseClient;
  private constructor() {}

  public static getInstance(): MySQLDatabaseClient {
    if (!MySQLDatabaseClient.instance) {
      MySQLDatabaseClient.instance = new MySQLDatabaseClient();
    }
    return MySQLDatabaseClient.instance;
  }

  public async connect(): Promise<Pool> {
    try {
      const conn = await pool.getConnection();
      logger.info(`Successfully connected to MySQL database: "${databaseConfig.database}"`);
      conn.release();
      return pool;
    } catch (err: any) {
      logger.error('Failed to connect to MySQL:', err.message || err);
      throw err;
    }
  }

  public getPool(): Pool {
    return pool;
  }

  public async query<T extends RowDataPacket[]>(sql: string, params: any[] = []): Promise<T> {
    const [rows] = await pool.query<T>(sql, params);
    return rows;
  }

  public async execute(sql: string, params: any[] = []): Promise<ResultSetHeader> {
    const [result] = await pool.execute<ResultSetHeader>(sql, params);
    return result;
  }

  public async getConnection(): Promise<PoolConnection> {
    return await pool.getConnection();
  }

  public async disconnect(): Promise<void> {
    await pool.end();
    logger.info('MySQL connection pool closed.');
  }
}

export const mysqlClient = MySQLDatabaseClient.getInstance();
