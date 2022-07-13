import { Document, Model, model, Schema } from 'mongoose';

/**
 * Interface to model the User Schema for TypeScript.
 * @param email:string
 * @param password:string
 * @param name:string
 * @param phoneNumber:string
 */
export interface IUser extends Document {
  email: string;
  password: string;
  avatar: string;
  name: string;
  phoneNumber: string;
  token: {
    access: string;
    refresh: string;
  };
  isVerified: {
    status: boolean;
    code?: number;
  };
  role?: string;
}
export enum UserRoles {
  ADMIN = 'admin',
  USER = 'user',
  MANAGER = 'manager',
}
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    token: {
      access: {
        type: String,
      },
      refresh: {
        type: String,
      },
    },
    isVerified: {
      status: {
        type: Boolean,
        default: false,
      },
      code: {
        type: Number,
      },
    },
    role: {
      type: String,
      enum: Object.values(UserRoles),
      default: UserRoles.USER,
    },
  },
  { timestamps: true }
);

const User = model<IUser>('User', userSchema);

export default User;
