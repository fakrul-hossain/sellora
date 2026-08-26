import { Request, Response } from 'express';
import { ProductService } from '../services/product.service.js';
import { ApiResponseBuilder } from '../utils/api-response.js';
import { createProductSchema, updateProductSchema } from '../validators/product.validators.js';

export class ProductController {
  public static list = async (req: Request, res: Response) => {
    const { category, search, vendorId } = req.query as Record<string, string>;
    const products = await ProductService.listProducts({ category, search, vendorId });
    return ApiResponseBuilder.success(res, 'Products fetched successfully', products);
  };

  public static getById = async (req: Request, res: Response) => {
    const product = await ProductService.getProductById(req.params.id);
    return ApiResponseBuilder.success(res, 'Product details fetched', product);
  };

  public static create = async (req: Request, res: Response) => {
    const vendorId = req.user!.vendorId || req.user!.userId;
    const validated = createProductSchema.parse(req.body);
    const product = await ProductService.createProduct(vendorId, validated);
    return ApiResponseBuilder.created(res, 'Product created successfully', product);
  };

  public static update = async (req: Request, res: Response) => {
    const vendorId = req.user!.vendorId || req.user!.userId;
    const validated = updateProductSchema.parse(req.body);
    const product = await ProductService.updateProduct(req.params.id, vendorId, validated);
    return ApiResponseBuilder.success(res, 'Product updated successfully', product);
  };

  public static delete = async (req: Request, res: Response) => {
    const vendorId = req.user!.vendorId || req.user!.userId;
    await ProductService.deleteProduct(req.params.id, vendorId);
    return ApiResponseBuilder.success(res, 'Product deleted successfully');
  };
}
