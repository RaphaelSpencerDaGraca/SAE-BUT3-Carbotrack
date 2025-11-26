//backend\src\middlewares\auth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export interface JwtPayloadWithUser extends jwt.JwtPayload {
  user?: any;
}

// étendre Request pour TypeScript
declare module 'express-serve-static-core' {
  interface Request {
    user?: any;
  }
}

export const authenticateBearer = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant' });
  }
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayloadWithUser;
    // si ton token contient .user ou directement les champs, adapte ici
    req.user = (payload as any).user ?? payload;
    return next();
  } catch (err) {
    console.error('JWT verify error', err);
    return res.status(401).json({ error: 'Token invalide' });
  }
};
