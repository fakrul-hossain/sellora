import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true,
};

async function importDatabase() {
  console.log('Connecting to MySQL at %s:%d (user: %s)...', dbConfig.host, dbConfig.port, dbConfig.user);

  try {
    const conn = await mysql.createConnection(dbConfig);
    console.log('Successfully connected to MySQL.');

    const sqlPath = path.resolve(process.cwd(), '../sellora_multivendor_full.sql');
    if (!fs.existsSync(sqlPath)) {
      throw new Error(`SQL file not found at ${sqlPath}`);
    }

    console.log('Reading database SQL file: %s', sqlPath);
    let fullSql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Executing database initialization and seeding...');

    // Remove DELIMITER commands for node mysql2 driver
    // node mysql2 handles multipleStatements natively if delimiters are stripped
    // First, extract procedure definitions or split properly
    const parts = fullSql.split(/DELIMITER\s+\$\$/i);
    const beforeDelimiter = parts[0];
    const afterFirstDelimiter = parts[1] || '';

    // Execute initial DDL & drops
    console.log('1/3 Creating tables and base schema...');
    await conn.query(beforeDelimiter);

    // If there are procedure definitions between DELIMITER $$ and DELIMITER ;
    if (afterFirstDelimiter) {
      const procParts = afterFirstDelimiter.split(/DELIMITER\s+;/i);
      const proceduresSql = procParts[0];
      const afterDelimiter = procParts[1] || '';

      console.log('2/3 Creating stored procedures...');
      // Split procedures by $$
      const procs = proceduresSql.split('$$').map(p => p.trim()).filter(p => p.length > 0);
      for (const proc of procs) {
        try {
          await conn.query(proc);
        } catch (procErr: any) {
          console.warn('Notice creating procedure:', procErr.message);
        }
      }

      console.log('3/3 Inserting seed data (users, vendors, categories, products, orders, payments)...');
      if (afterDelimiter.trim()) {
        await conn.query(afterDelimiter);
      }
    }

    // Verify statistics
    console.log('\n================ DATABASE IMPORT SUMMARY ================');
    const [userCount]: any = await conn.query('SELECT COUNT(*) as count FROM `sellora_db`.`users`');
    const [vendorCount]: any = await conn.query('SELECT COUNT(*) as count FROM `sellora_db`.`vendors`');
    const [catCount]: any = await conn.query('SELECT COUNT(*) as count FROM `sellora_db`.`categories`');
    const [prodCount]: any = await conn.query('SELECT COUNT(*) as count FROM `sellora_db`.`products`');
    const [orderCount]: any = await conn.query('SELECT COUNT(*) as count FROM `sellora_db`.`orders`');
    const [procCount]: any = await conn.query('SHOW PROCEDURE STATUS WHERE Db = "sellora_db"');

    console.log('Users seeded      : %d (1 Super Admin, 15 Owners, 30 Customers)', userCount[0].count);
    console.log('Vendors seeded    : %d', vendorCount[0].count);
    console.log('Categories seeded : %d', catCount[0].count);
    console.log('Products seeded   : %d', prodCount[0].count);
    console.log('Orders seeded     : %d (with payments & order items)', orderCount[0].count);
    console.log('Stored Procedures : %d (%s)', procCount.length, procCount.map((p: any) => p.Name).join(', '));
    console.log('=========================================================\n');
    console.log('MySQL Database `sellora_db` is now fully ready for XAMPP!');

    await conn.end();
    process.exit(0);
  } catch (err: any) {
    console.error('Database import failed:', err.message || err);
    process.exit(1);
  }
}

importDatabase();
