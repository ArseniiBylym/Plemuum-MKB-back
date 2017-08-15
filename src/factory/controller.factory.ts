import UserController from "../controller/user.controller";
import FeedbackController from "../controller/feedback.controller";
import TagController from "../controller/tag.controller";
import OrganizationController from "../controller/organization.controller";
import RequestController from "../controller/request.controller";
import SessionController from "../controller/session.controller";
import {
    getFeedbackDataController,
    getGroupDataController,
    getOrganizationDataController,
    getRequestDataController,
    getResetPasswordDataController,
    getTagDataController,
} from "./datacontroller.factory";
import EmailService from "../service/email/mail.service";
import FileTransferService from "../service/file/filetransfer.service";
import GroupController from "../controller/group.controller";
import { userDataController } from "../data/datacontroller/user.datacontroller";

let userController: UserController;
let feedbackController: FeedbackController;
let tagController: TagController;
let organizationController: OrganizationController;
let requestController: RequestController;
let sessionController: SessionController;
let groupController: GroupController;

/* #########################     PUBLIC      ########################## */

const getUserController = (): UserController => getController(userController, UserController,
    userDataController,
    getResetPasswordDataController(),
    new EmailService(),
    new FileTransferService());

const getFeedbackController = (): FeedbackController => getController(feedbackController, FeedbackController,
    getFeedbackDataController());

const getTagController = (): TagController => getController(tagController, TagController,
    getTagDataController());

const getOrganizationController = (): OrganizationController => getController(organizationController, OrganizationController,
    getOrganizationDataController());

const getRequestController = (): RequestController => getController(requestController, RequestController,
    getRequestDataController());

const getSessionController = (): SessionController => getController(sessionController, SessionController,
    userDataController);

const getGroupController = (): GroupController => getController(groupController, GroupController,
    getGroupDataController());

/* #########################     PRIVATE      ########################## */

function getController(instance: any, controller: any, ...dependencies: any[]) {
    if (!instance) {
        instance = new controller(...dependencies);
    }
    return instance;
}

export {
    getUserController, getFeedbackController, getTagController, getOrganizationController,
    getRequestController, getSessionController, getGroupController
}