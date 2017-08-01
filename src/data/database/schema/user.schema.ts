import { Schema, Connection, Model, Document } from "mongoose";
import { User, Token } from "../../models/user.model";


const USER_COLLECTION = "users";
const TOKEN_COLLECTION = "tokens";

const TokenSchema = new Schema({
    userId: { required: true, type: String },
    token: { required: true, type: String },
    token_expiry: { required: true, type: Date },
    client_type: { required: true, type: String },
    issued_at: { required: true, type: Date }
}, { _id: false, collection: TOKEN_COLLECTION });

let UserSchema = new Schema({
    firstName: { required: true, type: String, index: true },
    lastName: { required: true, type: String, index: true },
    email: { required: true, type: String, index: { unique: true } },
    orgIds: [String],
    pictureUrl: { required: false, type: String },
    tokens: [TokenSchema],
}, { versionKey: false, collection: USER_COLLECTION });

/*
UserSchema.plugin(require('mongoose-bcrypt'));
UserSchema.path("password").select(false);
*/

// TODO Understand this!
interface UserModel extends User, Document {
    verifyPasswordSync(rec_password: string): boolean
}

const getDatabaseModel = (dbConnection: Connection, dbName = "hipteamTest"): Model<UserModel> => {
    return dbConnection.useDb(dbName).model<UserModel>("User", UserSchema);
}

export { UserModel, getDatabaseModel };