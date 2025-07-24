import { Request, Response, NextFunction } from 'express';
import { AuthUtils } from '../utils/auth';
import { ResponseUtils } from '../utils/response';
import { AuthenticatedRequest, JwtPayload } from '../types';

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    console.log('🍪 All cookies received:', req.cookies);
    
    // Try to get token from cookie first, then fallback to Authorization header
    const token = req.cookies?.accessToken || AuthUtils.extractTokenFromHeader(req.headers.authorization);
    
    console.log('🎫 Access token found:', token ? 'YES' : 'NO');
    console.log('🎫 Token preview:', token ? token.substring(0, 20) + '...' : 'None');

    if (!token) {
      res.status(401).json(ResponseUtils.error('Access token required'));
      return;
    }

    const decoded = AuthUtils.verifyAccessToken(token) as JwtPayload;
    console.log('✅ Token decoded successfully:', { userId: decoded.userId, email: decoded.email });

    if (decoded.type !== 'access') {
      console.log('❌ Invalid token type:', decoded.type);
      res.status(401).json(ResponseUtils.error('Invalid token type'));
      return;
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    console.log('✅ Authentication successful for user:', decoded.userId);
    next();
  } catch (error) {
    console.log('❌ Authentication error:', error);
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
        console.log('❌ Token expired');
        res.status(401).json(ResponseUtils.error('Token expired'));
        return;
      }
      if (error.name === 'JsonWebTokenError') {
        res.status(401).json(ResponseUtils.error('Invalid token'));
        return;
      }
    }
    res.status(401).json(ResponseUtils.error('Authentication failed'));
  }
};
