import { Model } from 'mongoose';
import { TokenObject } from "../../service/auth/token.manager";
import * as crypto from 'crypto';
import { User } from "../models/common/user.model";
import { UserCollection, UserModel } from "../database/schema/common/user.schema";
import { ResetPasswordCollection, ResetPasswordModel } from "../database/schema/common/resetpassword.schema";


const UserDataController = {

    saveUser: function (user: User): Promise<UserModel> {
        return new (UserCollection())(user).save()
            .then((savedUser) => UserCollection().findById(savedUser._id).lean().exec() as Promise<UserModel>)
    },

    getOrganizationUsers: function (orgId: string): Promise<UserModel> {
        return UserCollection().find({orgIds: {$in: [orgId]}})
            .lean()
            .exec() as Promise<UserModel>;
    },

    getUserById: function (orgId: string, userId: string, fields: string[] = []): Promise<UserModel> {
        return UserCollection()
            .findOne({$and: [{orgIds: {$in: [orgId]}}, {_id: userId}]}, fields.join(' '))
            .lean()
            .exec() as Promise<UserModel>;
    },

    getUsersByIds: function (orgId: string, userIds: string[]): Promise<UserModel[]> {
        return UserCollection().find({_id: {$in: userIds}})
            .lean()
            .exec() as Promise<UserModel[]>;
    },

    updateUser: function (userId: string, user: UserModel): Promise<UserModel> {
        return UserCollection().findOneAndUpdate({_id: userId}, user, {new: true})
            .lean()
            .exec() as Promise<UserModel>;
    },

    getUserByIdWithoutOrgId: function (userId: string, showToken: boolean = false): Promise<UserModel> {
        const queryCmd = UserCollection().findById(userId);
        if (showToken) {
            queryCmd.select('+token')
        }
        return queryCmd.exec() as Promise<UserModel>;
    },

    getUserByToken: function (token: string): Promise<UserModel> {
        return UserCollection().findOne({'token.token': token})
            .select('+token')
            .lean()
            .exec() as Promise<UserModel>;
    },

    getUserByEmail: function (email: string, showNotificationTokens: boolean = false): Promise<UserModel> {
        const queryCmd = UserCollection().findOne({email: email});
        if (showNotificationTokens) {
            queryCmd.select('+notificationToken')
        }
        return queryCmd.exec() as Promise<UserModel>;
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
        return UserCollection().findByIdAndUpdate(userId, query, {"new": true})
            .select('+token')
            .select('+orgIds')
            .lean()
            .exec() as Promise<UserModel>;
    },

    removeToken: (userId: string): Promise<any> => {
        return UserCollection().findByIdAndUpdate(userId, {$set: {token: {}}})
            .lean()
            .exec();
    },

    changeTokens: function (userId: string, tokens: any): Promise<UserModel> {
        return UserCollection().findByIdAndUpdate(userId, {$set: {tokens: tokens}}, {'new': true})
            .lean()
            .exec() as Promise<UserModel>;
    },

    getResetToken: function (token: any): Promise<ResetPasswordModel> {
        return ResetPasswordCollection().findOne({token: token})
            .lean()
            .exec() as Promise<ResetPasswordModel>;
    },

    changeUserPassword: function (email: string, newPassword: string): Promise<UserModel> {
        return UserCollection().findOneAndUpdate({email: email}, {password: newPassword})
            .lean()
            .exec() as Promise<UserModel>;
    },

    changeUserPasswordByUserId: function (userId: string, newPassword: string): Promise<UserModel> {
        return UserCollection().findByIdAndUpdate(userId, {password: newPassword})
            .lean()
            .exec() as Promise<UserModel>;
    },

    generateToken: function (days: number): any {
        let token = crypto.randomBytes(64).toString('hex');
        let token_expiry = new Date();
        token_expiry.setDate(token_expiry.getDate() + days.valueOf());
        return {token, token_expiry}
    },

    setUserPic: function (userId: string, pictureUrl: string): Promise<UserModel> {
        return UserCollection().findByIdAndUpdate(userId, {pictureUrl: pictureUrl}, {"new": true})
            .lean()
            .exec() as Promise<UserModel>;
    },

    setUserNotificationDevice: function (userId: string, notificationToken: string): Promise<UserModel> {
        const query = {$push: {notificationToken: notificationToken}};
        return UserCollection().findByIdAndUpdate(userId, query, {"new": true})
            .lean()
            .exec() as Promise<UserModel>;
    },

    refreshNotificationDevice: function (userId: string, oldToken: string, newToken: string): Promise<UserModel> {
        return UserCollection().findById(userId)
            .lean()
            .exec()
            .then((user: any) => {
                const modifiedToken = user.notificationToken.map((token: string) => {
                    if (token === oldToken) {
                        return newToken
                    } else {
                        return token
                    }
                });
                return UserCollection().findByIdAndUpdate({_id: userId}, {$set: {notificationToken: modifiedToken}}, {"new": true}).lean().exec() as Promise<UserModel>;
            });
    },

    removeNotificationToken: function (userId: string, token: string): Promise<UserModel> {
        return UserCollection().findById(userId).lean().exec()
            .then((user: any) => {
                const modifiedToken = user.notificationToken.filter((currentToken: string) => {
                    return currentToken !== token;
                });
                return UserCollection().findByIdAndUpdate({_id: userId}, {$set: {notificationToken: modifiedToken}}, {"new": true}).lean().exec() as Promise<UserModel>;
            });
    },
};

export default UserDataController