import { ICourse } from '../models/Course';
import CourseService from '../service/course.service';

export default class CourseController {
  static async getAllCourses(): Promise<ICourse[]> {
    return await CourseService.getAllCourses();
  }
}
