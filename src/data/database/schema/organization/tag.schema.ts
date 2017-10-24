import { Connection, Document, Model, Schema } from 'mongoose';
import Tag from "../../../models/organization/tag.model";
import { getDatabaseManager } from "../../../../factory/database.factory";

export let TagSchema = new Schema({
    title: {required: true, type: String, index: true},
    isActive: {required: true, type: Boolean, index: true},
    order: {required: true, type: Number, index: true}
}, {
    versionKey: false,
    timestamps: true,
});

interface TagModel extends Tag, Document {
}

const TagCollection = (dbName: string) => getDatabaseManager().createCollection<TagModel>(
    dbName, "Tag", TagSchema);

export { TagModel, TagCollection };