import { RowDataPacket } from 'mysql2/promise';
import { mysqlClient } from './mysql.client.js';

export interface ActivityLogRow extends RowDataPacket {
  id: number;
  user_id?: number;
  user_name: string;
  action: string;
  module: string;
  target_id?: string;
  details_json?: string;
  ip_address?: string;
  created_at: Date;
}

export class ActivityLogRepository {
  public static async create(log: {
    userId?: number | string;
    userName?: string;
    action: string;
    module: string;
    targetId?: string;
    details?: any;
    ipAddress?: string;
  }): Promise<void> {
    const numericUserId = log.userId ? (typeof log.userId === 'string' ? parseInt(log.userId, 10) : log.userId) : null;
    const sql = `
      INSERT INTO activity_logs (user_id, user_name, action, module, target_id, details_json, ip_address)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await mysqlClient.execute(sql, [
      numericUserId,
      log.userName || 'Admin',
      log.action,
      log.module,
      log.targetId || null,
      JSON.stringify(log.details || {}),
      log.ipAddress || '127.0.0.1',
    ]);
  }

  public static async listRecent(limit: number = 20): Promise<ActivityLogRow[]> {
    const sql = `SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT ?`;
    return await mysqlClient.query<ActivityLogRow[]>(sql, [limit]);
  }
}
