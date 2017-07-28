import { Express } from "express";
import * as authController from './auth/auth';
import * as userController from './user/user';

module.exports.set = (express: Express) => {
    authController.init(express);
    userController.init(express);
};