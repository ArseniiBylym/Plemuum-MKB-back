import UserController from "../controller/user.controller";
import FeedbackController from "../controller/feedback.controller";
import TagController from "../controller/tag.controller";
import OrganizationController from "../controller/organization.controller";
import RequestController from "../controller/request.controller";
import SessionController from "../controller/session.controller";
import {
    getFeedbackDataController,
    getOrganizationDataController,
    getRequestDataController,
    getResetPasswordDataController,
    getTagDataController,
    getUserDataController
} from "./datacontroller.factory";

let userController: UserController;
let feedbackController: FeedbackController;
let tagController: TagController;
let organizationController: OrganizationController;
let requestController: RequestController;
let sessionController: SessionController;

/* #########################     PUBLIC      ########################## */

const getUserController = (): UserController => createController(userController,
    (userDataController: any, resetPasswordDataController: any) =>
        new UserController(userDataController, resetPasswordDataController),
    getUserDataController(),
    getResetPasswordDataController());

const getFeedbackController = (): FeedbackController => createController(userController,
    (feedbackDataController: any) => new FeedbackController(feedbackDataController),
    getFeedbackDataController());

const getTagController = (): TagController => createController(userController,
    (tagDataController: any) => new TagController(tagDataController),
    getTagDataController());

const getOrganizationController = (): OrganizationController => createController(userController,
    (organizationDataController: any) => new OrganizationController(organizationDataController),
    getOrganizationDataController());

const getRequestController = (): RequestController => createController(userController,
    (requestDataController: any) => new RequestController(requestDataController),
    getRequestDataController());

const getSessionController = (): SessionController => createController(userController,
    (userDataController: any) => new SessionController(userDataController),
    getUserDataController());

/* #########################     PRIVATE      ########################## */

function createController(instance: any, constructorFunc: Function, ...dependencies: any[]) {
    if (!instance) {
        instance = constructorFunc(...dependencies);
    }
    return instance;
}

export {
    getUserController, getFeedbackController, getTagController, getOrganizationController,
    getRequestController, getSessionController
}