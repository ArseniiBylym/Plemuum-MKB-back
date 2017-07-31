

import FeedbackDataController from "./feedback.datacontroller";
import DatabaseManager from '../database/database.manager';
import UserDataController from "./user.datacontroller";
import * as DatabaseFactory from '../database/database.factory';

let feedbackDataControllerInstance: FeedbackDataController;
let userDataControllerInstance: UserDataController;

/* #########################     PUBLIC      ########################## */

const getFeedbackDataController = (): FeedbackDataController => createFeedbackDataController(DatabaseFactory.getDatabaseManager());
const getUserDataController = (): UserDataController => createUserDataController(DatabaseFactory.getDatabaseManager());

/* #########################     PRIVATE      ########################## */

const createFeedbackDataController = (databaseManager: DatabaseManager): FeedbackDataController => {
    if (!feedbackDataControllerInstance) {
        feedbackDataControllerInstance = new FeedbackDataController(databaseManager);
    }
    return feedbackDataControllerInstance;
}

const createUserDataController = (databaseManager: DatabaseManager): UserDataController => {
    if (!userDataControllerInstance) {
        userDataControllerInstance = new UserDataController(databaseManager);
    }
    return userDataControllerInstance;
}

export { getFeedbackDataController, getUserDataController }