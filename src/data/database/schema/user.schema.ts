import { Connection, Document, Model, Schema } from "mongoose";
import { User } from "../../models/user.model";
import { getDatabaseManager } from "../../../factory/database.factory"


const USER_COLLECTION = "users";
const TOKEN_COLLECTION = "tokens";

const TokenSchema = new Schema({
    userId: {required: true, type: String},
    token: {required: true, type: String},
    token_expiry: {required: true, type: Date},
    client_type: {required: true, type: String},
    issued_at: {required: true, type: Date}
}, {_id: false, collection: TOKEN_COLLECTION});

let UserSchema = new Schema({
    firstName: {required: true, type: String, index: true},
    lastName: {required: true, type: String, index: true},
    email: {required: true, type: String, index: {unique: true}},
    orgIds: [String],
    password: {required: true, type: String},
    pictureUrl: {required: false, type: String},
    tokens: [TokenSchema],

}, {versionKey: false, collection: USER_COLLECTION});

UserSchema.path("password").select(false);

if (process.env.NODE_ENV == "prod") {
    UserSchema.plugin(require('mongoose-bcrypt'));
} else {
    UserSchema.method("verifyPasswordSync", function (password: string): boolean {
        return password === 'asd1234';
    });
}

interface UserModel extends User, Document {
    verifyPasswordSync(rec_password: string): boolean
}

interface TokenModel extends User, Document {
    verifyPasswordSync(rec_password: string): boolean
}

const UserCollection = (): Model<UserModel> => getDatabaseManager().createCollection<UserModel>(
    "common", "User", UserSchema);

export { UserModel, UserCollection };