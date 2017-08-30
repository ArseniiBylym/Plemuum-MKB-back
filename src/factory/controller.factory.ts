import UserController from "../api/controller/user.controller";
import FeedbackController from "../api/controller/feedback.controller";
import TagController from "../api/controller/tag.controller";
import OrganizationController from "../api/controller/organization.controller";
import RequestController from "../api/controller/request.controller";
import SessionController from "../api/controller/session.controller";
import EmailService from "../service/email/mail.service";
import FileTransferService from "../service/file/filetransfer.service";
import GroupController from "../api/controller/group.controller";
import { requestDataController } from "../data/datacontroller/request.datacontroller";
import { tagDataController } from "../data/datacontroller/tag.datacontroller";
import { getGroupDataController } from "../data/datacontroller/group.datacontroller";
import UserManager from "../api/manager/user.manager";
import GroupManager from "../api/manager/group.manager";
import OrganizationManager from "../api/manager/organization.manager";
import { getOrganizationDataController } from "../data/datacontroller/organization.datacontroller";

let userController: UserController;
let feedbackController: FeedbackController;
let tagController: TagController;
let organizationController: OrganizationController;
let requestController: RequestController;
let sessionController: SessionController;
let groupController: GroupController;

/* #########################     PUBLIC      ########################## */

const getUserController = (): UserController => getController(userController, UserController,
    new FileTransferService(),
    new UserManager(new EmailService())
);

const getFeedbackController = (): FeedbackController => getController(feedbackController, FeedbackController);

const getTagController = (): TagController => getController(tagController, TagController,
    tagDataController);

const getOrganizationController = (): OrganizationController =>
    getController(organizationController, OrganizationController, new OrganizationManager(getOrganizationDataController()));

const getRequestController = (): RequestController => getController(requestController, RequestController,
    requestDataController);

const getSessionController = (): SessionController => getController(sessionController, SessionController);

const getGroupController = (): GroupController => getController(groupController, GroupController,
    new GroupManager(getGroupDataController()));

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