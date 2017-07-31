import { Express } from "express";
import authController from './auth/auth.controller';
import userController from './user/user.controller';
import feedbackController from './feedback/feedback.controller';
import userDataController from '../data/datacontroller/user.datacontroller';
import feedbackDataController from '../data/datacontroller/feedback.datacontroller';
import databaseManager from '../data/database/database.manager';
import * as ControllerFactory from '../factory/controller.factory'

module.exports.set = (express: Express) => {
    ControllerFactory.getAuthController().register(express);
    ControllerFactory.getFeedbackController().register(express);
    ControllerFactory.getUserController().register(express);
};