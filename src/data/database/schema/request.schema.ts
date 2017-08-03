import { Connection, Document, Model, Schema } from 'mongoose';

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

const getDatabaseModel = (dbConnection: Connection, dbName = "default"): Model<RequestModel> => {
    return dbConnection.useDb(dbName).model<RequestModel>("Request", RequestSchema);
};

export { RequestModel, getDatabaseModel };