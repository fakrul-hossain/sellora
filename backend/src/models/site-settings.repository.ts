import { RowDataPacket } from 'mysql2/promise';
import { mysqlClient } from './mysql.client.js';

export interface SiteSettingsRow extends RowDataPacket {
  id: number;
  site_name: string;
  site_logo?: string;
  support_phone: string;
  support_email: string;
  announcement_text: string;
  default_commission_rate: number;
  banners_json?: string;
  hero_config_json?: string;
  brand_week_config_json?: string;
  categories_config_json?: string;
  brands_config_json?: string;
  created_at: Date;
  updated_at: Date;
}

export interface UpdateSiteSettingsPayload {
  site_name?: string;
  site_logo?: string;
  support_phone?: string;
  support_email?: string;
  announcement_text?: string;
  default_commission_rate?: number;
  banners?: any[];
  hero_config?: any;
  brand_week_config?: any;
  categories_config?: any[];
  brands_config?: any[];
}

export class SiteSettingsRepository {
  public static async getSettings(): Promise<SiteSettingsRow> {
    const sql = `SELECT * FROM site_settings LIMIT 1`;
    const rows = await mysqlClient.query<SiteSettingsRow[]>(sql);

    if (rows.length > 0) {
      return rows[0];
    }

    const defaultHeroConfig = {
      slides: [
        {
          id: 1,
          image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1200',
          slug: '/campaigns/tech-mega-sale',
        },
        {
          id: 2,
          image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200',
          slug: '/campaigns/ultrabook-deals',
        },
      ],
    };

    const defaultBrandWeekConfig = {
      image: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?q=80&w=1200',
      slug: '/campaigns/apple-ecosystem',
    };

    const defaultCategoriesConfig = [
      { id: 1, name: 'Smartphones', itemCount: '140+ Items', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=300', href: '/search?category=Electronics' },
      { id: 2, name: 'Audio & Sound', itemCount: '95+ Items', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=300', href: '/search?category=Gadgets' },
      { id: 3, name: 'Laptops & PCs', itemCount: '60+ Items', image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=300', href: '/search?category=Electronics' },
      { id: 4, name: 'Smartwatches', itemCount: '80+ Items', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=300', href: '/search?category=Gadgets' },
      { id: 5, name: 'Fashion & Apparel', itemCount: '200+ Items', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=300', href: '/search?category=Fashion' },
    ];

    const defaultBrandsConfig = [
      { id: 1, name: 'Apple Store', rating: 4.9, productsCount: '120+ Products', badge: 'Official Authorized', logo: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=200' },
      { id: 2, name: 'Sony Electronics', rating: 4.8, productsCount: '85+ Products', badge: 'Official Store', logo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200' },
      { id: 3, name: 'Samsung Official', rating: 4.9, productsCount: '210+ Products', badge: 'Top Seller', logo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=200' },
      { id: 4, name: 'Anker Tech', rating: 4.7, productsCount: '95+ Products', badge: 'Fast Delivery', logo: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=200' },
    ];

    const insertSql = `
      INSERT INTO site_settings (
        site_name, site_logo, support_phone, support_email, announcement_text, default_commission_rate,
        banners_json, hero_config_json, brand_week_config_json, categories_config_json, brands_config_json
      )
      VALUES (?, ?, ?, ?, ?, 5.00, '[]', ?, ?, ?, ?)
    `;

    const result = await mysqlClient.execute(insertSql, [
      'SELLORA Bangladesh',
      '',
      '+880 9612-345678',
      'support@sellora.com',
      '🎉 Welcome to SELLORA! Free Express Shipping on orders over ৳5,000.',
      JSON.stringify(defaultHeroConfig),
      JSON.stringify(defaultBrandWeekConfig),
      JSON.stringify(defaultCategoriesConfig),
      JSON.stringify(defaultBrandsConfig),
    ]);

    const createdRows = await mysqlClient.query<SiteSettingsRow[]>(`SELECT * FROM site_settings WHERE id = ?`, [result.insertId]);
    return createdRows[0];
  }

  public static async updateSettings(input: UpdateSiteSettingsPayload): Promise<SiteSettingsRow> {
    const current = await this.getSettings();

    const fields: string[] = [];
    const values: any[] = [];

    if (input.site_name !== undefined) { fields.push('site_name = ?'); values.push(input.site_name); }
    if (input.site_logo !== undefined) { fields.push('site_logo = ?'); values.push(input.site_logo); }
    if (input.support_phone !== undefined) { fields.push('support_phone = ?'); values.push(input.support_phone); }
    if (input.support_email !== undefined) { fields.push('support_email = ?'); values.push(input.support_email); }
    if (input.announcement_text !== undefined) { fields.push('announcement_text = ?'); values.push(input.announcement_text); }
    if (input.default_commission_rate !== undefined) { fields.push('default_commission_rate = ?'); values.push(input.default_commission_rate); }
    if (input.banners !== undefined) { fields.push('banners_json = ?'); values.push(JSON.stringify(input.banners)); }
    if (input.hero_config !== undefined) { fields.push('hero_config_json = ?'); values.push(JSON.stringify(input.hero_config)); }
    if (input.brand_week_config !== undefined) { fields.push('brand_week_config_json = ?'); values.push(JSON.stringify(input.brand_week_config)); }
    if (input.categories_config !== undefined) { fields.push('categories_config_json = ?'); values.push(JSON.stringify(input.categories_config)); }
    if (input.brands_config !== undefined) { fields.push('brands_config_json = ?'); values.push(JSON.stringify(input.brands_config)); }

    if (fields.length > 0) {
      values.push(current.id);
      const sql = `UPDATE site_settings SET ${fields.join(', ')} WHERE id = ?`;
      await mysqlClient.execute(sql, values);
    }

    return await this.getSettings();
  }
}
