import FeedbackDataController from "../data/datacontroller/feedback.datacontroller";
import DatabaseManager from '../data/database/database.manager';
import UserDataController from "../data/datacontroller/user.datacontroller";
import * as DatabaseFactory from './database.factory';
import RequestDataController from "../data/datacontroller/request.datacontroller";
import TagDataController from "../data/datacontroller/tag.datacontroller";

let feedbackDataControllerInstance: FeedbackDataController;
let userDataControllerInstance: UserDataController;
let requestDataController: RequestDataController;
let tagDataController: TagDataController;

/* #########################     PUBLIC      ########################## */

let getFeedbackDataController = (): FeedbackDataController => createFeedbackDataController(DatabaseFactory.getDatabaseManager());
let getUserDataController = (): UserDataController => createUserDataController(DatabaseFactory.getDatabaseManager());
let getRequestDataController = (): RequestDataController => createRequestDataController(DatabaseFactory.getDatabaseManager());
let getTagDataController = (): TagDataController => createTagDataController(DatabaseFactory.getDatabaseManager());

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
const createTagDataController = (databaseManager: DatabaseManager): TagDataController => {
    if (!tagDataController) {
        tagDataController = new TagDataController(databaseManager);
    }
    return tagDataController;
};

export { getFeedbackDataController, getUserDataController, getRequestDataController, getTagDataController }