import { RequestDataController } from "../../data/datacontroller/request.datacontroller";
import UserDataController from "../../data/datacontroller/user.datacontroller";
import { ErrorType, PlenuumError } from "../../util/errorhandler";
import { UserModel } from "../../data/database/schema/common/user.schema";
import NotificationManager from "./notification.interactor";
import { TEMPLATE } from "../../manager/notification/notification.manager";

export default class RequestInteractor {

    private requestDataController: RequestDataController;
    private notificationManager: NotificationManager;

    constructor(requestDataController: RequestDataController, notificationManager: NotificationManager) {
        this.requestDataController = requestDataController;
        this.notificationManager = notificationManager;
    }

    async saveNewRequest(orgId: string, request: any) {
        const recipients = await Promise.all(request.recipientId.map(async (id: string) => {
            const user = await UserDataController.getUserByIdFromOrg(orgId, id);
            if (!user) throw new PlenuumError("Recipient user not found", ErrorType.NOT_FOUND);
            return user;
        }));
        const sender = await UserDataController.getUserByIdFromOrg(orgId, request.senderId);
        const savedRequest = await this.requestDataController.saveNewRequest(orgId, request);
        recipients.forEach((r: UserModel) =>
            this.notificationManager.sendNotificationById(r._id, TEMPLATE.REQUEST(sender.firstName))
                .catch(console.error)
        );
        return savedRequest;
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