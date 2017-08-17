import UserController from "../controller/user.controller";
import FeedbackController from "../controller/feedback.controller";
import TagController from "../controller/tag.controller";
import OrganizationController from "../controller/organization.controller";
import RequestController from "../controller/request.controller";
import SessionController from "../controller/session.controller";
import EmailService from "../service/email/mail.service";
import FileTransferService from "../service/file/filetransfer.service";
import GroupController from "../controller/group.controller";
import { feedbackDataController } from "../data/datacontroller/feedback.datacontroller";
import { organizationDataController } from "../data/datacontroller/organization.datacontroller";
import { requestDataController } from "../data/datacontroller/request.datacontroller";
import { tagDataController } from "../data/datacontroller/tag.datacontroller";

let userController: UserController;
let feedbackController: FeedbackController;
let tagController: TagController;
let organizationController: OrganizationController;
let requestController: RequestController;
let sessionController: SessionController;
let groupController: GroupController;

/* #########################     PUBLIC      ########################## */

const getUserController = (): UserController => getController(userController, UserController,
    new EmailService(),
    new FileTransferService());

const getFeedbackController = (): FeedbackController => getController(feedbackController, FeedbackController,
    feedbackDataController);

const getTagController = (): TagController => getController(tagController, TagController,
    tagDataController);

const getOrganizationController = (): OrganizationController => getController(organizationController, OrganizationController,
    organizationDataController);

const getRequestController = (): RequestController => getController(requestController, RequestController,
    requestDataController);

const getSessionController = (): SessionController => getController(sessionController, SessionController);

const getGroupController = (): GroupController => getController(groupController, GroupController);

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