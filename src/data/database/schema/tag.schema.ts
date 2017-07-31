
import { Schema, Document, Connection, Model } from 'mongoose';
import Tag from "../../models/tag.model";

interface TagModel extends Tag, Document {
}

export let TagSchema = new Schema({
    title: { required: true, type: String, index: true },
    isActive: { required: true, type: Boolean, index: true },
    order: { required: true, type: Number, index: true }
}, {
        versionKey: false,
        timestamps: true,
    });

const getDatabaseModel = (dbConnection: Connection, dbName = "hipteamTest"): Model<TagModel> => {
    return dbConnection.useDb(dbName).model<TagModel>("Tag", TagSchema);
}

export { TagModel, getDatabaseModel };