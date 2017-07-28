import * as mongoose from "mongoose";
import { User, Token } from "../../models/user.model";

const TokenSchema = new mongoose.Schema({
    userId: { required: true, type: String },
    token: { required: true, type: String },
    token_expiry: { required: true, type: Date },
    client_type: { required: true, type: String },
    issued_at: { required: true, type: Date }
}, { _id: false });

let UserSchema = new mongoose.Schema({
    firstName: { required: true, type: String, index: true },
    lastName: { required: true, type: String, index: true },
    email: { required: true, type: String, index: { unique: true } },
    orgIds: [String],
    pictureUrl: { required: false, type: String },
    tokens: [TokenSchema],
}, { versionKey: false });

/*
UserSchema.plugin(require('mongoose-bcrypt'));
UserSchema.path("password").select(false);
*/

// TODO Understand this!
interface UserModel extends User, mongoose.Document {
    verifyPasswordSync(rec_password: string): boolean
}

const getDatabaseModel = (dbConnection: mongoose.Connection, dbName?: string): mongoose.Model<UserModel> => {
    if (dbName) {
        dbConnection.useDb(dbName);
    }
    return dbConnection.model<UserModel>("User", UserSchema);
}

export { UserModel, getDatabaseModel };