import { Connection, Document, Model, Schema } from "mongoose";
import { getDatabaseManager } from "../../../factory/database.factory"
import Organization from "../../models/organization.model";

interface OrganizationModel extends Organization, Document {
}

export let OrganizationSchema = new Schema({
    name: {required: true, type: String, index: true},
    dbName: {required: true, type: String, index: true}, //Maybe instead of this, use the database name as the ID of the organization
    todoSentenceNumber: {required: true, type: Number, index: true},
    compasseGenerationTime: {required: true, type: Number, index: true}
}, {
    versionKey: false,
    timestamps: true,
});


const OrganizationCollection = (): Model<OrganizationModel> => {
    return getDatabaseManager().getConnection().useDb("common").model<OrganizationModel>("Organization", OrganizationSchema);
};

export { OrganizationModel, OrganizationCollection };