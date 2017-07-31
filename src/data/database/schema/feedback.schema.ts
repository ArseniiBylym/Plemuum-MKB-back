
import * as mongoose from "mongoose";
import Feedback from "../../models/feedback.model";
import { TagSchema } from './tag.schema'

const modelName = "Feedback";
const databaseName = "feedback";

interface FeedbackModel extends Feedback, mongoose.Document {
}

const FeedbackSchema = new mongoose.Schema({
    senderId: { required: true, type: String, index: true },
    recipientId: { required: true, type: String, index: true },
    context: { required: false, type: String },
    message: { required: true, type: String },
    privacy: [{ type: String, enum: ["PRIVATE", "ANONYMOUS"] }],
    type: { required: true, type: String, enum: ["CONSIDER", "CONTINUE"] },
    requestId: { type: String, index: true },
    tags: [TagSchema],
}, {
        versionKey: false,
        timestamps: true,
    });

const getDatabaseModel = (dbConnection: mongoose.Connection, dbName?: string): mongoose.Model<FeedbackModel> => {
    dbConnection.useDb(databaseName);
    return dbConnection.model<FeedbackModel>(modelName, FeedbackSchema);
}

export { FeedbackModel, getDatabaseModel };