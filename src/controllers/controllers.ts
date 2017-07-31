import { Express } from "express";
import authController from './auth/auth';
import userController from './user/user';
import feedbackController from './feedback/feedback';
import userDataController from '../data/datacontroller/user.datacontroller';
import feedbackDataController from '../data/datacontroller/feedback.datacontroller';
import databaseManager from '../data/database/database.manager';

module.exports.set = (express: Express) => {
    authController.register(express);
    feedbackController(feedbackDataController(databaseManager)).register(express);
    userController(userDataController(databaseManager)).register(express);
};