import { NextFunction, Request, Response } from 'express';
import Course, { ICourse } from '../models/Course';

export default class CourseService {
  static async getAllCourses(req: Request, res: Response, next: NextFunction) {
    const courses = await Course.find();
    return res.status(200).json(courses);
  }
  static async getCourseById(req: Request, res: Response, next: NextFunction) {
    const course = await Course.findOne({ id: req.params.courseId });
    return res.status(200).json(course);
  }
  static async createCourse(req: Request, res: Response, next: NextFunction) {
    const course = new Course(req.body);
    await course.save();
    return res.status(201).json(course);
  }
  static async updateCourse(req: Request, res: Response, next: NextFunction) {
    const course = await Course.findOneAndUpdate(
      { id: req.params.courseId },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    return res.status(200).json(course);
  }
  static async deleteCourse(req: Request, res: Response, next: NextFunction) {
    await Course.findOneAndDelete({ id: req.params.courseId });
    return res.status(200).json({ message: 'Course deleted' });
  }
}
