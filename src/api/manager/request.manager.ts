import { RequestDataController } from "../../data/datacontroller/request.datacontroller";
import UserDataController from "../../data/datacontroller/user.datacontroller";
import { ErrorType, PlenuumError } from "../../util/errorhandler";
import NotificationManager from "./notification.manager";
import { TEMPLATE } from "../../service/notification/notification.service";

export default class RequestManager {

    private requestDataController: RequestDataController;
    private notificationManager: NotificationManager;

    constructor(requestDataController: RequestDataController, notificationManager: NotificationManager) {
        this.requestDataController = requestDataController;
        this.notificationManager = notificationManager;
    }

    async saveNewRequest(orgId: string, request: any) {
        const user = await UserDataController.getUserByIdFromOrg(orgId, request.recipientId);
        if (!user) {
            throw new PlenuumError("Recipient user not found", ErrorType.NOT_FOUND);
        }
        try {
            await this.notificationManager.sendNotificationById(request.recipientId, TEMPLATE.REQUEST(user.firstName));
        } catch (error) {
            console.error(error);
        }
        return this.requestDataController.saveNewRequest(orgId, request);
    }

    async getSenderRequests(orgId: string, userId: string) {
        return this.requestDataController.getSenderRequests(orgId, userId);
    }

    async getRecipientRequests(orgId: string, userId: string) {
        return this.requestDataController.getRecipientRequests(orgId, userId);
    }

    async getRequests(orgId: string, userId: string) {
        return this.requestDataController.getAllRequests(orgId, userId);
    }

    async getRequest(orgId: string, userId: string, requestId: string) {
        return this.requestDataController.getSpecificRequestForUser(orgId, userId, requestId);
    }

    async getRecipientUsersFromRequest(orgId: string, userId: string, requestId: string) {
        return this.requestDataController.getRecipientUsersFromRequest(orgId, userId, requestId);
    }

}