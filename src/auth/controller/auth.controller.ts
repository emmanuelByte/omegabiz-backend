import { UserRoles } from './../models/auth.model';
import { AuthRequest } from './../types/Payload';
import { Request, Response } from 'express';
import payload from '../types/Payload';
import { AuthService } from './../service/auth.service';
class AuthController {
  constructor() {}
  static async register(req: Request, res: Response) {
    try {
      await AuthService.register(req, res);
    } catch (error) {}
  }
  static async login(req: Request, res: Response) {
    try {
      await AuthService.login(req, res);
    } catch (error) {}
  }
  static async resetPassword(req: Request, res: Response) {
    try {
      await AuthService.resetPassword(req, res);
    } catch (error) {}
  }
  static async verifyPassword(req: Request, res: Response) {
    try {
      await AuthService.verifyPassword(req, res);
    } catch (error) {}
  }
  static async getUserDetail(req: AuthRequest, res: Response) {
    try {
      await AuthService.getUserDetail(req, res);
    } catch (error) {}
  }
  static async updateUserDetail(req: AuthRequest, res: Response) {
    try {
      await AuthService.updateUserDetail(req, res);
    } catch (error) {}
  }
  static async changeUserRole(req: AuthRequest, res: Response) {
    try {
      await AuthService.changeUserRole(req, res);
    } catch (error) {}
  }
  static async addCourseToUser(req: AuthRequest, res: Response) {
    try {
      await AuthService.addCourse(req, res);
    } catch (error) {}
  }
  static async removeCourseFromUser(req: AuthRequest, res: Response) {
    try {
      await AuthService.removeCourse(req, res);
    } catch (error) {}
  }
  static async getAllCourses(req: AuthRequest, res: Response) {
    try {
      await AuthService.getEnrolledCourses(req, res);
    } catch (error) {}
  }
  static async payForCourse(req: AuthRequest, res: Response) {
    try {
      await AuthService.payCourse(req, res);
    } catch (error) {}
  }
}
export default AuthController;
