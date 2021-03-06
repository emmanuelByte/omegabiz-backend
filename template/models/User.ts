import { ICourse } from './../../src/courses/models/Course';
import { Document, Model, model, Schema } from 'mongoose';

/**
 * Interface to model the User Schema for TypeScript.
 * @param email:string
 * @param password:string
 * @param avatar:string
 */
export interface IUser extends Document {
  email: string;
  password: string;
  avatar: string;
  enrolledCourses: ICourse[];
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  enrolledCourses: [
    {
      id: {
        type: Schema.Types.ObjectId,
        ref: 'Course',
      },
      paid: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

const User = model<IUser>('User', userSchema);

export default User;
