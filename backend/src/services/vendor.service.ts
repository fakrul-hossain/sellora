import { VendorRepository, VendorRow } from '../models/vendor.repository.js';
import { OrderRepository } from '../models/order.repository.js';
import { ProductRepository } from '../models/product.repository.js';
import { AppError } from '../utils/app-error.js';

export class VendorService {
  private static formatVendor(row: VendorRow) {
    return {
      id: String(row.id),
      ownerId: String(row.owner_id),
      storeName: row.store_name,
      slug: row.slug,
      logoUrl: row.logo_url,
      bannerUrl: row.banner_url,
      description: row.description,
      phone: row.phone,
      email: row.email,
      status: row.status,
      commissionRate: Number(row.commission_rate),
      balance: Number(row.balance),
      address: {
        street: row.street || '',
        city: row.city || 'Dhaka',
        area: row.area || 'Central',
      },
      rating: Number(row.rating),
      reviewCount: Number(row.review_count),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  public static async getVendorByUserId(userId: string) {
    const vendor = await VendorRepository.findByOwnerId(userId);
    if (!vendor) {
      throw AppError.notFound('Vendor store profile not found');
    }
    return this.formatVendor(vendor);
  }

  public static async getVendorAnalytics(vendorId: string) {
    const vendorOrders = await OrderRepository.findByVendorId(vendorId);
    const totalProducts = await ProductRepository.countProducts(vendorId);

    let totalSales = 0;
    let pendingOrders = 0;

    for (const ord of vendorOrders) {
      if (ord.order_status === 'PENDING' || ord.order_status === 'PROCESSING') {
        pendingOrders += 1;
      }
      const items = await OrderRepository.getOrderItems(ord.id);
      items.forEach((item) => {
        if (String(item.vendor_id) === String(vendorId)) {
          totalSales += Number(item.price) * Number(item.quantity);
        }
      });
    }

    return {
      totalSales,
      totalOrders: vendorOrders.length,
      totalProducts,
      pendingOrders,
    };
  }

  public static async updateVendorProfile(vendorId: string, input: any) {
    const updated = await VendorRepository.update(vendorId, {
      store_name: input.storeName,
      phone: input.phone,
      description: input.description,
      logo_url: input.logoUrl,
      banner_url: input.bannerUrl,
      street: input.address?.street,
      city: input.address?.city,
      area: input.address?.area,
    });

    if (!updated) {
      throw AppError.notFound('Vendor store not found');
    }
    return this.formatVendor(updated);
  }
}
