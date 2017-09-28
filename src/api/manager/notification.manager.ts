import UserDataController from "../../data/datacontroller/user.datacontroller";
import NotificationService, { TEMPLATE } from "../../service/notification/notification.service";
import NotificationInterface from "../../service/notification/notification.interface";
import { ErrorType, PlenuumError } from "../../util/errorhandler";

export default class NotificationManager {

    private notificationService: NotificationService;

    constructor(notificationInterface: NotificationInterface) {
        this.notificationService = new NotificationService(notificationInterface)
    }

    async setNotificationDevice(userId: string, token: string) {
        await UserDataController.setUserNotificationDevice(userId, token);
        return {message: "Notification token has been set"}
    }

    async refreshNotificationDevice(userId: string, oldToken: string, newToken: string) {
        await UserDataController.refreshNotificationDevice(userId, oldToken, newToken);
        return {message: "Notification token has been refreshed"}
    }

    async removeNotificationToken(userId: string, token: string) {
        await UserDataController.removeNotificationToken(userId, token);
        return {message: "Notification token has been removed"}
    }

    async sendNotification(email: string, message: string) {
        const user = await UserDataController.getUserByEmail(email, true);
        if (user.notificationToken.length === 0) {
            throw new PlenuumError("There's no notification token available", ErrorType.NOT_FOUND);
        }
        return Promise.all(user.notificationToken.map(
            (token) => this.notificationService.sendNotification(token, TEMPLATE.FEEDBACK("Béla"))))
    }
}