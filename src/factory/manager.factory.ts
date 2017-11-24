import { tagDataController } from "../data/datacontroller/tag.datacontroller";
import { getOrganizationDataController } from "../data/datacontroller/organization.datacontroller";
import { requestDataController } from "../data/datacontroller/request.datacontroller";
import { getGroupDataController } from "../data/datacontroller/group.datacontroller";
import FirebaseNotification from "../manager/notification/firebase.notification";
import config from "../../config/config";
import UserDataController from "../data/datacontroller/user.datacontroller";
import FileManager from "../manager/file/file.manager";
import CompassManager from "../api/interactor/compass.interactor";
import UserManager from "../api/interactor/user.interactor";
import GroupManager from "../api/interactor/group.interactor";
import OrganizationManager from "../api/interactor/organization.interactor";
import RequestManager from "../api/interactor/request.interactor";
import SessionManager from "../api/interactor/session.interactor";
import TagManager from "../api/interactor/tag.interactor";
import FirebaseStorageManager from "../manager/file/firebase.storage.manager";
import NotificationManager from "../api/interactor/notification.interactor";
import FeedbackManager from "../api/interactor/feedback.interactor";
import StatisticsManager from "../api/interactor/statistics.interactor";
import EmailManager from "../manager/email/mail.manager";

let compassManager: CompassManager;
let userManager: UserManager;
let groupManager: GroupManager;
let organizationManager: OrganizationManager;
let requestManager: RequestManager;
let sessionManager: SessionManager;
let tagManager: TagManager;
let firebaseStorageManager: FirebaseStorageManager;
let notificationManager: NotificationManager;
let feedbackManager: FeedbackManager;
let statisticsManager: StatisticsManager;
let firebaseNotification = new FirebaseNotification(
    require(`../../config/firebase/${config.firebaseConfig.keyFileName}`),
    config.firebaseConfig.databaseUrl);

const getCompassManager = () => getManager(compassManager, CompassManager,
    getGroupDataController(), getOrganizationDataController(), requestDataController, getNotificationManager(), getStatisticsManager());

const getUserManager = (): UserManager =>
    getManager(userManager, UserManager, new EmailManager(), new FileManager(getFirebaseStorageManager()));

const getGroupManager = (): GroupManager =>
    getManager(groupManager, GroupManager, getGroupDataController());

const getOrganizationManager = (): OrganizationManager =>
    getManager(organizationManager, OrganizationManager, getOrganizationDataController());

const getRequestManager = (): RequestManager =>
    getManager(requestManager, RequestManager, requestDataController, getNotificationManager());

const getSessionManager = (): SessionManager =>
    getManager(sessionManager, SessionManager);

const getTagManager = (): TagManager =>
    getManager(tagManager, TagManager, tagDataController);

const getFirebaseStorageManager = (): FirebaseStorageManager =>
    getManager(firebaseStorageManager, FirebaseStorageManager);

const getNotificationManager = (): NotificationManager =>
    getManager(notificationManager, NotificationManager, firebaseNotification, UserDataController);

const getFeedbackManager = (): FeedbackManager =>
    getManager(feedbackManager, FeedbackManager, getNotificationManager());

const getStatisticsManager = (): StatisticsManager =>
    getManager(statisticsManager, StatisticsManager, getNotificationManager());

const getManager = (instance: any, manager: any, ...dependencies: any[]) => {
    if (!instance) {
        instance = new manager(...dependencies);
    }
    return instance;
};


export {
    getUserManager, getGroupManager, getOrganizationManager, getRequestManager, getSessionManager, getTagManager,
    getFirebaseStorageManager, getNotificationManager, getFeedbackManager, getCompassManager, getStatisticsManager
}