import { User } from "../models/user.model";
import { Model } from 'mongoose';
import { UserCollection } from "../database/schema/user.schema";
import { TokenObject } from "../../auth/token.manager";
import { ResetPasswordCollection } from "../database/schema/resetpassword.schema";
import * as crypto from 'crypto';

interface UserDataController {
    saveUser: (user: User) => Promise<any>
    getOrganizationUsers: (orgId: string) => Promise<any>
    getUserById: (orgId: string, userId: string) => Promise<any>
    getUserByIdWithoutOrgId: (userId: string) => Promise<any>
    getUserByToken: (token: string) => Promise<any>
    getUserByEmail: (email: string) => Promise<any>
    updateUserToken: (userId: string, tokenObj: TokenObject) => Promise<any>
    changeTokens: (userId: string, tokens: any) => Promise<any>
    getResetToken: (token: any) => Promise<any>
    changeUserPassword: (email: string, newPassword: string) => Promise<any>
    changeUserPasswordByUserId: (userId: string, newPassword: string) => Promise<any>
    setUserPic: (userId: string, pictureUrl: string) => Promise<any>
    generateToken: (days: number) => any
}

const userDataController: UserDataController = {
    saveUser: function (user: User): Promise<any> {
        return new (UserCollection())(user).save()
            .then((savedUser) => UserCollection().findById(savedUser._id).lean().exec())
    },

    getOrganizationUsers: function (orgId: string): Promise<any> {
        return UserCollection().find({orgIds: {$in: [orgId]}}).lean().exec();
    },

    getUserById: function (orgId: string, userId: string): Promise<any> {
        return UserCollection().findOne({$and: [{orgIds: {$in: [orgId]}}, {_id: userId}]}).lean().exec();
    },

    getUserByIdWithoutOrgId: function (userId: string): Promise<any> {
        return UserCollection().findById(userId).exec();
    },

    getUserByToken: function (token: string): Promise<any> {
        return UserCollection().findOne({'token.token': token}).lean().exec();
    },

    getUserByEmail: function (email: string): Promise<any> {
        return UserCollection().findOne({email: email}).exec();
    },

    updateUserToken: function (userId: string, tokenObj: TokenObject): Promise<any> {
        const query = {
            token: {
                userId: userId,
                token: tokenObj.token,
                token_expiry: tokenObj.tokenExpiry,
                issued_at: new Date(),
            }
        };
        return UserCollection().findByIdAndUpdate(userId, query, {"new": true}).lean().exec();
    },

    changeTokens: function (userId: string, tokens: any): Promise<any> {
        return UserCollection().findByIdAndUpdate(userId, {$set: {tokens: tokens}}, {'new': true}).lean().exec();
    },

    getResetToken: function (token: any): Promise<any> {
        return ResetPasswordCollection().findOne({token: token}).lean().exec();
    },

    changeUserPassword: function (email: string, newPassword: string): Promise<any> {
        return UserCollection().findOneAndUpdate({email: email}, {password: newPassword}).lean().exec();
    },

    changeUserPasswordByUserId: function (userId: string, newPassword: string): Promise<any> {
        return UserCollection().findByIdAndUpdate(userId, {password: newPassword}).lean().exec();
    },

    generateToken: function (days: number): any {
        let token = crypto.randomBytes(64).toString('hex');
        let token_expiry = new Date();
        let token_duration = process.env.TOKEN_DURATION;
        token_expiry.setDate(token_expiry.getDate() + days.valueOf());
        return {token, token_expiry}
    },

    setUserPic: function (userId: string, pictureUrl: string): Promise<any> {
        return UserCollection().findByIdAndUpdate(userId, {pictureUrl: pictureUrl},
            {"new": true, "select": "_is firstName lastName email orgData"}).lean().exec();
    },
};

export { userDataController, UserDataController}