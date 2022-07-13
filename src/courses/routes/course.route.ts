import { Router } from 'express';
import { verifyAuth } from '../../auth/middleware/auth.middlerware';
import CourseController from '../controller/course.controller';

const courseRoute: Router = Router();

// @route   POST api/user
// @desc    Register user given their email and password, returns the token upon successful registration
// @access  Public
courseRoute.get('/all', CourseController.getAllCourses);
courseRoute.use(verifyAuth);
export default courseRoute;
