
import FeedbackDataController from "../data/datacontroller/feedback.datacontroller";
import DatabaseManager from '../data/database/database.manager';
import UserDataController from "../data/datacontroller/user.datacontroller";
import * as DatabaseFactory from './database.factory';
import RequestDataController from "../data/datacontroller/request.datacontroller";

let feedbackDataControllerInstance: FeedbackDataController;
let userDataControllerInstance: UserDataController;
let requestDataController: RequestDataController;

/* #########################     PUBLIC      ########################## */

let getFeedbackDataController = (): FeedbackDataController => createFeedbackDataController(DatabaseFactory.getDatabaseManager());
let getUserDataController = (): UserDataController => createUserDataController(DatabaseFactory.getDatabaseManager());
let getRequestDataController = (): RequestDataController => createRequestDataController(DatabaseFactory.getDatabaseManager());

/* #########################     PRIVATE      ########################## */

const createFeedbackDataController = (databaseManager: DatabaseManager): FeedbackDataController => {
    if (!feedbackDataControllerInstance) {
        feedbackDataControllerInstance = new FeedbackDataController(databaseManager);
    }
    return feedbackDataControllerInstance;
};

const createUserDataController = (databaseManager: DatabaseManager): UserDataController => {
    if (!userDataControllerInstance) {
        userDataControllerInstance = new UserDataController(databaseManager);
    }
    return userDataControllerInstance;
};

const createRequestDataController = (databaseManager: DatabaseManager): RequestDataController => {
    if (!requestDataController) {
        requestDataController = new RequestDataController(databaseManager);
    }
    return requestDataController;
};

export { getFeedbackDataController, getUserDataController, getRequestDataController }