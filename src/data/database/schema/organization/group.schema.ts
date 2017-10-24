import { Connection, Document, Model, Schema } from "mongoose";
import { getDatabaseManager } from "../../../../factory/database.factory"
let GroupSchema = new Schema({
    name: {required: true, type: String, index: {unique: true}},
    users: {required: false, type: [String]},
    answerCardRelations: {required: false, type: [String]},
    todoCardRelations: {required: false, type: [String]},
    skills: {required: false, type: [String]},

}, {versionKey: false, timestamps: true});

import Group from "../../../models/organization/group.model";

interface GroupModel extends Group, Document {
}

const GroupCollection = (dbName: string): Model<GroupModel> => getDatabaseManager().createCollection<GroupModel>(
    dbName, "Group", GroupSchema);

export { GroupModel, GroupCollection };