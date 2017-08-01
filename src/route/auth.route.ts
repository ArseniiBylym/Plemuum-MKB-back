import { Express, Request, Response } from 'express';
import AuthController from "../controller/auth/auth.controller";

export default (express: Express, authController: AuthController) => {
    express.route('/login').get(authController.saveUser.bind(authController));
}