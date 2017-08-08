import UserDataController from "../data/datacontroller/user.datacontroller";
import UserController from "../controller/user.controller";
import FeedbackDataController from "../data/datacontroller/feedback.datacontroller";
import FeedbackController from "../controller/feedback.controller";
import * as DataControllerFactory from './datacontroller.factory'
import TagController from "../controller/tag.controller";
import OrganizationController from "../controller/organization.controller";
import RequestController from "../controller/request.controller";
import RequestDataController from "../data/datacontroller/request.datacontroller";
import SessionController from "../controller/session.controller";
import TagDataController from "../data/datacontroller/tag.datacontroller";
import ResetPasswordDataController from "../data/datacontroller/resetpassword.datacontroller";

let userController: UserController;
let feedbackController: FeedbackController;
let tagController: TagController;
let organizationController: OrganizationController;
let requestController: RequestController;
let sessionController: SessionController;

/* #########################     PUBLIC      ########################## */

let getUserController = (): UserController => createUserController(
    DataControllerFactory.getUserDataController(), DataControllerFactory.getResetPasswordDataController());
let getFeedbackController = (): FeedbackController => createFeedbackController(DataControllerFactory.getFeedbackDataController());
let getTagController = (): TagController => createTagController(DataControllerFactory.getTagDataController());
let getOrganizationController = (): OrganizationController => createOrganizationController();
let getRequestController = (): RequestController => createRequestController(DataControllerFactory.getRequestDataController());
let getSessionController = (): SessionController => createSessionController(DataControllerFactory.getUserDataController());

/* #########################     PRIVATE      ########################## */

function createUserController(userDataController: UserDataController, resetPasswordDataController: ResetPasswordDataController) {
    if (!userController) {
        userController = new UserController(userDataController, resetPasswordDataController);
    }
    return userController;
}

function createFeedbackController(feedbackDataController: FeedbackDataController) {
    if (!feedbackController) {
        feedbackController = new FeedbackController(feedbackDataController);
    }
    return feedbackController;
}

function createTagController(tagDataController: TagDataController) {
    if (!tagController) {
        tagController = new TagController(tagDataController);
    }
    return tagController;
}

function createOrganizationController() {
    if (!organizationController) {
        organizationController = new OrganizationController();
    }
    return organizationController;
}

function createRequestController(requestDataController: RequestDataController) {
    if (!requestController) {
        requestController = new RequestController(requestDataController);
    }
    return requestController;
}

function createSessionController(userDataController: UserDataController) {
    if (!sessionController) {
        sessionController = new SessionController(userDataController);
    }
    return sessionController;
}

export {
    getUserController, getFeedbackController, getTagController, getOrganizationController,
    getRequestController, getSessionController
}