import { Connection, Document, Model, Schema } from 'mongoose';
import Feedback, { PRIVACY, TYPE } from "../../../models/organization/feedback.model";
import { TagSchema } from './tag.schema'
import { getDatabaseManager } from "../../../../factory/database.factory";

interface FeedbackModel extends Feedback, Document {
}

const FeedbackSchema = new Schema({
    senderId: {required: true, type: String, index: true},
    recipientId: {required: true, type: String, index: true},
    message: {required: true, type: String},
    privacy: [{type: String, enum: [PRIVACY.PRIVATE, PRIVACY.ANONYMOUS]}],
    type: {required: true, type: String, enum: [TYPE.CONSIDER, TYPE.CONTINUE]},
    requestId: {type: String, index: true},
    tags: [TagSchema],
}, {
    versionKey: false,
    timestamps: true,
});

const FeedbackCollection = (dbName: string) => getDatabaseManager().createCollection<FeedbackModel>(
    dbName, "Feedback", FeedbackSchema);


export { FeedbackModel, FeedbackCollection };