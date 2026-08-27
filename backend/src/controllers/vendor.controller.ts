import { Request, Response } from 'express';
import { VendorService } from '../services/vendor.service.js';
import { ApiResponseBuilder } from '../utils/api-response.js';

export class VendorController {
  public static getProfile = async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const vendor = await VendorService.getVendorByUserId(userId);
    return ApiResponseBuilder.success(res, 'Vendor profile fetched', vendor);
  };

  public static getAnalytics = async (req: Request, res: Response) => {
    const vendorProfile = await VendorService.getVendorByUserId(req.user!.userId);
    const analytics = await VendorService.getVendorAnalytics(vendorProfile.id);
    return ApiResponseBuilder.success(res, 'Vendor analytics fetched', analytics);
  };

  public static updateProfile = async (req: Request, res: Response) => {
    const vendorProfile = await VendorService.getVendorByUserId(req.user!.userId);
    const vendor = await VendorService.updateVendorProfile(vendorProfile.id, req.body);
    return ApiResponseBuilder.success(res, 'Vendor profile updated', vendor);
  };

  public static createProduct = async (req: Request, res: Response) => {
    const vendorProfile = await VendorService.getVendorByUserId(req.user!.userId);
    const product = await VendorService.createProduct(vendorProfile.id, req.body);
    return ApiResponseBuilder.created(res, 'Product created successfully', product);
  };

  public static updateProduct = async (req: Request, res: Response) => {
    const vendorProfile = await VendorService.getVendorByUserId(req.user!.userId);
    const updated = await VendorService.updateProduct(req.params.id, vendorProfile.id, req.body);
    return ApiResponseBuilder.success(res, 'Product updated successfully', updated);
  };

  public static deleteProduct = async (req: Request, res: Response) => {
    const vendorProfile = await VendorService.getVendorByUserId(req.user!.userId);
    await VendorService.deleteProduct(req.params.id, vendorProfile.id);
    return ApiResponseBuilder.success(res, 'Product deleted successfully');
  };

  public static updateStock = async (req: Request, res: Response) => {
    const vendorProfile = await VendorService.getVendorByUserId(req.user!.userId);
    const { stock } = req.body;
    const result = await VendorService.updateStock(req.params.productId, vendorProfile.id, Number(stock));
    return ApiResponseBuilder.success(res, 'Stock updated successfully', result);
  };

  public static requestWithdrawal = async (req: Request, res: Response) => {
    const vendorProfile = await VendorService.getVendorByUserId(req.user!.userId);
    const { amount, paymentMethod, accountDetails } = req.body;
    const withdrawal = await VendorService.requestWithdrawal(vendorProfile.id, Number(amount), paymentMethod, accountDetails);
    return ApiResponseBuilder.created(res, 'Withdrawal request submitted successfully', withdrawal);
  };

  public static listWithdrawals = async (req: Request, res: Response) => {
    const vendorProfile = await VendorService.getVendorByUserId(req.user!.userId);
    const list = await VendorService.listWithdrawals(vendorProfile.id);
    return ApiResponseBuilder.success(res, 'Withdrawal requests fetched', list);
  };

  public static getPublicStore = async (req: Request, res: Response) => {
    const storeData = await VendorService.getPublicStore(req.params.id);
    return ApiResponseBuilder.success(res, 'Vendor store details fetched', storeData);
  };
}
