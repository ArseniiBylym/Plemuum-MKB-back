import Feedback from "../models/feedback.model";
import { Model, Query } from "mongoose";
import { FeedbackModel, getDatabaseModel } from "../database/schema/feedback.schema";
import * as databaseManager from "../database/database.manager";
import DatabaseManager from "../database/database.manager";
import BaseDataController from "./base.datacontroller";

export default class FeedbackDataController extends BaseDataController<FeedbackModel>{

    constructor(databaseManager: DatabaseManager) {
        super(databaseManager, getDatabaseModel);
    }

    public getAllFeedback(userId: string): Promise<Feedback[]> {
        return new Promise((resolve, reject) => {
            const query = { $or: [{ senderId: userId }, { recipientId: userId }] };
            this.queryFeedbacks(query, reject, resolve);
        });
    }

    public getSentFeedbacks(userId: string): Promise<Feedback[]> {
        return new Promise((resolve, reject) => {
            const query = { senderId: userId };
            this.queryFeedbacks(query, reject, resolve);
        });
    }

    public saveFeedback(feedback: Feedback): Promise<Feedback> {
        return new Promise((resolve, reject) => {
            const feedbackModel = getDatabaseModel(this.databaseManager.getConnection());
            new feedbackModel(feedback).save((error: Error, feedback: Feedback) => error ? reject(error) : resolve(feedback));
        });
    }

    private queryFeedbacks(query: any, reject: Function, resolve: Function) {
        const feedbackModel = getDatabaseModel(this.databaseManager.getConnection());
        feedbackModel.find(query, (error: Error, feedbacks: Feedback[]) => error ? reject(error) : resolve(feedbacks));
    }
}