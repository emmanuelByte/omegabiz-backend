import express from 'express';

import connectDB from '../config/database';
const list_endpoints = require('list_end_points');
import formData from 'express-form-data';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes';

const app = express();

// Connect to MongoDB
connectDB();

// Express configuration
app.set('port', process.env.PORT || 5000);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(formData.parse());
dotenv.config();
app.use(cors());

// Routes
app.use('/api/v1', router);

// @route   GET /
// @desc    Test Base API
// @access  Public
app.get('/', (_req, res) => {
  res.send('Server is running');
});

const port = app.get('port');
list_endpoints(app);
const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);

export default server;
