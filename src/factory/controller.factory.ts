import UserDataController from "../data/datacontroller/user.datacontroller";
import UserController from "../controller/user.controller";
import FeedbackDataController from "../data/datacontroller/feedback.datacontroller";
import FeedbackController from "../controller/feedback.controller";
import AuthController from "../controller/auth.controller";
import * as DataControllerFactory from './datacontroller.factory'
import TagController from "../controller/tag.controller";
import OrganizationController from "../controller/organization.controller";
import RequestController from "../controller/request.controller";
import RequestDataController from "../data/datacontroller/request.datacontroller";
import SessionController from "../controller/session.controller";

let userController: UserController;
let feedbackController: FeedbackController;
let authController: AuthController;
let tagController: TagController;
let organizationController: OrganizationController;
let requestController: RequestController;
let sessionController: SessionController;

/* #########################     PUBLIC      ########################## */

let getUserController = (): UserController => createUserController(DataControllerFactory.getUserDataController());
let getAuthController = (): AuthController => createAuthController();
let getFeedbackController = (): FeedbackController => createFeedbackController(DataControllerFactory.getFeedbackDataController());
let getTagController = (): TagController => createTagController();
let getOrganizationController = (): OrganizationController => createOrganizationController();
let getRequestController = (): RequestController => createRequestController(DataControllerFactory.getRequestDataController());
let getSessionController = (): SessionController => createSessionController();

/* #########################     PRIVATE      ########################## */

function createUserController(userDataController: UserDataController) {
    if (!userController) {
        userController = new UserController(userDataController);
    }
    return userController;
}

function createAuthController() {
    if (!authController) {
        authController = new AuthController();
    }
    return authController;
}

function createFeedbackController(feedbackDataController: FeedbackDataController) {
    if (!feedbackController) {
        feedbackController = new FeedbackController(feedbackDataController);
    }
    return feedbackController;
}

function createTagController() {
    if (!tagController) {
        tagController = new TagController();
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

function createSessionController() {
    if (!sessionController) {
        sessionController = new SessionController();
    }
    return sessionController;
}

export {
    getUserController, getAuthController, getFeedbackController, getTagController, getOrganizationController,
    getRequestController, getSessionController
}