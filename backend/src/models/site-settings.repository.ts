import { RowDataPacket } from 'mysql2/promise';
import { mysqlClient } from './mysql.client.js';

export interface SiteSettingsRow extends RowDataPacket {
  id: number;
  site_name: string;
  support_phone: string;
  support_email: string;
  announcement_text: string;
  default_commission_rate: number;
  banners_json?: string;
  created_at: Date;
  updated_at: Date;
}

export interface UpdateSiteSettingsPayload {
  site_name?: string;
  support_phone?: string;
  support_email?: string;
  announcement_text?: string;
  default_commission_rate?: number;
  banners?: any[];
}

export class SiteSettingsRepository {
  public static async getSettings(): Promise<SiteSettingsRow> {
    const sql = `SELECT * FROM site_settings LIMIT 1`;
    const rows = await mysqlClient.query<SiteSettingsRow[]>(sql);

    if (rows.length > 0) {
      return rows[0];
    }

    const insertSql = `
      INSERT INTO site_settings (site_name, support_phone, support_email, announcement_text, default_commission_rate, banners_json)
      VALUES (?, ?, ?, ?, 5.00, '[]')
    `;
    const defaultAnnounce = '🎉 Welcome to SELLORA! Free Express Shipping on orders over ৳5,000.';
    const result = await mysqlClient.execute(insertSql, [
      'SELLORA Bangladesh',
      '+880 9612-345678',
      'support@sellora.com',
      defaultAnnounce,
    ]);

    const createdRows = await mysqlClient.query<SiteSettingsRow[]>(`SELECT * FROM site_settings WHERE id = ?`, [result.insertId]);
    return createdRows[0];
  }

  public static async updateSettings(input: UpdateSiteSettingsPayload): Promise<SiteSettingsRow> {
    const current = await this.getSettings();

    const fields: string[] = [];
    const values: any[] = [];

    if (input.site_name !== undefined) { fields.push('site_name = ?'); values.push(input.site_name); }
    if (input.support_phone !== undefined) { fields.push('support_phone = ?'); values.push(input.support_phone); }
    if (input.support_email !== undefined) { fields.push('support_email = ?'); values.push(input.support_email); }
    if (input.announcement_text !== undefined) { fields.push('announcement_text = ?'); values.push(input.announcement_text); }
    if (input.default_commission_rate !== undefined) { fields.push('default_commission_rate = ?'); values.push(input.default_commission_rate); }
    if (input.banners !== undefined) { fields.push('banners_json = ?'); values.push(JSON.stringify(input.banners)); }

    if (fields.length > 0) {
      values.push(current.id);
      const sql = `UPDATE site_settings SET ${fields.join(', ')} WHERE id = ?`;
      await mysqlClient.execute(sql, values);
    }

    return await this.getSettings();
  }
}
