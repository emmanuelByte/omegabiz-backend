import gravatar from 'gravatar';
import { hashPassword, comparePassword } from './../utils/hasher';
import { AuthRequest } from './../types/Payload';
import bcrypt from 'bcryptjs';
import HttpStatusCodes from 'http-status-codes';

import { Request, Response } from 'express';
import { check, validationResult } from 'express-validator/check';
import User from '../models/auth.model';
import { IUser } from '../models/auth.model';
import { generateToken } from '../middleware/auth.middlerware';
import payload from '../types/Payload';
import Course from '../../courses/models/Course';
import Mongoose from 'mongoose';

export class AuthService {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, name, phoneNumber } = req.body;

      let user: IUser = await User.findOne({ email });

      if (user) {
        return res.status(HttpStatusCodes.CONFLICT).json({
          errors: [
            {
              msg: 'User already exists',
            },
          ],
        });
      }

      const hashed = await hashPassword(password);
      // Build user object based on IUser
      const options: gravatar.Options = {
        s: '200',
        r: 'pg',
        d: 'mm',
      };

      const avatar = gravatar.url(email, options);

      const userFields = {
        email,
        password: hashed,
        name,
        phoneNumber,
        avatar,
      };

      user = new User(userFields);

      await user.save();
      res.status(HttpStatusCodes.CREATED).json(user);
    } catch (error) {
      console.error(error.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
    }
  }
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(HttpStatusCodes.NOT_FOUND)
          .json({ errors: [{ msg: 'Email Not Found' }] });
      }

      const isMatch = await comparePassword(password, user.password);

      if (!isMatch) {
        return res
          .status(HttpStatusCodes.UNAUTHORIZED)
          .json({ errors: [{ msg: 'Password MisMatch' }] });
      }
      const token = generateToken({ userId: user._id });

      return res.status(HttpStatusCodes.OK).json({ user, token });
    } catch (error) {
      console.error(error.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
    }
  }
  static async resetPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(HttpStatusCodes.NOT_FOUND)
          .json({ errors: [{ msg: 'User not found' }] });
      }
      const code = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
      user.isVerified = {
        code,
        status: false,
      };
      await user.save();

      //   TODO send email with reset password link
      res.status(HttpStatusCodes.OK).json({ user });
    } catch (error) {
      console.error(error.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
    }
  }
  static async verifyPassword(req: Request, res: Response) {
    try {
      const { code, email, password } = req.body;
      const user = await User.findOne({ email });
      console.log(user.isVerified, { code });
      if (!user) {
        return res
          .status(HttpStatusCodes.NOT_FOUND)
          .json({ errors: [{ msg: 'User not found' }] });
      }
      if (user.isVerified.status)
        return res
          .status(HttpStatusCodes.OK)
          .json({ message: 'User already verified' });

      if (!user.isVerified.status && user.isVerified.code !== Number(code)) {
        return res
          .status(HttpStatusCodes.NOT_FOUND)
          .json({ errors: [{ msg: 'Invalid code' }] });
      }
      const hashed = await hashPassword(password);
      user.password = hashed;
      user.isVerified = {
        status: true,
      };
      await user.save();
      const token = generateToken({ userId: user._id });
      return res.status(HttpStatusCodes.OK).json({ user, token });
    } catch (error) {
      console.error(error.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
    }
  }
  static async getUserDetail(req: AuthRequest, res: Response) {
    try {
      const user = await User.findById(req.userId).select('-password');
      if (!user) {
        return res.status(HttpStatusCodes.NOT_FOUND).json({
          errors: [{ msg: 'User not found' }],
        });
      }
      res.status(HttpStatusCodes.OK).json(user);
    } catch (error) {
      console.error(error.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
    }
  }
  static async updateUserDetail(req: AuthRequest, res: Response) {
    try {
      const { name, phoneNumber } = req.body;
      let user = await User.findById(req.userId);
      if (!user) {
        return res.status(HttpStatusCodes.NOT_FOUND).json({
          errors: [{ msg: 'User not found' }],
        });
      }
      user.name = name || user.name;
      user.phoneNumber = phoneNumber || user.phoneNumber;
      await user.save();
      res.status(HttpStatusCodes.OK).json(user);
    } catch (error) {
      console.error(error.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
    }
  }
  static async changeUserRole(req: AuthRequest, res: Response) {
    try {
      const { role } = req.body;
      let user = await User.findById(req.userId);
      if (!user) {
        return res.status(HttpStatusCodes.NOT_FOUND).json({
          errors: [{ msg: 'User not found' }],
        });
      }
      user.role = role || user.role;
      await user.save();
      res.status(HttpStatusCodes.OK).json(user);
    } catch (error) {
      console.error(error.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
    }
  }
  static async addCourse(req: AuthRequest, res: Response) {
    try {
      const { courseId } = req.params;
      if (!courseId)
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          errors: [{ msg: 'Course id is required' }],
        });

      const course = await Course.findById(courseId);
      if (!course)
        return res.status(HttpStatusCodes.NOT_FOUND).json({
          errors: [{ msg: 'Course not found' }],
        });

      let user = await User.findById(req.userId);
      if (user && user.enrolledCourses) {
        for (let i = 0; i < user.enrolledCourses.length; i++) {
          if (
            courseId.includes(
              user.enrolledCourses[i]?.courseId?.toString() || ''
            )
          ) {
            return res.status(HttpStatusCodes.BAD_REQUEST).json({
              errors: [{ msg: 'Course already added' }],
            });
          }
        }
      }

      if (!user) {
        return res.status(HttpStatusCodes.NOT_FOUND).json({
          errors: [{ msg: 'User not found' }],
        });
      }
      user.enrolledCourses.push({ courseId: courseId });
      await user.save();
      res.status(HttpStatusCodes.OK).json(user);
    } catch (error) {
      console.error(error.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
    }
  }
  static async removeCourse(req: AuthRequest, res: Response) {
    try {
      const { courseId } = req.params;
      if (!courseId)
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          errors: [{ msg: 'Course id is required' }],
        });

      const course = await Course.findById(courseId);
      if (!course)
        return res.status(HttpStatusCodes.NOT_FOUND).json({
          errors: [{ msg: 'Course not found' }],
        });

      let user = await User.findById(req.userId);
      if (!user) {
        return res.status(HttpStatusCodes.NOT_FOUND).json({
          errors: [{ msg: 'User not found' }],
        });
      }
      let courses = [];
      for (let i = 0; i < user.enrolledCourses.length; i++) {
        if (!courseId.includes(user.enrolledCourses[i]?.courseId?.toString())) {
          courses.push(user.enrolledCourses[i]);
        }
      }
      user.enrolledCourses = courses;
      await user.save();
      res.status(HttpStatusCodes.OK).json(user);
    } catch (error) {
      console.error(error.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
    }
  }
  static async payCourse(req: AuthRequest, res: Response) {
    try {
      const { courseId } = req.params;
      if (!courseId)
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          errors: [{ msg: 'Course id is required' }],
        });

      const course = await Course.findById(courseId);
      if (!course)
        return res.status(HttpStatusCodes.NOT_FOUND).json({
          errors: [{ msg: 'Course not found' }],
        });

      let user = await User.findById(req.userId);
      if (!user) {
        return res.status(HttpStatusCodes.NOT_FOUND).json({
          errors: [{ msg: 'User not found' }],
        });
      }
      for (let i = 0; i < user.enrolledCourses.length; i++) {
        if (courseId.includes(user.enrolledCourses[i]?.courseId?.toString()))
          user.enrolledCourses[i].paid = true;
      }
      await user.save();
      res.status(HttpStatusCodes.OK).json(user);
    } catch (error) {
      console.error(error.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
    }
  }

  static async getEnrolledCourses(req: AuthRequest, res: Response) {
    try {
      let user = await User.findById(req.userId);
      if (!user) {
        return res.status(HttpStatusCodes.NOT_FOUND).json({
          errors: [{ msg: 'User not found' }],
        });
      }
      // TODO add lookup aggregate to get course name
      const userWithCourses = await User.aggregate([
        {
          $match: { _id: Mongoose.Types.ObjectId(req.userId) },
        },
        {
          $lookup: {
            from: 'courses',
            localField: 'enrolledCourses.courseId',
            foreignField: '_id',
            as: 'enrolledCourses',
          },
        },

        {
          $replaceWith: {
            _id: '$_id',

            enrolledCourses: '$enrolledCourses',
          },
        },
      ]);
      res.status(HttpStatusCodes.OK).json(userWithCourses[0]);
    } catch (error) {
      console.error(error.message);
      res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).send('Server Error');
    }
  }
}
