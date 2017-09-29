import FeedbackDataController from "../../data/datacontroller/feedback.datacontroller";
import UserDataController from "../../data/datacontroller/user.datacontroller";
import { ErrorType, PlenuumError } from "../../util/errorhandler";

export default class FeedbackManager {

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
        const user = await UserDataController.getUserById(orgId, feedback.recipientId);
        if (!user) {
            throw new PlenuumError("Recipient user not found", ErrorType.NOT_FOUND);
        }
        return FeedbackDataController.saveFeedback(orgId, feedback);
    }

}