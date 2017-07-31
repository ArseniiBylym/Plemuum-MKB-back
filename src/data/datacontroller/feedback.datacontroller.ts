import Feedback from "../models/feedback.model";
import * as mongoose from "mongoose";
import { FeedbackModel, getDatabaseModel } from "../database/schema/feedback.schema";
import * as databaseManager from "../database/database.manager";
import DatabaseManager from "../database/database.manager";

let instance: FeedbackDataController;

export default class FeedbackDataController {

    private databaseManager: DatabaseManager;

    constructor(databaseManager: DatabaseManager) {
        this.databaseManager = databaseManager;
    }

    public getAllFeedback(userId: string): Promise<Feedback[]> {
        return new Promise((resolve, reject) => {
            const query: any = { $or: [{ senderId: userId }, { recipientId: userId }] };
            const feedbackModel: mongoose.Model<FeedbackModel> = getDatabaseModel(this.databaseManager.getConnection());
            feedbackModel.find(query, (error: Error, feedbacks: Feedback[]) => error ? reject(error) : resolve(feedbacks));
        });
    }

    public saveFeedback(feedback: Feedback): Promise<Feedback> {
        return new Promise((resolve, reject) => {
            const feedbackModel: mongoose.Model<FeedbackModel> =
                getDatabaseModel(this.databaseManager.getConnection());
            new feedbackModel(feedback).save((error: Error, feedback: Feedback) => error ? reject(error) : resolve(feedback));
        });
    }
}