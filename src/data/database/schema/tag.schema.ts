
import * as mongoose from "mongoose";
import Tag from "../../models/tag.model";

interface TagModel extends Tag, mongoose.Document {
}

export let TagSchema = new mongoose.Schema({
    title: { required: true, type: String, index: true },
    isActive: { required: true, type: Boolean, index: true },
    order: { required: true, type: Number, index: true }
}, {
        versionKey: false,
        timestamps: true,
    });

const getDatabaseModel = (dbConnection: mongoose.Connection, dbName?: string): mongoose.Model<TagModel> => {
    if (dbName) {
        dbConnection.useDb(dbName);
    }
    return dbConnection.model<TagModel>("Feedback", TagSchema);
}

export { TagModel, getDatabaseModel };