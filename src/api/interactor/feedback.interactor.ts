import FeedbackDataController from "../../data/datacontroller/feedback.datacontroller";
import UserDataController from "../../data/datacontroller/user.datacontroller";
import { ErrorType, PlenuumError } from "../../util/errorhandler";
import NotificationManager from "./notification.interactor";
import { TEMPLATE } from "../../manager/notification/notification.manager";

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

    async postFeedback(orgId: string, feedback: any) {
        const user = await UserDataController.getUserByIdFromOrg(orgId, feedback.recipientId);
        if (!user) {
            throw new PlenuumError("Recipient user not found", ErrorType.NOT_FOUND);
        }
        const savedFeedback = await FeedbackDataController.saveFeedback(orgId, feedback);
        try {
            await this.notificationManager.sendNotificationById(feedback.recipientId, TEMPLATE.FEEDBACK(user.firstName));
        } catch (error) {
            console.error(error);
        }
        return savedFeedback;
    }

}