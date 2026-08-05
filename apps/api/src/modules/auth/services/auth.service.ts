import { ObjectId } from 'mongodb';
import { mongoClient } from '../../../database/mongo.client.js';
import { AuthUtil } from '../../../core/utils/jwt.util.js';
import { AppError } from '../../../core/utils/app-error.js';
import { RegisterInput, LoginInput } from '@sellora/shared-validators';
import { UserRole, VendorStatus } from '@sellora/shared-types';

export class AuthService {
  private static getUsersCollection() {
    return mongoClient.getCollection('users');
  }

  private static getVendorsCollection() {
    return mongoClient.getCollection('vendors');
  }

  public static async register(input: RegisterInput) {
    const users = this.getUsersCollection();
    const existing = await users.findOne({ email: input.email });
    if (existing) {
      throw AppError.badRequest('An account with this email already exists');
    }

    const passwordHash = await AuthUtil.hashPassword(input.password);
    const userId = new ObjectId();
    let vendorId: string | undefined = undefined;

    if (input.role === 'SELLER') {
      const vendors = this.getVendorsCollection();
      const vId = new ObjectId();
      vendorId = vId.toString();

      await vendors.insertOne({
        _id: vId,
        ownerId: userId.toString(),
        storeName: input.storeName || `${input.name}'s Official Store`,
        slug: (input.storeName || `${input.name}-store`).toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        phone: '',
        email: input.email,
        status: VendorStatus.APPROVED,
        commissionRate: 5.0,
        balance: 0,
        address: { street: '', city: 'Dhaka', area: 'Central' },
        rating: 5.0,
        reviewCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    const userDoc = {
      _id: userId,
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role as UserRole,
      isEmailVerified: true,
      vendorId,
      addresses: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await users.insertOne(userDoc);

    const token = AuthUtil.generateToken({
      userId: userId.toString(),
      email: input.email,
      role: input.role as UserRole,
      vendorId,
    });

    return {
      user: {
        id: userId.toString(),
        name: input.name,
        email: input.email,
        role: input.role,
        vendorId,
        addresses: [],
      },
      token,
    };
  }

  public static async login(input: LoginInput) {
    const users = this.getUsersCollection();
    const user = await users.findOne({ email: input.email });
    if (!user) {
      throw AppError.unauthorized('Invalid email or password credentials');
    }

    const isPasswordValid = await AuthUtil.comparePassword(input.password, user.passwordHash);
    if (!isPasswordValid) {
      throw AppError.unauthorized('Invalid email or password credentials');
    }

    const token = AuthUtil.generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      vendorId: user.vendorId,
    });

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        vendorId: user.vendorId,
        addresses: user.addresses || [],
      },
      token,
    };
  }

  public static async getProfile(userId: string) {
    const users = this.getUsersCollection();
    const user = await users.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      throw AppError.notFound('User profile not found');
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      vendorId: user.vendorId,
      addresses: user.addresses || [],
      createdAt: user.createdAt,
    };
  }
}
