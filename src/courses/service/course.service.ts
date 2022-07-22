import { NextFunction, Request, Response } from 'express';
import Course, { ICourse } from '../models/Course';
import { courses } from './courses';

export default class CourseService {
  static async getAllCourses(req: Request, res: Response, next: NextFunction) {
    const courses = await Course.find();
    return res.status(200).json(courses);
  }
  static async getCourseById(req: Request, res: Response, next: NextFunction) {
    console.log(req.params);
    const course = await Course.findOne({ id: req.params.id });
    return res.status(200).json(course);
  }
  static async createCourse(req: Request, res: Response, next: NextFunction) {
    const c: ICourse[] = courses.map((course) => {
      const newCourse = new Course(course);
      newCourse.save();
      return newCourse;
    });
    // const course = new Course(req.body);
    // await course.save();
    return res.status(201).json(c);
  }
  static async updateCourse(req: Request, res: Response, next: NextFunction) {
    const course = await Course.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    return res.status(200).json(course);
  }
  static async deleteCourse(req: Request, res: Response, next: NextFunction) {
    await Course.findOneAndDelete({ id: req.params.id });
    return res.status(200).json({ message: 'Course deleted' });
  }
}
