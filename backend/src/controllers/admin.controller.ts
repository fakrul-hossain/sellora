import { Request, Response } from 'express';
import { AdminService } from '../services/admin.service.js';
import { ApiResponseBuilder } from '../utils/api-response.js';

export class AdminController {
  public static getAnalytics = async (req: Request, res: Response) => {
    const analytics = await AdminService.getPlatformAnalytics();
    return ApiResponseBuilder.success(res, 'Platform analytics fetched', analytics);
  };

  public static listVendors = async (req: Request, res: Response) => {
    const vendors = await AdminService.listVendors();
    return ApiResponseBuilder.success(res, 'Vendors list fetched', vendors);
  };

  public static updateVendorStatus = async (req: Request, res: Response) => {
    const { status } = req.body;
    const vendor = await AdminService.updateVendorStatus(req.params.id, status);
    return ApiResponseBuilder.success(res, 'Vendor status updated', vendor);
  };

  public static getSiteSettings = async (req: Request, res: Response) => {
    const settings = await AdminService.getSiteSettings();
    return ApiResponseBuilder.success(res, 'Site settings fetched', settings);
  };

  public static updateSiteSettings = async (req: Request, res: Response) => {
    const settings = await AdminService.updateSiteSettings(req.body);
    return ApiResponseBuilder.success(res, 'Site settings updated', settings);
  };
}
