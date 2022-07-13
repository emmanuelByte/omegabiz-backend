import Course, { ICourse } from '../models/Course';

export default class CourseService {
  static async getAllCourses(): Promise<ICourse[]> {
    return await Course.find();
  }
}
