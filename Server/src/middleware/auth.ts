import { Request, Response, NextFunction } from 'express';
import { AuthUtils } from '../utils/auth';
import { ResponseUtils } from '../utils/response';
import { AuthenticatedRequest, JwtPayload } from '../types';

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = AuthUtils.extractTokenFromHeader(authHeader);

    if (!token) {
      res.status(401).json(ResponseUtils.error('Access token required'));
      return;
    }

    const decoded = AuthUtils.verifyAccessToken(token) as JwtPayload;

    if (decoded.type !== 'access') {
      res.status(401).json(ResponseUtils.error('Invalid token type'));
      return;
    }

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };

    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === 'TokenExpiredError') {
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
