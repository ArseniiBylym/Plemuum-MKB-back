import Feedback from "../models/organization/feedback.model";
import { Model, Query } from "mongoose";
import { FeedbackCollection } from "../database/schema/organization/feedback.schema";
import { UserModel, UserCollection } from "../database/schema/common/user.schema";

const FeedbackDataController = {

    getDataSetForAbusiveReport: function (organizationId: string,  feedbackId:string): Promise<any> {
        return FeedbackCollection(organizationId).findOne({_id: feedbackId})
        .populate({ path: 'senderId', model: UserCollection(), select:'_id firstName lastName email orgId',})
        .populate({ path: 'recipientId', model: UserCollection(), select:'_id firstName lastName email orgId',})
        .lean().exec();
    },

    getAllFeedback: function (organizationId: string, userId: string): Promise<any> {
        return FeedbackCollection(organizationId).find({$or: [{senderId: userId}, {recipientId: userId}]}).lean().exec();
    },

    getSentFeedbacks: function (organizationId: string, userId: string): Promise<any> {
        return FeedbackCollection(organizationId).find({senderId: userId}).lean().exec();
    },

    getIncomingFeedbacks: function (organizationId: string, userId: string): Promise<any> {
        return FeedbackCollection(organizationId).find({recipientId: userId}).lean().exec();
    },

    getSentFeedbacksReport: function (organizationId: string, userId: string): Promise<any> {
        return FeedbackCollection(organizationId).find({senderId: userId})
        .populate({ path: 'senderId', model: UserCollection(), select:'_id firstName lastName email',})
        .populate({ path: 'recipientId', model: UserCollection(), select:'_id firstName lastName email',})
        .lean().exec();
    },

    getIncomingFeedbacksReport: function (organizationId: string, userId: string): Promise<any> {
        return FeedbackCollection(organizationId).find({recipientId: userId})
        .populate({ path: 'senderId', model: UserCollection(), select:'_id firstName lastName email',})
        .populate({ path: 'recipientId', model: UserCollection(), select:'_id firstName lastName email',})
        .lean().exec();
    },

    getIncomingFeedbacksReportForExcelFile: function (organizationId: string, userId: string): Promise<any> {
        return FeedbackCollection(organizationId).find({recipientId: userId}, {_id: 0, message:1, type: 1,updatedAt:1, privacy:1 })
        .populate({ path: 'senderId', model: UserCollection(), select:'firstName lastName',}).sort({createdAt:-1})
        .lean().exec();
    },

    saveFeedback: function (organizationId: string, feedback: Feedback): Promise<any> {
        return new (FeedbackCollection(organizationId))(feedback).save();
    },

    getFeedbacksForRequest: (organizationId: string, requestId: string, userId: string): Promise<any> => {
        return FeedbackCollection(organizationId).find({requestId: requestId, senderId: userId},).lean().exec();
    }
};

export default FeedbackDataController