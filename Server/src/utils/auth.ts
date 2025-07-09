import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';
import config from '../config';
import { JwtPayload, TokenPair } from '../types';

export class AuthUtils {
  /**
   * Hash password using bcrypt
   */
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, config.security.bcryptRounds);
  }

  /**
   * Compare password with hash
   */
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /**
   * Generate access token
   */
  static generateAccessToken(payload: Omit<JwtPayload, 'type'>): string {
    const tokenPayload = { ...payload, type: 'access' as const };
    const options: SignOptions = { expiresIn: config.jwt.expiresIn as any };
    return jwt.sign(tokenPayload, config.jwt.secret, options);
  }

  /**
   * Generate refresh token
   */
  static generateRefreshToken(payload: Omit<JwtPayload, 'type'>): string {
    const tokenPayload = { ...payload, type: 'refresh' as const };
    const options: SignOptions = { expiresIn: config.jwt.refreshExpiresIn as any };
    return jwt.sign(tokenPayload, config.jwt.refreshSecret, options);
  }

  /**
   * Generate both access and refresh tokens
   */
  static generateTokenPair(payload: Omit<JwtPayload, 'type'>): TokenPair {
    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
    };
  }

  /**
   * Verify access token
   */
  static verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, config.jwt.secret) as JwtPayload;
  }

  /**
   * Verify refresh token
   */
  static verifyRefreshToken(token: string): JwtPayload {
    return jwt.verify(token, config.jwt.refreshSecret) as JwtPayload;
  }

  /**
   * Extract token from Authorization header
   */
  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
}
