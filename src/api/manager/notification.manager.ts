import UserDataController from "../../data/datacontroller/user.datacontroller";
import NotificationService from "../../service/notification/notification.service";
import NotificationInterface from "../../service/notification/notification.interface";
import { ErrorType, PlenuumError } from "../../util/errorhandler";

export default class NotificationManager {

    private notificationService: NotificationService;
    private userDataController: any;

    constructor(notificationInterface: NotificationInterface, userDataController: any) {
        this.notificationService = new NotificationService(notificationInterface);
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
            throw new PlenuumError("There's no notification token available", ErrorType.NOT_FOUND);
        }
        return Promise.all(user.notificationToken.map(
            (token: any) => this.notificationService.sendNotification(token, template)))
    }
}