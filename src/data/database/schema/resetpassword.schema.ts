import { Connection, Document, Model, Schema } from 'mongoose';
import ResetPassword from "../../models/resetpassword.model";
import { getDatabaseManager } from "../../../factory/database.factory";

interface ResetPasswordModel extends ResetPassword, Document {
}

let ResetPasswordSchema: Schema = new Schema({
    userId: {required: true, type: String, index: true},
    token: {required: true, type: String, index: true, select: false},
    token_expiry: {required: true, type: Date, index: true, select: true},
    reseted: {required: true, type: Boolean, index: true, select: true}
}, {
    versionKey: false,
    timestamps: true,
});


const ResetPasswordCollection = () => getDatabaseManager().createCollection<ResetPasswordModel>(
    "common", "ResetPassword", ResetPasswordSchema);

export { ResetPasswordModel, ResetPasswordCollection };