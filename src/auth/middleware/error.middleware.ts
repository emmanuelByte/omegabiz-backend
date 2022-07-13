import HttpStatusCodes from 'http-status-codes';
import { validationResult } from 'express-validator/check';
import { Request, Response, NextFunction } from 'express';

export const validateBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.params);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ errors: errors.array() });
  }
  next();
};
