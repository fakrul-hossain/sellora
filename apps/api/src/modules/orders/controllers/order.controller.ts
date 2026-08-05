import { Request, Response } from 'express';
import { OrderService } from '../services/order.service.js';
import { ApiResponseBuilder } from '../../../core/utils/api-response.js';
import { createOrderSchema, updateOrderStatusSchema } from '@sellora/shared-validators';

export class OrderController {
  public static create = async (req: Request, res: Response) => {
    const customerId = req.user!.userId;
    const customerEmail = req.user!.email;
    const validated = createOrderSchema.parse(req.body);
    const order = await OrderService.createOrder(customerId, req.body.shippingAddress.fullName || 'Customer', customerEmail, validated);
    return ApiResponseBuilder.created(res, 'Order placed successfully', order);
  };

  public static getMyOrders = async (req: Request, res: Response) => {
    const customerId = req.user!.userId;
    const orders = await OrderService.getCustomerOrders(customerId);
    return ApiResponseBuilder.success(res, 'Customer orders fetched', orders);
  };

  public static getVendorOrders = async (req: Request, res: Response) => {
    const vendorId = req.user!.vendorId || req.user!.userId;
    const orders = await OrderService.getVendorOrders(vendorId);
    return ApiResponseBuilder.success(res, 'Vendor orders fetched', orders);
  };

  public static getAllOrders = async (req: Request, res: Response) => {
    const orders = await OrderService.getAllOrders();
    return ApiResponseBuilder.success(res, 'All platform orders fetched', orders);
  };

  public static getById = async (req: Request, res: Response) => {
    const order = await OrderService.getOrderById(req.params.id);
    return ApiResponseBuilder.success(res, 'Order details fetched', order);
  };

  public static updateStatus = async (req: Request, res: Response) => {
    const validated = updateOrderStatusSchema.parse(req.body);
    const order = await OrderService.updateOrderStatus(req.params.id, validated);
    return ApiResponseBuilder.success(res, 'Order status updated', order);
  };
}
