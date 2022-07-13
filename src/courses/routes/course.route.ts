import { validateBody } from './../../auth/middleware/error.middleware';
import { Router } from 'express';
import { verifyAuth } from '../../auth/middleware/auth.middlerware';
import CourseController from '../controller/course.controller';
import { check } from 'express-validator/check';

const courseRoute: Router = Router();

// @route   POST api/user
// @desc    Register user given their email and password, returns the token upon successful registration
// @access  Public
courseRoute.get('/all', CourseController.getAllCourses);
courseRoute.get(
  '/:id',
  [check('id', 'Please include a valid id').not().isEmpty()],
  CourseController.getCourseById
);
courseRoute.use(verifyAuth);
courseRoute.post(
  '/',
  [
    check('name', 'Please enter your name').not().isEmpty(),
    check('description', 'Please enter your description').not().isEmpty(),
    check('price', 'Please enter your price').not().isEmpty(),
    // check('image', 'Please enter your image').not().isEmpty(),
  ],
  validateBody,
  CourseController.createCourse
);
courseRoute.put(
  '/:id',
  [
    check('id', 'Please include a valid id').not().isEmpty(),
    // check('name', 'Please enter your name').not().isEmpty(),

    // check('description', 'Please enter your description').not().isEmpty(),
    // check('price', 'Please enter your price').not().isEmpty(),
    // check('duration', 'Please enter your duration').not().isEmpty(),
    // check('image', 'Please enter your image').not().isEmpty(),
  ],
  CourseController.updateCourse
);
courseRoute.delete(
  '/:id',
  [check('id', 'Please include a valid id').not().isEmpty()],
  CourseController.deleteCourse
);

export default courseRoute;
