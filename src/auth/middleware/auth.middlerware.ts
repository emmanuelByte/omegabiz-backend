import { AuthRequest } from './../types/Payload';
import config from 'config';
import { Response, NextFunction, Request } from 'express';
import HttpStatusCodes from 'http-status-codes';
import jwt from 'jsonwebtoken';

import Payload from '../types/Payload';
import User, { UserRoles } from '../models/auth.model';

export async function verifyAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  // Get token from header
  const token = req.headers.authorization?.split(' ')[1];

  // Check if no token
  if (!token) {
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ msg: 'No token, authorization denied' });
  }
  // Verify token
  try {
    const payload: Payload | any = jwt.verify(token, config.get('jwtSecret'));
    const user = await User.findById(payload.userId);
    if (!user)
      return res
        .status(HttpStatusCodes.UNAUTHORIZED)
        .json({ msg: 'Bad Token; Can Find User 😔' });

    req.userId = payload.userId;
    req.user = user;
    next();
  } catch (err) {
    res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ msg: 'Token is not valid' });
  }
}
export function generateToken(payload: Payload) {
  return jwt.sign({ userId: payload.userId }, config.get('jwtSecret'), {
    expiresIn: config.get('jwtExpiration'),
  });
}

// ROLES
export function isAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  const { user, userId } = req;
  if (user.role !== UserRoles.ADMIN) {
    return res
      .status(HttpStatusCodes.FORBIDDEN)
      .json({ msg: 'You are not authorized to perform this action' });
  }
  next();
}
