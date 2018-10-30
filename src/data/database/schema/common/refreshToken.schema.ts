import { Connection, Document, Model, Schema } from 'mongoose';
import { getDatabaseManager } from "../../../../factory/database.factory";
import RefreshToken from "../../../models/common/refreshToken.model";

interface RefreshTokenModel extends RefreshToken, Document {
}

let RefreshTokenSchema: Schema = new Schema({
    userId: {required: true, type: String, index: true},
    accessToken: {required: true, type: String, index: true, select: true},
    refreshToken: {required: true, type: String, index: true, select: true},
    expiryDate: {required: true, type: Date, index: false, select: true}
}, {
    versionKey: false,
    timestamps: true,
});


const RefreshTokenCollection = () => getDatabaseManager().createCollection<RefreshTokenModel>(
    "common", "RefreshToken", RefreshTokenSchema);

export { RefreshTokenModel, RefreshTokenCollection };