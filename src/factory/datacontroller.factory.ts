import FeedbackDataController from "../data/datacontroller/feedback.datacontroller";
import DatabaseManager from '../data/database/database.manager';
import UserDataController from "../data/datacontroller/user.datacontroller";
import * as DatabaseFactory from './database.factory';
import RequestDataController from "../data/datacontroller/request.datacontroller";
import TagDataController from "../data/datacontroller/tag.datacontroller";
import ResetPasswordDataController from "../data/datacontroller/resetpassword.datacontroller";
import OrganizationDataController from "../data/datacontroller/organization.datacontroller";

let feedbackDataControllerInstance: FeedbackDataController;
let userDataControllerInstance: UserDataController;
let requestDataController: RequestDataController;
let tagDataController: TagDataController;
let resetPasswordDataController: ResetPasswordDataController;
let organizationDataController: OrganizationDataController;

/* #########################     PUBLIC      ########################## */

let getFeedbackDataController = (): FeedbackDataController => createDataController(
    feedbackDataControllerInstance,
    (databaseManager: DatabaseManager) => new FeedbackDataController(databaseManager));

let getUserDataController = (): UserDataController => createDataController(
    userDataControllerInstance,
    (databaseManager: DatabaseManager) => new UserDataController(databaseManager));

let getRequestDataController = (): RequestDataController => createDataController(
    requestDataController,
    (databaseManager: DatabaseManager) => new RequestDataController(databaseManager));

let getTagDataController = (): TagDataController => createDataController(
    tagDataController,
    (databaseManager: DatabaseManager) => new TagDataController(databaseManager));

let getResetPasswordDataController = (): ResetPasswordDataController => createDataController(
    resetPasswordDataController,
    (databaseManager: DatabaseManager) => new ResetPasswordDataController(databaseManager));

let getOrganizationDataController = (): OrganizationDataController => createDataController(
    organizationDataController,
    (databaseManager: DatabaseManager) => new OrganizationDataController(databaseManager));

/* #########################     PRIVATE      ########################## */

function createDataController(instance: any, constructorFunc: Function) {
    if (!instance) {
        instance = constructorFunc(DatabaseFactory.getDatabaseManager());
    }
    return instance;
}

export {
    getFeedbackDataController,
    getUserDataController,
    getRequestDataController,
    getTagDataController,
    getResetPasswordDataController,
    getOrganizationDataController
}