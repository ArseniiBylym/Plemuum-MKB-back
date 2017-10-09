import { Connection, Document, Model, Schema } from "mongoose";
import { getDatabaseManager } from "../../../../factory/database.factory"
import { User } from "../../../models/common/user.model";
import { ENVIRONMENTS } from "../../../../../config/config";

const USER_COLLECTION = "users";

// noinspection ReservedWordAsName
let UserSchema = new Schema({
    firstName: {required: true, type: String, index: true},
    lastName: {required: true, type: String, index: true},
    email: {required: true, type: String, index: {unique: true}},
    pictureUrl: {required: false, type: String},
    orgIds: {required: true, type: [String], select: false},
    admin: {required: true, type: Boolean, select: false, default: false},
    password: { type: String, required: true, bcrypt: true, select: false },
    passwordUpdatedAt: {required: true, type: Date, select: false, default: Date.now},
    notificationToken: {required: false, type: [String], select: false}

}, {versionKey: false, collection: USER_COLLECTION});

if (process.env.NODE_ENV == ENVIRONMENTS.production || process.env.NODE_ENV == ENVIRONMENTS.staging) {
    UserSchema.plugin(require('mongoose-bcrypt'));
} else {
    UserSchema.method("verifyPasswordSync", function (password: string): boolean {
        return password === 'asd1234';
    });
}

interface UserModel extends User, Document {
    verifyPasswordSync(rec_password: string): boolean
}

const UserCollection = (): Model<UserModel> => getDatabaseManager().createCollection<UserModel>(
    "common", "User", UserSchema);

export { UserModel, UserCollection };