import { UserRoles } from './../models/auth.model';
import { validateBody } from './../middleware/error.middleware';
import { Router } from 'express';
import { check } from 'express-validator/check';

import AuthController from '../controller/auth.controller';
import { verifyAuth } from '../middleware/auth.middlerware';

const authRoutes: Router = Router();

/** @route   POST api/register
 * @desc    Register user given their email,name,phoneNumber and password, returns the token upon successful registration
 * @access  Public
 */
authRoutes.post(
  '/register',
  [
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
    check('name', 'Please enter your name').not().isEmpty(),
    check('phoneNumber', 'Please enter your phoneNumber').not().isEmpty(),
  ],
  validateBody,
  AuthController.register
);
authRoutes.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  validateBody,
  AuthController.login
);
authRoutes.post(
  '/reset-password',
  [check('email', 'Please include a valid email').isEmail()],
  validateBody,
  AuthController.resetPassword
);
authRoutes.post(
  '/verify-password',
  [
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({
      min: 6,
    }),
    check('code', 'Please enter a valid code').not().isEmpty().isNumeric(),
  ],
  validateBody,
  AuthController.verifyPassword
);
// @access  Private Routes
authRoutes.use(verifyAuth);
authRoutes.get('/user', AuthController.getUserDetail);
authRoutes.put('/user', AuthController.updateUserDetail);

authRoutes.put(
  '/role',
  [
    check('role', 'Please enter a valid role')
      .not()
      .isEmpty()
      .isIn(Object.values(UserRoles))
      .withMessage(`hint: ${Object.values(UserRoles)}`),
  ],
  validateBody,
  AuthController.changeUserRole
);
authRoutes.post('/addCourse/:courseId', AuthController.addCourseToUser);
authRoutes.post('/removeCourse/:courseId', AuthController.removeCourseFromUser);
authRoutes.get('/courses', AuthController.getAllCourses);
authRoutes.post('/payForCourse/:courseId', AuthController.payForCourse);

export default authRoutes;
