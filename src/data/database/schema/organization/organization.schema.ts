import { Connection, Document, Model, Schema } from "mongoose";
import { getDatabaseManager } from "../../../../factory/database.factory"
import Organization from "../../../models/organization/organization.model";

interface OrganizationModel extends Organization, Document {
}

export let OrganizationSchema = new Schema({
    name: {required: true, type: String, index: true},
    dbName: {required: true, type: String, index: true}, //Maybe instead of this, use the database name as the ID of the organization
    todoSentenceNumber: {required: true, type: Number, index: true},
    compassGenerationTime: {required: true, type: String, index: true}
}, {
    versionKey: false,
    timestamps: true,
});


const OrganizationCollection = (): Model<OrganizationModel> => getDatabaseManager().createCollection<OrganizationModel>(
        "common", "Organization", OrganizationSchema);

export { OrganizationModel, OrganizationCollection };