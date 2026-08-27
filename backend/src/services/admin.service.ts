import { UserRepository } from '../models/user.repository.js';
import { VendorRepository } from '../models/vendor.repository.js';
import { OrderRepository } from '../models/order.repository.js';
import { ProductRepository } from '../models/product.repository.js';
import { SiteSettingsRepository } from '../models/site-settings.repository.js';
import { ActivityLogRepository } from '../models/activity-log.repository.js';
import { AppError } from '../utils/app-error.js';
import { VendorStatus } from '../types/enums.types.js';

export class AdminService {
  public static async getPlatformAnalytics() {
    const allOrders = await OrderRepository.findAll();
    const totalRevenue = await OrderRepository.calculateTotalRevenue();
    const totalVendors = await VendorRepository.countVendors();
    const totalCustomers = await UserRepository.countCustomers();
    const totalProducts = await ProductRepository.countProducts();
    const lowStock = await ProductRepository.countLowStock(undefined, 5);

    let pendingOrders = 0;
    let pendingVendors = 0;

    allOrders.forEach((o) => {
      if (o.order_status === 'PENDING' || o.order_status === 'PROCESSING') {
        pendingOrders += 1;
      }
    });

    const vendorsList = await VendorRepository.listAll();
    vendorsList.forEach((v) => {
      if (v.status === 'PENDING') {
        pendingVendors += 1;
      }
    });

    const platformCommission = Math.round(totalRevenue * 0.05);
    const sellerRevenue = totalRevenue - platformCommission;

    const recentOrders = allOrders.slice(0, 5).map((o) => ({
      id: String(o.id),
      orderNumber: o.order_number,
      customerName: o.customer_name,
      totalAmount: Number(o.total_amount),
      status: o.order_status,
      date: o.created_at,
    }));

    const recentVendors = vendorsList.slice(0, 5).map((v) => ({
      id: String(v.id),
      storeName: v.store_name,
      email: v.email,
      status: v.status,
      date: v.created_at,
    }));

    const recentLogs = await ActivityLogRepository.listRecent(5);

    return {
      totalRevenue,
      platformRevenue: platformCommission,
      sellerRevenue,
      totalOrders: allOrders.length,
      totalVendors,
      totalCustomers,
      totalProducts,
      lowStock,
      pendingOrders,
      pendingVendors,
      recentOrders,
      recentVendors,
      recentLogs: recentLogs.map((l) => ({
        id: String(l.id),
        userName: l.user_name,
        action: l.action,
        module: l.module,
        date: l.created_at,
      })),
    };
  }

  public static async listUsers() {
    const users = await UserRepository.findAll();
    return users.map((u) => ({
      id: String(u.id),
      name: u.name,
      email: u.email,
      phone: u.phone,
      role: u.role,
      vendorId: u.vendor_id,
      createdAt: u.created_at,
    }));
  }

