import { Connection, Document, Model, Schema } from 'mongoose';
import Feedback from "../../models/feedback.model";
import { TagSchema } from './tag.schema'
import { getDatabaseManager } from "../../../factory/database.factory";

const modelName = "Feedback";
const databaseName = "feedback";

interface FeedbackModel extends Feedback, Document {
}

const FeedbackSchema = new Schema({
    senderId: {required: true, type: String, index: true},
    recipientId: {required: true, type: String, index: true},
    context: {required: false, type: String},
    message: {required: true, type: String},
    privacy: [{type: String, enum: ["PRIVATE", "ANONYMOUS"]}],
    type: {required: true, type: String, enum: ["CONSIDER", "CONTINUE"]},
    requestId: {type: String, index: true},
    tags: [TagSchema],
}, {
    versionKey: false,
    timestamps: true,
});

const FeedbackCollection = (dbName = "default"): Model<FeedbackModel> => {
    return getDatabaseManager().getConnection().useDb(dbName).model<FeedbackModel>(modelName, FeedbackSchema);
};

export { FeedbackModel, FeedbackCollection };