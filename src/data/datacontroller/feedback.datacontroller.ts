import Feedback from "../models/feedback.model";
import { Model, Query } from "mongoose";
import { FeedbackModel, FeedbackCollection } from "../database/schema/feedback.schema";
import DatabaseManager from "../database/database.manager";
import BaseDataController from "./base.datacontroller";

export default class FeedbackDataController {

    public  getAllFeedback(organizationId: string, userId: string): Promise<any> {
        return FeedbackCollection(organizationId).find({$or: [{senderId: userId}, {recipientId: userId}]}).lean().exec();
    }

    public  getSentFeedbacks(organizationId: string, userId: string): Promise<any> {
        return FeedbackCollection(organizationId).find({senderId: userId}).lean().exec();
    }

    public  getIncomingFeedbacks(organizationId: string, userId: string): Promise<any> {
        return FeedbackCollection(organizationId).find({recipientId: userId}).lean().exec();
    }

    public  saveFeedback(organizationId: string, feedback: Feedback): Promise<any> {
        return new (FeedbackCollection(organizationId))(feedback).save();
    }
}