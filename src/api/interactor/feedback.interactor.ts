import FeedbackDataController from "../../data/datacontroller/feedback.datacontroller";
import UserDataController from "../../data/datacontroller/user.datacontroller";
import { ErrorType, PlenuumError } from "../../util/errorhandler";
import NotificationManager from "./notification.interactor";
import { TEMPLATE } from "../../manager/notification/notification.manager";
import { PRIVACY } from "../../data/models/organization/feedback.model";
import { User } from "../../data/models/common/user.model";

export default class FeedbackInteractor {

    private notificationManager: NotificationManager;

    constructor(notificationManager: NotificationManager) {
        this.notificationManager = notificationManager;
    }

    async getFeedbacks(orgId: string, userId: string) {
        return FeedbackDataController.getAllFeedback(orgId, userId)
    }

    async getSentFeedbacks(orgId: string, userId: string) {
        return FeedbackDataController.getSentFeedbacks(orgId, userId)
    }

    async getIncomingFeedbacks(orgId: string, userId: string) {
        return FeedbackDataController.getIncomingFeedbacks(orgId, userId)
    }

    async postFeedback(orgId: string, sender: User, feedback: any) {
        const recipient = await UserDataController.getUserByIdFromOrg(orgId, feedback.recipientId);
        if (!recipient) {
            throw new PlenuumError("Recipient user not found", ErrorType.NOT_FOUND);
        }
        const savedFeedback = await FeedbackDataController.saveFeedback(orgId, feedback);
        try {
            await this.notificationManager.sendNotificationById(feedback.recipientId,
                TEMPLATE.FEEDBACK((feedback.privacy && feedback.privacy.indexOf(PRIVACY.ANONYMOUS) !== -1) ? undefined : sender.firstName));
        } catch (error) {
            console.error(error);
        }
        return savedFeedback;
    }

}