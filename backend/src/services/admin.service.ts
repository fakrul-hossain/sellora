import { UserRepository } from '../models/user.repository.js';
import { VendorRepository } from '../models/vendor.repository.js';
import { OrderRepository } from '../models/order.repository.js';
import { ProductRepository } from '../models/product.repository.js';
import { SiteSettingsRepository } from '../models/site-settings.repository.js';
import { AppError } from '../utils/app-error.js';
import { VendorStatus } from '../types/enums.types.js';

export class AdminService {
  public static async getPlatformAnalytics() {
    const allOrders = await OrderRepository.findAll();
    const totalRevenue = await OrderRepository.calculateTotalRevenue();
    const totalVendors = await VendorRepository.countVendors();
    const totalCustomers = await UserRepository.countCustomers();
    const totalProducts = await ProductRepository.countProducts();

    return {
      totalRevenue,
      totalOrders: allOrders.length,
      totalVendors,
      totalCustomers,
      totalProducts,
    };
  }

  public static async listVendors() {
    const vendors = await VendorRepository.listAll();
    return vendors.map((v) => ({
      id: String(v.id),
      ownerId: String(v.owner_id),
      storeName: v.store_name,
      slug: v.slug,
      logoUrl: v.logo_url,
      bannerUrl: v.banner_url,
      description: v.description,
      phone: v.phone,
      email: v.email,
      status: v.status,
      commissionRate: Number(v.commission_rate),
      balance: Number(v.balance),
      address: { street: v.street, city: v.city, area: v.area },
      rating: Number(v.rating),
      reviewCount: Number(v.review_count),
      createdAt: v.created_at,
      updatedAt: v.updated_at,
    }));
  }

  public static async updateVendorStatus(vendorId: string, status: VendorStatus) {
    const updated = await VendorRepository.updateStatus(vendorId, status);
    if (!updated) {
      throw AppError.notFound('Vendor store not found');
    }

    return {
      id: String(updated.id),
      ownerId: String(updated.owner_id),
      storeName: updated.store_name,
      slug: updated.slug,
      status: updated.status,
      updatedAt: updated.updated_at,
    };
  }

  public static async getSiteSettings() {
    const doc = await SiteSettingsRepository.getSettings();
    let banners: any[] = [];
    if (doc.banners_json) {
      try {
        banners = typeof doc.banners_json === 'string' ? JSON.parse(doc.banners_json) : doc.banners_json;
      } catch {
        banners = [];
      }
    }

    return {
      id: String(doc.id),
      siteName: doc.site_name,
      supportPhone: doc.support_phone,
      supportEmail: doc.support_email,
      announcementText: doc.announcement_text,
      defaultCommissionRate: Number(doc.default_commission_rate),
      banners,
      createdAt: doc.created_at,
      updatedAt: doc.updated_at,
    };
  }

  public static async updateSiteSettings(input: any) {
    await SiteSettingsRepository.updateSettings({
      site_name: input.siteName,
      support_phone: input.supportPhone,
      support_email: input.supportEmail,
      announcement_text: input.announcementText,
      default_commission_rate: input.defaultCommissionRate,
      banners: input.banners,
    });

    return this.getSiteSettings();
  }
}
