import { RowDataPacket } from 'mysql2/promise';
import { mysqlClient } from './mysql.client.js';

export interface VendorWithdrawalRow extends RowDataPacket {
  id: number;
  vendor_id: number;
  amount: number;
  payment_method: string;
  account_details: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED';
  transaction_ref?: string;
  created_at: Date;
}

export class VendorWithdrawalRepository {
  public static async create(withdrawal: {
    vendorId: number | string;
    amount: number;
    paymentMethod: string;
    accountDetails: string;
  }): Promise<VendorWithdrawalRow> {
    const numericVendorId = typeof withdrawal.vendorId === 'string' ? parseInt(withdrawal.vendorId, 10) : withdrawal.vendorId;
    const sql = `
      INSERT INTO vendor_withdrawals (vendor_id, amount, payment_method, account_details, status)
      VALUES (?, ?, ?, ?, 'PENDING')
    `;
    const result = await mysqlClient.execute(sql, [
      numericVendorId,
      withdrawal.amount,
      withdrawal.paymentMethod,
      withdrawal.accountDetails,
    ]);

    const sqlSelect = `SELECT * FROM vendor_withdrawals WHERE id = ? LIMIT 1`;
    const rows = await mysqlClient.query<VendorWithdrawalRow[]>(sqlSelect, [result.insertId]);
    return rows[0];
  }

  public static async findByVendorId(vendorId: number | string): Promise<VendorWithdrawalRow[]> {
    const numericVendorId = typeof vendorId === 'string' ? parseInt(vendorId, 10) : vendorId;
    const sql = `SELECT * FROM vendor_withdrawals WHERE vendor_id = ? ORDER BY created_at DESC`;
    return await mysqlClient.query<VendorWithdrawalRow[]>(sql, [numericVendorId]);
  }
}
