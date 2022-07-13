import { Router } from 'express';
import courseRoute from '../courses/routes/course.route';
import authRoutes from '../auth/routes/auth.route';

const router = Router();

router.use('/auth', authRoutes);
router.use('/course', courseRoute);
// @route   GET /
// @desc    Test Base API
// @access  Public
router.get('/', (_req, res) => {
  res.send('API Running');
});
export default router;
