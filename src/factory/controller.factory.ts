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
import EmailService from "../email/mail.service";

let userController: UserController;
let feedbackController: FeedbackController;
let tagController: TagController;
let organizationController: OrganizationController;
let requestController: RequestController;
let sessionController: SessionController;

/* #########################     PUBLIC      ########################## */

const getUserController = (): UserController => getController(userController, UserController,
    getUserDataController(),
    getResetPasswordDataController(),
    new EmailService());

const getFeedbackController = (): FeedbackController => getController(feedbackController, FeedbackController,
    getFeedbackDataController());

const getTagController = (): TagController => getController(tagController, TagController,
    getTagDataController());

const getOrganizationController = (): OrganizationController => getController(organizationController, OrganizationController,
    getOrganizationDataController());

const getRequestController = (): RequestController => getController(requestController, RequestController,
    getRequestDataController());

const getSessionController = (): SessionController => getController(sessionController, SessionController,
    getUserDataController());

/* #########################     PRIVATE      ########################## */

function getController(instance: any, controller: any, ...dependencies: any[]) {
    if (!instance) {
        instance = new controller(...dependencies);
    }
    return instance;
}

export {
    getUserController, getFeedbackController, getTagController, getOrganizationController,
    getRequestController, getSessionController
}