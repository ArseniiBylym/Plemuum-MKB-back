import UserDataController from "../data/datacontroller/user.datacontroller";
import UserController from "../controller/user/user.controller";
import FeedbackDataController from "../data/datacontroller/feedback.datacontroller";
import FeedbackController from "../controller/feedback/feedback.controller";
import AuthController from "../controller/auth/auth.controller";
import * as DataControllerFactory from './datacontroller.factory'

let userControllerInstance: UserController;
let feedbackControllerInstance: FeedbackController;
let authController: AuthController;

/* #########################     PUBLIC      ########################## */

const getUserController = (): UserController => createUserController(DataControllerFactory.getUserDataController());
const getAuthController = (): AuthController => createAuthController();
const getFeedbackController = (): FeedbackController => createFeedbackController(DataControllerFactory.getFeedbackDataController());

/* #########################     PRIVATE      ########################## */

const createUserController = (userDataController: UserDataController) => {
    if (!userControllerInstance) {
        userControllerInstance = new UserController(userDataController);
    }
    return userControllerInstance;
}

const createAuthController = () => {
    if (!authController) {
        authController = new AuthController();
    }
    return authController;
}

const createFeedbackController = (feedbackDataController: FeedbackDataController) => {
    if (!feedbackControllerInstance) {
        feedbackControllerInstance = new FeedbackController(feedbackDataController);
    }
    return feedbackControllerInstance;
}


export { getUserController, getAuthController, getFeedbackController } 