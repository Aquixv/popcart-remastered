import jwt from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express';
import User, { IUser } from '../models/Schema'; 

export interface AuthRequest extends Omit<Request, 'user'> {
  user?: IUser | null;
}

interface DecodedToken {
  id: string;
  iat?: number;
  exp?: number;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.API_SECRET as string) as DecodedToken;

      req.user = await User.findById(decoded.id).select('-password');

      return next(); 

    } catch (error: any) {
      console.error("BOUNCER ERROR:", error.message); 
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
   return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next(); 
  } else {
    res.status(403).json({ message: "Access denied. Admin only." });
  }
};

export const isSeller = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user && (req.user.role === 'seller' || req.user.role === 'admin')) {
    next(); 
  } else {
    res.status(403).json({ message: "Access denied. Seller only." });
  }
};