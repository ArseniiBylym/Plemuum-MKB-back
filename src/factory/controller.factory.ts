import UserController from "../api/controller/user.controller";
import FeedbackController from "../api/controller/feedback.controller";
import TagController from "../api/controller/tag.controller";
import OrganizationController from "../api/controller/organization.controller";
import RequestController from "../api/controller/request.controller";
import SessionController from "../api/controller/session.controller";
import GroupController from "../api/controller/group.controller";
import NotificationController from "../api/controller/notification.controller";
import * as ManagerFactory from "./manager.factory";
import { getCompassManager } from "./manager.factory";
import CompassController from "../api/controller/compass.controller";
import SurveyController from "../api/controller/survey.controller";
import EmailTemplateController from "../api/controller/emailTemplate.controller";

let userController: UserController;
let feedbackController: FeedbackController;
let tagController: TagController;
let organizationController: OrganizationController;
let requestController: RequestController;
let sessionController: SessionController;
let groupController: GroupController;
let notificationController: NotificationController;
let compassController: CompassController;
let surveyController: SurveyController;
let emailTemplateController: EmailTemplateController;

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

const getCompassController = (): CompassController => getController(compassController, CompassController, getCompassManager());

const getSurveyController = (): SurveyController => getController(surveyController, SurveyController, ManagerFactory.getSurveyManager());

const getEmailTemplateController = (): EmailTemplateController =>
    getController(emailTemplateController, EmailTemplateController, ManagerFactory.getEmailTemplateManager());


/* #########################     PRIVATE      ########################## */

function getController(instance: any, controller: any, ...dependencies: any[]) {
    if (!instance) {
        instance = new controller(...dependencies);
    }
    return instance;
}

export {
    getUserController, getFeedbackController, getTagController, getOrganizationController,
    getRequestController, getSessionController, getGroupController, getNotificationController, getCompassController, getSurveyController, getEmailTemplateController
}