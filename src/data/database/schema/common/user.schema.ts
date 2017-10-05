import { Connection, Document, Model, Schema } from "mongoose";
import { getDatabaseManager } from "../../../../factory/database.factory"
import { User } from "../../../models/common/user.model";
import { ENVIRONMENTS } from "../../../../../config/config";

const USER_COLLECTION = "users";
const TOKEN_COLLECTION = "tokens";

const TokenSchema = new Schema({
    userId: {required: true, type: String},
    token: {required: true, type: String},
    token_expiry: {required: true, type: Date},
    issued_at: {required: true, type: Date}
}, {_id: false, collection: TOKEN_COLLECTION});

let UserSchema = new Schema({
    firstName: {required: true, type: String, index: true},
    lastName: {required: true, type: String, index: true},
    email: {required: true, type: String, index: {unique: true}},
    orgIds: {required: true, type: [String], select: false},
    password: {required: true, type: String, select: false},
    pictureUrl: {required: false, type: String},
    token: {required: false, type: TokenSchema, select: false},
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