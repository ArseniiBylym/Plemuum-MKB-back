import { Express } from "express";
import * as authController from './auth/auth';

module.exports.set = (express: Express) => {
    authController.init(express);
};