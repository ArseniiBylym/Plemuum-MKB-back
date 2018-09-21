import { Connection, Document, Model, Schema } from "mongoose";
import { getDatabaseManager } from "../../../../factory/database.factory"
import { User } from "../../../models/common/user.model";
import { default as config, ENVIRONMENTS } from "../../../../../config/config";

const USER_COLLECTION = "users";

// noinspection ReservedWordAsName
let UserSchema = new Schema({
    firstName: {required: true, type: String, index: true},
    lastName: {required: true, type: String, index: true},
    email: {required: true, type: String, index: {unique: true}},
    pictureUrl: {required: false, type: String},
    orgId: {type: String, required: true, select: false},
    admin: {required: true, type: Boolean, select: false, default: false},
    password: {type: String, required: true, bcrypt: true, select: false},
    passwordUpdatedAt: {required: true, type: Date, select: false, default: Date.now},
    lastActive: {required: false, type: Date},
    notificationToken: {required: false, type: [String], select: false},
    roles: {required: false, type: Array, index: true}

}, {versionKey: false, collection: USER_COLLECTION});

if (config.env === ENVIRONMENTS.PRODUCTION || config.env === ENVIRONMENTS.STAGING) {
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