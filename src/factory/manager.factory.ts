import UserManager from "../api/manager/user.manager";
import GroupManager from "../api/manager/group.manager";
import OrganizationManager from "../api/manager/organization.manager";
import RequestManager from "../api/manager/request.manager";
import SessionManager from "../api/manager/session.manager";
import TagManager from "../api/manager/tag.manager";
import FirebaseStorageManager from "../service/file/firebase.storage.manager";
import NotificationManager from "../api/manager/notification.manager";
import FeedbackManager from "../api/manager/feedback.manager";
import CompassManager from "../api/manager/compass.manager";
import EmailService from "../service/email/mail.service";
import FileTransferService from "../service/file/filetransfer.service";
import { tagDataController } from "../data/datacontroller/tag.datacontroller";
import { getOrganizationDataController } from "../data/datacontroller/organization.datacontroller";
import { requestDataController } from "../data/datacontroller/request.datacontroller";
import { getGroupDataController } from "../data/datacontroller/group.datacontroller";
import FirebaseNotification from "../service/notification/firebase.notification";
import config from "../../config/config";
import UserDataController from "../data/datacontroller/user.datacontroller";
import StatisticsManager from "../api/manager/statistics.manager";

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
    getManager(userManager, UserManager, new EmailService(), new FileTransferService(getFirebaseStorageManager()));

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