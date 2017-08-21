import { Model } from 'mongoose';
import { TokenObject } from "../../auth/token.manager";
import * as crypto from 'crypto';
import { User } from "../models/common/user.model";
import { UserCollection, UserModel } from "../database/schema/common/user.schema";
import { ResetPasswordCollection } from "../database/schema/common/resetpassword.schema";

const UserDataController = {
    saveUser: function (user: User): Promise<UserModel> {
        return new (UserCollection())(user).save()
            .then((savedUser) => UserCollection().findById(savedUser._id).lean().exec() as Promise<UserModel>)
    },

    getOrganizationUsers: function (orgId: string): Promise<UserModel> {
        return UserCollection().find({orgIds: {$in: [orgId]}}).lean().exec() as Promise<UserModel>;
    },

    getUserById: function (orgId: string, userId: string, fields: string[] = []): Promise<UserModel> {
        return UserCollection()
            .findOne({$and: [{orgIds: {$in: [orgId]}}, {_id: userId}]}, fields.join(' ')).lean().exec() as Promise<UserModel>;
    },

    getUserByIdWithoutOrgId: function (userId: string): Promise<UserModel> {
        return UserCollection().findById(userId).exec() as Promise<UserModel>;
    },

    getUserByToken: function (token: string): Promise<UserModel> {
        return UserCollection().findOne({'token.token': token}).lean().exec() as Promise<UserModel>;
    },

    getUserByEmail: function (email: string): Promise<UserModel> {
        return UserCollection().findOne({email: email}).exec() as Promise<UserModel>;
    },

    updateUserToken: function (userId: string, tokenObj: TokenObject): Promise<UserModel> {
        const query = {
            token: {
                userId: userId,
                token: tokenObj.token,
                token_expiry: tokenObj.tokenExpiry,
                issued_at: new Date(),
            }
        };
        return UserCollection().findByIdAndUpdate(userId, query, {"new": true}).lean().exec() as Promise<UserModel>;
    },

    changeTokens: function (userId: string, tokens: any): Promise<UserModel> {
        return UserCollection().findByIdAndUpdate(userId, {$set: {tokens: tokens}}, {'new': true}).lean().exec() as Promise<UserModel>;
    },

    getResetToken: function (token: any): Promise<UserModel> {
        return ResetPasswordCollection().findOne({token: token}).lean().exec() as Promise<UserModel>;
    },

    changeUserPassword: function (email: string, newPassword: string): Promise<UserModel> {
        return UserCollection().findOneAndUpdate({email: email}, {password: newPassword}).lean().exec() as Promise<UserModel>;
    },

    changeUserPasswordByUserId: function (userId: string, newPassword: string): Promise<UserModel> {
        return UserCollection().findByIdAndUpdate(userId, {password: newPassword}).lean().exec() as Promise<UserModel>;
    },

    generateToken: function (days: number): any {
        let token = crypto.randomBytes(64).toString('hex');
        let token_expiry = new Date();
        let token_duration = process.env.TOKEN_DURATION;
        token_expiry.setDate(token_expiry.getDate() + days.valueOf());
        return {token, token_expiry}
    },

    setUserPic: function (userId: string, pictureUrl: string): Promise<UserModel> {
        return UserCollection().findByIdAndUpdate(userId, {pictureUrl: pictureUrl},
            {"new": true, "select": "_is firstName lastName email orgData"}).lean().exec() as Promise<UserModel>;
    },
};

export default UserDataController