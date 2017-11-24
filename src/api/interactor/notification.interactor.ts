import UserDataController from "../../data/datacontroller/user.datacontroller";
import NotificationInterface from "../../manager/notification/notification.interface";
import { ErrorType, PlenuumError } from "../../util/errorhandler";
import NotificationManager from "../../manager/notification/notification.manager";

export default class NotificationInteractor {

    private notificationManager: NotificationManager;
    private userDataController: any;

    constructor(notificationInterface: NotificationInterface, userDataController: any) {
        this.notificationManager = new NotificationManager(notificationInterface);
        this.userDataController = userDataController;
    }

    async setNotificationDevice(userId: string, token: string) {
        const tokenExists = await this.userDataController.getNotificationToken(userId, token);
        if (tokenExists) {
            throw new PlenuumError("Token already exists", ErrorType.ALREADY_EXISTS);
        } else {
            await this.userDataController.setUserNotificationDevice(userId, token);
            return {message: "Notification token has been set"}
        }
    }

    async refreshNotificationDevice(userId: string, oldToken: string, newToken: string) {
        await UserDataController.refreshNotificationDevice(userId, oldToken, newToken);
        return {message: "Notification token has been refreshed"}
    }

    async removeNotificationToken(userId: string, token: string) {
        const tokenExists = await this.userDataController.getNotificationToken(userId, token);
        if (tokenExists) {
            await this.userDataController.removeNotificationToken(userId, token);
            return {message: "Notification token has been removed"}
        } else {
            throw new PlenuumError("Token was not found", ErrorType.NOT_FOUND);
        }
    }

    async sendNotification(email: string, template: Object) {
        const user = await this.userDataController.getUserByEmail(email, true);
        if (user.notificationToken.length === 0) {
            return;
        }
        return Promise.all(user.notificationToken.map(
            (token: any) => this.notificationManager.sendNotification(token, template)))
    }

    async sendNotificationById(userId: string, template: Object) {
        const tokens = await this.userDataController.getNotificationTokens(userId);
        if (tokens.length === 0) return;
        return Promise.all(tokens.map((token: any) => this.notificationManager.sendNotification(token, template)))
    }
}