import { IUser } from './../../auth/models/auth.model';
import { Document, Model, model, Schema } from 'mongoose';

/**
 * Interface to model the User Schema for TypeScript.
 * @param email:string
 * @param password:string
 * @param avatar:string
 */
export interface ICourse extends Document {
  name: string;
  description: string;
  students: IUser[];
  overview: string;
  what_you_learn: string[];
  course_curriculum: string[];
  prerequisites: string[];
  take_away: string[];
  price: Array<string | number>;
}

const courseSchema = new Schema<ICourse>(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    students: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    overview: {
      type: String,
      required: true,
    },
    what_you_learn: {
      type: [String],
      required: true,
    },
    course_curriculum: {
      type: [String],
      required: true,
    },
    prerequisites: {
      type: [String],
      required: true,
    },
    take_away: {
      type: [String],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Course = model<ICourse>('Course', courseSchema);

export default Course;
