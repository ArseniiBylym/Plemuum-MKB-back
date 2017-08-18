import Feedback from "../models/organization/feedback.model";
import { Model, Query } from "mongoose";
import { FeedbackCollection } from "../database/schema/organization/feedback.schema";

const FeedbackDataController = {

    getAllFeedback: function (organizationId: string, userId: string): Promise<any> {
        return FeedbackCollection(organizationId).find({$or: [{senderId: userId}, {recipientId: userId}]}).lean().exec();
    },

    getSentFeedbacks: function (organizationId: string, userId: string): Promise<any> {
        return FeedbackCollection(organizationId).find({senderId: userId}).lean().exec();
    },

    getIncomingFeedbacks: function (organizationId: string, userId: string): Promise<any> {
        return FeedbackCollection(organizationId).find({recipientId: userId}).lean().exec();
    },

    saveFeedback: function (organizationId: string, feedback: Feedback): Promise<any> {
        return new (FeedbackCollection(organizationId))(feedback).save();
    }
};

export default FeedbackDataController