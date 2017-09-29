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
import RequestManager from "../api/manager/request.manager";
import SessionManager from "../api/manager/session.manager";
import TagManager from "../api/manager/tag.manager";
import FirebaseStorageManager from "../service/file/firebase.storage.manager";
import NotificationController from "../api/controller/notification.controller";
import NotificationManager from "../api/manager/notification.manager";
import FirebaseNotification from "../service/notification/firebase.notification";
import config from "../../config/config";
import FeedbackManager from "../api/manager/feedback.manager";

let userController: UserController;
let feedbackController: FeedbackController;
let tagController: TagController;
let organizationController: OrganizationController;
let requestController: RequestController;
let sessionController: SessionController;
let groupController: GroupController;
let notificationController: NotificationController;

/* #########################     PUBLIC      ########################## */

const getUserController = (): UserController => getController(userController, UserController,
    new UserManager(new EmailService(), new FileTransferService(new FirebaseStorageManager()))
);

const getFeedbackController = (): FeedbackController => getController(feedbackController, FeedbackController,
    new FeedbackManager());

const getTagController = (): TagController => getController(tagController, TagController,
    new TagManager(tagDataController));

const getOrganizationController = (): OrganizationController =>
    getController(organizationController, OrganizationController, new OrganizationManager(getOrganizationDataController()));

const getRequestController = (): RequestController => getController(requestController, RequestController,
    new RequestManager(requestDataController));

const getSessionController = (): SessionController => getController(sessionController, SessionController, new SessionManager());

const getGroupController = (): GroupController => getController(groupController, GroupController,
    new GroupManager(getGroupDataController()));

const getNotificationController = (): NotificationController => getController(notificationController, NotificationController,
    new NotificationManager(new FirebaseNotification(require(`../../res/${config.firebaseConfig.keyFileName}`), config.firebaseConfig.databaseUrl)));

/* #########################     PRIVATE      ########################## */

function getController(instance: any, controller: any, ...dependencies: any[]) {
    if (!instance) {
        instance = new controller(...dependencies);
    }
    return instance;
}

export {
    getUserController, getFeedbackController, getTagController, getOrganizationController,
    getRequestController, getSessionController, getGroupController, getNotificationController
}