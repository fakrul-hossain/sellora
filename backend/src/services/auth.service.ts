import { UserRepository } from '../models/user.repository.js';
import { VendorRepository } from '../models/vendor.repository.js';
import { AuthUtil } from '../utils/jwt.util.js';
import { AppError } from '../utils/app-error.js';
import { RegisterInput, LoginInput } from '../validators/auth.validators.js';
import { UserRole } from '../types/enums.types.js';

/**
 * Authentication Service
 * Handles user registration, password verification, login, and profile retrieval.
 */
export class AuthService {
  /**
   * Register a new user (Customer or Seller/Store Owner)
   */
  public static async register(input: RegisterInput) {
    // 1. Check if an account already exists with this email
    const existing = await UserRepository.findByEmail(input.email);
    if (existing) {
      throw AppError.badRequest('An account with this email already exists');
    }

    // 2. Hash the plain text password securely with bcrypt
    const passwordHash = await AuthUtil.hashPassword(input.password);

    // 3. Save the new user record in the MySQL "users" table
    const userRow = await UserRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
    });

    let vendorId: string | undefined = undefined;

    // 4. If the user is registering as a Store Owner (SELLER), create their store
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
      // Link the new vendor store ID back to the user record
      await UserRepository.updateVendorId(userRow.id, vendorId);
    }

    const userIdStr = String(userRow.id);

    // 5. Generate a JWT authentication token so the user is logged in immediately
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

  /**
   * Authenticate user login credentials
   */
  public static async login(input: LoginInput) {
    // 1. Find the user by their email address
    const user = await UserRepository.findByEmail(input.email);
    if (!user) {
      throw AppError.unauthorized('Invalid email or password credentials');
    }

    // 2. Compare the provided password against the bcrypt hash stored in the database
    const isPasswordValid = await AuthUtil.comparePassword(input.password, user.password_hash);
    if (!isPasswordValid) {
      throw AppError.unauthorized('Invalid email or password credentials');
    }

    const userIdStr = String(user.id);
    // 3. Fetch any saved delivery addresses
    const addresses = await UserRepository.getUserAddresses(user.id);

    // 4. Generate JWT access token with role information
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

  /**
   * Fetch current user profile details
   */
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
