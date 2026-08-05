import { Request, Response } from 'express';
import { VendorService } from '../services/vendor.service.js';
import { ApiResponseBuilder } from '../../../core/utils/api-response.js';

export class VendorController {
  public static getProfile = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const vendor = await VendorService.getVendorByUserId(userId);
    return ApiResponseBuilder.success(res, 'Vendor profile fetched', vendor);
  };

  public static getAnalytics = async (req: Request, res: Response) => {
    const vendorId = req.user!.vendorId || req.user!.userId;
    const analytics = await VendorService.getVendorAnalytics(vendorId);
    return ApiResponseBuilder.success(res, 'Vendor analytics fetched', analytics);
  };

  public static updateProfile = async (req: Request, res: Response) => {
    const vendorId = req.user!.vendorId || req.user!.userId;
    const vendor = await VendorService.updateVendorProfile(vendorId, req.body);
    return ApiResponseBuilder.success(res, 'Vendor profile updated', vendor);
  };
}
