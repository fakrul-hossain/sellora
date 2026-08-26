import { UserRepository } from '../models/user.repository.js';
import { VendorRepository } from '../models/vendor.repository.js';
import { AuthUtil } from '../utils/jwt.util.js';
import { AppError } from '../utils/app-error.js';
import { RegisterInput, LoginInput } from '../validators/auth.validators.js';
import { UserRole } from '../types/enums.types.js';

export class AuthService {
  public static async register(input: RegisterInput) {
    const existing = await UserRepository.findByEmail(input.email);
    if (existing) {
      throw AppError.badRequest('An account with this email already exists');
    }

    const passwordHash = await AuthUtil.hashPassword(input.password);

    const userRow = await UserRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
    });

    let vendorId: string | undefined = undefined;

    if (input.role === 'SELLER') {
      const storeName = input.storeName || `${input.name}'s Official Store`;
      const slug = (input.storeName || `${input.name}-store`)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-');

      const vendorRow = await VendorRepository.create({
        ownerId: userRow.id,
        storeName,
        slug,
        email: input.email,
      });

      vendorId = String(vendorRow.id);
      await UserRepository.updateVendorId(userRow.id, vendorId);
    }

    const userIdStr = String(userRow.id);

    const token = AuthUtil.generateToken({
      userId: userIdStr,
      email: input.email,
      role: input.role as UserRole,
      vendorId,
    });

    return {
      user: {
        id: userIdStr,
        name: userRow.name,
        email: userRow.email,
        role: userRow.role,
        vendorId,
        addresses: [],
      },
      token,
    };
  }

  public static async login(input: LoginInput) {
    const user = await UserRepository.findByEmail(input.email);
    if (!user) {
      throw AppError.unauthorized('Invalid email or password credentials');
    }

    const isPasswordValid = await AuthUtil.comparePassword(input.password, user.password_hash);
    if (!isPasswordValid) {
      throw AppError.unauthorized('Invalid email or password credentials');
    }

    const userIdStr = String(user.id);
    const addresses = await UserRepository.getUserAddresses(user.id);

    const token = AuthUtil.generateToken({
      userId: userIdStr,
      email: user.email,
      role: user.role as UserRole,
      vendorId: user.vendor_id,
    });

    return {
      user: {
        id: userIdStr,
        name: user.name,
        email: user.email,
        role: user.role,
        vendorId: user.vendor_id,
        addresses,
      },
      token,
    };
  }

  public static async getProfile(userId: string) {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw AppError.notFound('User profile not found');
    }

    const addresses = await UserRepository.getUserAddresses(user.id);

    return {
      id: String(user.id),
      name: user.name,
      email: user.email,
      role: user.role,
      vendorId: user.vendor_id,
      addresses,
      createdAt: user.created_at,
    };
  }
}
