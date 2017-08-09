import { Connection, Document, Model, Schema } from 'mongoose';
import { getDatabaseManager } from "../../../factory/database.factory";

interface RequestModel extends Request, Document {
    getRecipientId(): string[]
}

let RequestSchema: Schema = new Schema({
    senderId: {required: true, type: String, index: true},
    recipientId: {required: true, type: [String]},
    requestMessage: {required: true, type: String},
}, {
    versionKey: false,
    timestamps: true,
});

RequestSchema.methods.getRecipientId = function (): [string] {
    return this.recipientId;
};

const RequestCollection = (dbName: string): Model<RequestModel> => {
    return getDatabaseManager().getConnection().useDb(dbName).model<RequestModel>("Request", RequestSchema);
};

export { RequestModel, RequestCollection };