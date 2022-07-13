import { NextFunction, Request, Response } from 'express';
import { ICourse } from '../models/Course';
import CourseService from '../service/course.service';

export default class CourseController {
  static async getAllCourses(req: Request, res: Response, next: NextFunction) {
    return await CourseService.getAllCourses(req, res, next);
  }
  static async getCourseById(req: Request, res: Response, next: NextFunction) {
    return await CourseService.getCourseById(req, res, next);
  }
  static async createCourse(req: Request, res: Response, next: NextFunction) {
    return await CourseService.createCourse(req, res, next);
  }
  static async updateCourse(req: Request, res: Response, next: NextFunction) {
    return await CourseService.updateCourse(req, res, next);
  }
  static async deleteCourse(req: Request, res: Response, next: NextFunction) {
    return await CourseService.deleteCourse(req, res, next);
  }
}
