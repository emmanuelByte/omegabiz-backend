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
  id: string;
  img: string;
  overview: string;
  description: string;
  what_you_learn: string[];
  course_curriculum: string[];
  take_away: string[];
  prerequisites: string[];
  price: {
    currency: string;
    price: number;
    discount: number;
    USD_NGN_RATE: number;
  };
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
    price: {
      type: {
        currency: String,
        price: Number,
        discount: Number,
        USD_NGN_RATE: Number,
      },
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Course = model<ICourse>('Course', courseSchema);

export default Course;
