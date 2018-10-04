import { Connection, Document, Model, Schema } from "mongoose";
import { getDatabaseManager } from "../../../../factory/database.factory"
import { EmailTemplate } from "../../../models/common/emailTemplate.model";

const EMAILTEMPLATE_COLLECTION = "emailtemplates";

let EmailTemplatesSchema = new Schema({
    orgId: {required: true, type: String, index: true},
    type: {required: true, type: String, index: true},
    lang: {required: true, type: String, index: true},
    subject: {required: true, type: String},
    html: {required: true, type: String}
    
}, {versionKey: false, collection: EMAILTEMPLATE_COLLECTION});


interface EmailTemplateModel extends EmailTemplate, Document {
}

const EmailTemplateCollection = (): Model<EmailTemplateModel> => getDatabaseManager().createCollection<EmailTemplateModel>(
    "common", "EmailTemplate", EmailTemplatesSchema);

export { EmailTemplateModel, EmailTemplateCollection };