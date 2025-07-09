import { UserModel, RefreshTokenModel } from '../models/User';
import { AuthUtils } from '../utils/auth';
import { UserRegistration, UserLogin, User, TokenPair } from '../types';

export class AuthService {
  /**
   * Register a new user
   */
  static async register(userData: UserRegistration): Promise<{ user: Omit<User, 'password'>; tokens: TokenPair }> {
    // Check if user already exists
    const existingUser = await UserModel.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await AuthUtils.hashPassword(userData.password);

    // Create user
    const user = await UserModel.create({
      ...userData,
      password: hashedPassword,
    });

    // Generate tokens
    const tokens = AuthUtils.generateTokenPair({
      userId: user.id,
      email: user.email,
    });

    // Store refresh token
    await RefreshTokenModel.store(tokens.refreshToken, user.id);

    return {
      user: UserModel.sanitizeUser(user),
      tokens,
    };
  }

  /**
   * Login user
   */
  static async login(credentials: UserLogin): Promise<{ user: Omit<User, 'password'>; tokens: TokenPair }> {
    // Find user
    const user = await UserModel.findByEmail(credentials.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await AuthUtils.comparePassword(credentials.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate tokens
    const tokens = AuthUtils.generateTokenPair({
      userId: user.id,
      email: user.email,
    });

    // Store refresh token
    await RefreshTokenModel.store(tokens.refreshToken, user.id);

    return {
      user: UserModel.sanitizeUser(user),
      tokens,
    };
  }

  /**
   * Refresh access token
   */
  static async refreshToken(refreshToken: string): Promise<TokenPair> {
    // Verify refresh token
    const decoded = AuthUtils.verifyRefreshToken(refreshToken);

    if (decoded.type !== 'refresh') {
      throw new Error('Invalid token type');
    }

    // Check if refresh token exists in storage
    const tokenExists = await RefreshTokenModel.exists(refreshToken);
    if (!tokenExists) {
      throw new Error('Invalid refresh token');
    }

    // Verify user still exists
    const user = await UserModel.findById(decoded.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Generate new tokens
    const newTokens = AuthUtils.generateTokenPair({
      userId: user.id,
      email: user.email,
    });

    // Remove old refresh token and store new one
    await RefreshTokenModel.remove(refreshToken);
    await RefreshTokenModel.store(newTokens.refreshToken, user.id);

    return newTokens;
  }

  /**
   * Logout user
   */
  static async logout(refreshToken: string): Promise<void> {
    await RefreshTokenModel.remove(refreshToken);
  }

  /**
   * Get user profile
   */
  static async getProfile(userId: string): Promise<Omit<User, 'password'>> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return UserModel.sanitizeUser(user);
  }
}
