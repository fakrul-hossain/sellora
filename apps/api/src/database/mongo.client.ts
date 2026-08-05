import { MongoClient, Db, Collection, ClientSession, Document } from 'mongodb';
import dns from 'dns';
import { databaseConfig } from '../config/database.config.js';
import { logger } from '../core/utils/logger.js';

// Configure DNS servers to handle MongoDB Atlas SRV record lookups reliably on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {
  // Ignore fallback if unsupported in specific environments
}

export class MongoDatabaseClient {
  private static instance: MongoDatabaseClient;
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private isConnecting: boolean = false;

  private constructor() {}

  public static getInstance(): MongoDatabaseClient {
    if (!MongoDatabaseClient.instance) {
      MongoDatabaseClient.instance = new MongoDatabaseClient();
    }
    return MongoDatabaseClient.instance;
  }

  public async connect(): Promise<Db> {
    if (this.db) {
      return this.db;
    }

    if (this.isConnecting) {
      while (this.isConnecting) {
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      if (this.db) return this.db;
    }

    this.isConnecting = true;

    try {
      logger.info(`Connecting to MongoDB Atlas/Instance at: ${databaseConfig.uri}`);
      this.client = new MongoClient(databaseConfig.uri, databaseConfig.options);
      await this.client.connect();

      this.db = this.client.db(databaseConfig.dbName);
      logger.info(`MongoDB Pool connected successfully to database: "${databaseConfig.dbName}"`);
      this.isConnecting = false;
      return this.db;
    } catch (error) {
      this.isConnecting = false;
      logger.error('Failed to establish MongoDB Native Driver pool connection:', error);
      throw error;
    }
  }

  public getDb(): Db {
    if (!this.db) {
      throw new Error('Database connection has not been initialized. Call connect() first.');
    }
    return this.db;
  }

  public getCollection<T extends Document = Document>(collectionName: string): Collection<T> {
    return this.getDb().collection<T>(collectionName);
  }

  public startSession(): ClientSession {
    if (!this.client) {
      throw new Error('MongoClient is not initialized.');
    }
    return this.client.startSession();
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      logger.info('Closing MongoDB connection pool gracefully...');
      await this.client.close();
      this.client = null;
      this.db = null;
      logger.info('MongoDB connection pool closed.');
    }
  }

  public async isHealthy(): Promise<boolean> {
    try {
      if (!this.db) return false;
      const res = await this.db.command({ ping: 1 });
      return res.ok === 1;
    } catch (error) {
      return false;
    }
  }
}

export const mongoClient = MongoDatabaseClient.getInstance();
