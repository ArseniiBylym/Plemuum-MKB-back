import UserController from "../api/controller/user.controller";
import FeedbackController from "../api/controller/feedback.controller";
import TagController from "../api/controller/tag.controller";
import OrganizationController from "../api/controller/organization.controller";
import RequestController from "../api/controller/request.controller";
import SessionController from "../api/controller/session.controller";
import GroupController from "../api/controller/group.controller";
import NotificationController from "../api/controller/notification.controller";
import * as ManagerFactory from "./manager.factory";

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
    ManagerFactory.getUserManager());

const getFeedbackController = (): FeedbackController => getController(feedbackController, FeedbackController,
    ManagerFactory.getFeedbackManager());

const getTagController = (): TagController => getController(tagController, TagController,
    ManagerFactory.getTagManager());

const getOrganizationController = (): OrganizationController =>
    getController(organizationController, OrganizationController, ManagerFactory.getOrganizationManager());

const getRequestController = (): RequestController => getController(requestController, RequestController,
    ManagerFactory.getRequestManager());

const getSessionController = (): SessionController => getController(sessionController, SessionController,
    ManagerFactory.getSessionManager());

const getGroupController = (): GroupController => getController(groupController, GroupController,
    ManagerFactory.getGroupManager());

const getNotificationController = (): NotificationController => getController(notificationController, NotificationController,
    ManagerFactory.getNotificationManager());

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