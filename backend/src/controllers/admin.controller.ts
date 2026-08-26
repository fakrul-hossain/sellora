import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service.js';
import { ApiResponseBuilder } from '../utils/api-response.js';

export class AdminController {
  public static getAnalytics = async (req: Request, res: Response) => {
    const analytics = await AdminService.getPlatformAnalytics();
    return ApiResponseBuilder.success(res, 'Platform analytics fetched', analytics);
  };

  public static listUsers = async (req: Request, res: Response) => {
    const users = await AdminService.listUsers();
    return ApiResponseBuilder.success(res, 'Users list fetched', users);
  };

  public static updateUserRole = async (req: Request, res: Response) => {
    const { role } = req.body;
    const adminName = req.user?.name || 'Admin';
    const result = await AdminService.updateUserRole(req.params.id, role, adminName);
    return ApiResponseBuilder.success(res, 'User role updated successfully', result);
  };

  public static listVendors = async (req: Request, res: Response) => {
    const vendors = await AdminService.listVendors();
    return ApiResponseBuilder.success(res, 'Vendors list fetched', vendors);
  };

  public static updateVendorStatus = async (req: Request, res: Response) => {
    const { status } = req.body;
    const adminName = req.user?.name || 'Admin';
    const vendor = await AdminService.updateVendorStatus(req.params.id, status, adminName);
    return ApiResponseBuilder.success(res, 'Vendor status updated', vendor);
  };

  public static listProducts = async (req: Request, res: Response) => {
    const products = await AdminService.listProducts();
    return ApiResponseBuilder.success(res, 'Products catalog fetched', products);
  };

  public static listOrders = async (req: Request, res: Response) => {
    const orders = await AdminService.listOrders();
    return ApiResponseBuilder.success(res, 'Orders list fetched', orders);
  };

  public static getSiteSettings = async (req: Request, res: Response) => {
    const settings = await AdminService.getSiteSettings();
    return ApiResponseBuilder.success(res, 'Site settings fetched', settings);
  };

  public static updateSiteSettings = async (req: Request, res: Response) => {
    const adminName = req.user?.name || 'Admin';
    const settings = await AdminService.updateSiteSettings(req.body, adminName);
    return ApiResponseBuilder.success(res, 'Site settings updated', settings);
  };

  public static listActivityLogs = async (req: Request, res: Response) => {
    const logs = await AdminService.listActivityLogs();
    return ApiResponseBuilder.success(res, 'Activity logs fetched', logs);
  };
}
