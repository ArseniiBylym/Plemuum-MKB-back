import UserDataController from "../../data/datacontroller/user.datacontroller";

export default class NotificationManager {

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

}