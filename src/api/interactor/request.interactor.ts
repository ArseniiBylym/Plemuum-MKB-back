import { RequestDataController } from "../../data/datacontroller/request.datacontroller";
import UserDataController from "../../data/datacontroller/user.datacontroller";
import { ErrorType, PlenuumError } from "../../util/errorhandler";
import { UserModel } from "../../data/database/schema/common/user.schema";
import NotificationManager from "./notification.interactor";
import { TEMPLATE } from "../../manager/notification/notification.manager";
import agenda from "../../util/agenda";

export default class RequestInteractor {

    private requestDataController: RequestDataController;
    private notificationManager: NotificationManager;

    constructor(requestDataController: RequestDataController, notificationManager: NotificationManager) {
        this.requestDataController = requestDataController;
        this.notificationManager = notificationManager;
    }

    async saveNewRequest(orgId: string, request: any) {
        if (!(request.recipientId)) {
            throw new Error("recipientId missing");
        }
        if (!(Array.isArray(request.recipientId))) {
            throw new Error("recipientId is not an array");
        }

        const recipients: UserModel[] = await Promise.all<UserModel>(
            request.recipientId.map(async (id: string) => {
                // TODO: use a function that uses `in`
                // https://docs.mongodb.com/manual/reference/operator/query/in/
                const user = await UserDataController.getUserByIdFromOrg(orgId, id);
                
                if (!user) {
                    throw new PlenuumError("Recipient user not found", ErrorType.NOT_FOUND);
                }
                
                return user;
            })
        );

        const sender = await UserDataController.getUserByIdFromOrg(orgId, request.senderId);
        const savedRequest = await this.requestDataController.saveNewRequest(orgId, request);

        recipients.forEach((r: UserModel) => {
            this.notificationManager.sendNotificationById(r._id,TEMPLATE.REQUEST(sender.firstName))
            .then((result) => agenda.schedule(new Date(Date.now() + 2000), 'sendEmailNotificationAboutRequest', {user:r, sender:sender.firstName}))
                .catch(console.error)
        });
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