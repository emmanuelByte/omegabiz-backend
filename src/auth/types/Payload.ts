import { Request } from 'express';
import { IUser } from '../models/auth.model';

/**
 * Payload Object to be signed and verified by JWT. Used by the auth middleware to pass data to the request by token signing (jwt.sign) and token verification (jwt.verify).
 * @param userId:string
 */
type payload = { userId: string; user?: IUser };
export type AuthRequest = Request & payload;
export default payload;
