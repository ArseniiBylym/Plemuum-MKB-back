import UserDataController from "../data/datacontroller/user.datacontroller";
import UserController from "../controller/user/user.controller";
import FeedbackDataController from "../data/datacontroller/feedback.datacontroller";
import FeedbackController from "../controller/feedback/feedback.controller";
import AuthController from "../controller/auth/auth.controller";
import * as DataControllerFactory from './datacontroller.factory'
import TagController from "../controller/tag/tag.controller";

let userController: UserController;
let feedbackController: FeedbackController;
let authController: AuthController;
let tagController: TagController;

/* #########################     PUBLIC      ########################## */

let getUserController = (): UserController => createUserController(DataControllerFactory.getUserDataController());
let getAuthController = (): AuthController => createAuthController();
let getFeedbackController = (): FeedbackController => createFeedbackController(DataControllerFactory.getFeedbackDataController());
let getTagController = (): TagController => createTagController();

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


export { getUserController, getAuthController, getFeedbackController, getTagController }