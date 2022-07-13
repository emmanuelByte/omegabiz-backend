import { Document, Model, model, Schema } from 'mongoose';
import { ICourse } from 'src/courses/models/Course';

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
  enrolledCourses: { courseId: ICourse['_id']; paid?: boolean }[];
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
    enrolledCourses: [
      {
        courseId: {
          type: Schema.Types.ObjectId,
          ref: 'Course',
        },
        paid: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: true }
);

const User = model<IUser>('User', userSchema);

export default User;
