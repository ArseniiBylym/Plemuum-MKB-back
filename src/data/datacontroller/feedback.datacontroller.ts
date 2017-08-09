import Feedback from "../models/feedback.model";
import {Model, Query} from "mongoose";
import {FeedbackModel, FeedbackCollection} from "../database/schema/feedback.schema";
import DatabaseManager from "../database/database.manager";
import BaseDataController from "./base.datacontroller";

export default class FeedbackDataController extends BaseDataController<FeedbackModel> {

    constructor(databaseManager: DatabaseManager) {
        super(databaseManager, FeedbackCollection);
    }

    public getAllFeedback(organizationId: string, userId: string): Promise<Feedback[]> {
        return new Promise((resolve, reject) => {
            const query = {$or: [{senderId: userId}, {recipientId: userId}]};
            this.queryFeedbacks(organizationId, query, reject, resolve);
        });
    }

    public getSentFeedbacks(organizationId: string, userId: string): Promise<Feedback[]> {
        return new Promise((resolve, reject) => {
            const query = {senderId: userId};
            this.queryFeedbacks(organizationId, query, reject, resolve);
        });
    }

    public getIncomingFeedbacks(organizationId: string, userId: string): Promise<Feedback[]> {
        return new Promise((resolve, reject) => {
            const query = {recipientId: userId};
            this.queryFeedbacks(organizationId, query, reject, resolve);
        });
    }

    public saveFeedback(organizationId: string, feedback: Feedback): Promise<Feedback> {
        return new Promise((resolve, reject) => {
            const feedbackModel = FeedbackCollection(organizationId);
            new feedbackModel(feedback).save((error: Error, feedback: Feedback) => error ? reject(error) : resolve(feedback));
        });
    }

    private queryFeedbacks(dbName: string, query: any, reject: Function, resolve: Function) {
        FeedbackCollection(dbName).find(query, (error: Error, feedbacks: Feedback[]) => error ? reject(error) : resolve(feedbacks));
    }
}