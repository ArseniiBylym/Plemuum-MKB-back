import { Express } from "express";
import authController from './auth/auth';
import userController from './user/user';
import userDataController from '../data/datacontroller/user.datacontroller';
import databaseManager from '../data/database/database.manager';

module.exports.set = (express: Express) => {
    authController.register(express);
    userController(userDataController(databaseManager)).register(express);
};