  public static async updateUserRole(userId: string, role: string, adminName: string = 'Admin') {
    const user = await UserRepository.findById(userId);
    if (!user) throw AppError.notFound('User account not found');

    await UserRepository.updateRole(userId, role);

    await ActivityLogRepository.create({
      userName: adminName,
      action: 'ADMIN_CHANGED_USER_ROLE',
      module: 'USERS',
      targetId: userId,
      details: { oldRole: user.role, newRole: role },
    });

    return { userId, role };
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

  public static async updateVendorStatus(vendorId: string, status: VendorStatus, adminName: string = 'Admin') {
    const updated = await VendorRepository.updateStatus(vendorId, status);
    if (!updated) {
      throw AppError.notFound('Vendor store not found');
    }

    await ActivityLogRepository.create({
      userName: adminName,
      action: `ADMIN_${status}_SELLER`,
      module: 'SELLERS',
      targetId: vendorId,
      details: { storeName: updated.store_name, status },
    });

    return {
      id: String(updated.id),
      ownerId: String(updated.owner_id),
      storeName: updated.store_name,
      slug: updated.slug,
      status: updated.status,
      updatedAt: updated.updated_at,
    };
  }

  public static async listProducts() {
    const products = await ProductRepository.findAll({ includeUnapproved: true });
    return products.map((p) => ({
      id: String(p.id),
      vendorId: String(p.vendor_id),
      title: p.title,
      category: p.category,
      brand: p.brand,
      price: Number(p.price),
      stock: Number(p.stock),
      imageUrl: p.image_url,
      isPublished: Boolean(p.is_published),
      isApproved: Boolean(p.is_approved),
      createdAt: p.created_at,
    }));
  }

  public static async approveProduct(productId: string, isApproved: boolean = true, adminName: string = 'Admin') {
    const updated = await ProductRepository.updateApprovalStatus(productId, isApproved);
    if (!updated) {
      throw AppError.notFound('Product not found');
    }

    await ActivityLogRepository.create({
      userName: adminName,
      action: isApproved ? 'ADMIN_APPROVED_PRODUCT' : 'ADMIN_REJECTED_PRODUCT',
      module: 'PRODUCTS',
      targetId: productId,
      details: { title: updated.title, isApproved },
    });

    return { id: String(updated.id), title: updated.title, isApproved: Boolean(updated.is_approved) };
  }

  public static async listOrders() {
    const orders = await OrderRepository.findAll();
    return orders.map((o) => ({
      id: String(o.id),
      orderNumber: o.order_number,
      customerName: o.customer_name,
      customerEmail: o.customer_email,
      totalAmount: Number(o.total_amount),
      paymentMethod: o.payment_method,
      paymentStatus: o.payment_status,
      orderStatus: o.order_status,
      createdAt: o.created_at,
    }));
  }

  public static async getSiteSettings() {
    const doc = await SiteSettingsRepository.getSettings();

    const safeParse = (val: any) => {
      if (!val) return null;
      try {
        return typeof val === 'string' ? JSON.parse(val) : val;
      } catch {
        return null;
      }
    };

    return {
      id: String(doc.id),
      siteName: doc.site_name,
      siteLogo: doc.site_logo || '',
      supportPhone: doc.support_phone,
      supportEmail: doc.support_email,
      announcementText: doc.announcement_text,
      defaultCommissionRate: Number(doc.default_commission_rate),
      banners: safeParse(doc.banners_json) || [],
      heroConfig: safeParse(doc.hero_config_json) || null,
      brandWeekConfig: safeParse(doc.brand_week_config_json) || null,
      categoriesConfig: safeParse(doc.categories_config_json) || [],
      brandsConfig: safeParse(doc.brands_config_json) || [],
      createdAt: doc.created_at,
      updatedAt: doc.updated_at,
    };
  }

  public static async updateSiteSettings(input: any, adminName: string = 'Admin') {
    await SiteSettingsRepository.updateSettings({
      site_name: input.siteName,
      site_logo: input.siteLogo,
      support_phone: input.supportPhone,
      support_email: input.supportEmail,
      announcement_text: input.announcementText,
      default_commission_rate: input.defaultCommissionRate,
      banners: input.banners,
      hero_config: input.heroConfig,
      brand_week_config: input.brandWeekConfig,
      categories_config: input.categoriesConfig,
      brands_config: input.brandsConfig,
    });

    await ActivityLogRepository.create({
      userName: adminName,
      action: 'ADMIN_UPDATED_SETTINGS',
      module: 'SETTINGS',
      details: { siteName: input.siteName },
    });

    return this.getSiteSettings();
  }

  public static async listActivityLogs() {
    const logs = await ActivityLogRepository.listRecent(50);
    return logs.map((l) => ({
      id: String(l.id),
      userId: l.user_id ? String(l.user_id) : null,
      userName: l.user_name,
      action: l.action,
      module: l.module,
      targetId: l.target_id,
      details: l.details_json ? JSON.parse(l.details_json) : {},
      createdAt: l.created_at,
    }));
  }
}
