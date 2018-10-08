import * as crypto from 'crypto';
import { User } from "../models/common/user.model";
import { UserCollection, UserModel } from "../database/schema/common/user.schema";
import { ResetPasswordCollection, ResetPasswordModel } from "../database/schema/common/resetpassword.schema";
import { ErrorType, PlenuumError } from "../../util/errorhandler";


const UserDataController = {

    getLineManagerEmployees: function (orgId: string, userId: string): Promise<UserModel[]> {
        return UserCollection().find({orgId: orgId, managerId: userId}).sort({firstName:1, lastName:1})
                .lean()
                .exec() as Promise<UserModel[]>;
    },

    saveUser: function (user: User): Promise<UserModel> {
        return new (UserCollection())(user).save()
            .then((savedUser) => UserCollection().findById(savedUser._id).lean().exec() as Promise<UserModel>)
    },

    getOrganizationUsers: function (orgId: string, query?: any): Promise<UserModel[]> {
        let sort = {};
        if (query && query.sort === 'firstNameLastName'){
            sort = {firstName:1, lastName:1};
        }
        else if (query && query.sort === 'lastNameFirstName') {
            sort = {lastName:1,firstName:1};
        }
        return UserCollection().find({orgId: {$eq: orgId}}).sort(sort)
                .lean()
                .exec() as Promise<UserModel[]>;
    },

    getUserById: function (userId: string, showOrganizations: boolean = false, showAdmin: boolean = false,
                           showUpdatedPasswordDate: boolean = false): Promise<UserModel> {
        const query = UserCollection().findById(userId);
        if (showAdmin) {
            query.select('+admin');
        }
        if (showOrganizations) {
            query.select('+orgId');
        }
        if (showUpdatedPasswordDate) {
            query.select('+passwordUpdatedAt');
        }
        return query.lean().exec() as Promise<UserModel>;
    },

    getNotificationTokens: async function (userId: string) {
        const query = UserCollection().findById(userId);
        query.select('+notificationToken');
        const user = await (query.lean().exec() as Promise<UserModel>);
        return user.notificationToken;
    },

    getUserByIdFromOrg: function (orgId: string, userId: string, fields: string[] = []): Promise<UserModel> {
        return UserCollection()
            .findOne({$and: [{orgId: {$eq: orgId}}, {_id: userId}]}, fields.join(' '))
            .lean()
            .exec() as Promise<UserModel>;
    },

    getUserByIdsFromOrg: function (orgId: string, userIds: string[], fields: string[] = []): Promise<UserModel[]> {
        return UserCollection()
            .find({$and: [{orgId: {$eq: orgId}}, {_id: {$in: userIds}}]}, fields.join(' '))
            .lean()
            .exec() as Promise<UserModel[]>;
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

    updateUserManagerId: function (userId: string, managerId: any): Promise<UserModel> {
        return UserCollection().findByIdAndUpdate({_id : userId}, {managerId: managerId}, {new: true})
            .lean()
            .exec() as Promise<UserModel>;
    },

    getUserByIdWithoutOrgId: function (userId: string, showOrgIds: boolean = false): Promise<UserModel> {
        const queryCmd = UserCollection().findById(userId);
        if (showOrgIds) {
            queryCmd.select('+orgId')
        }
        return queryCmd.exec() as Promise<UserModel>;
    },

    getUserByEmail: function (email: string, showNotificationTokens: boolean = false): Promise<UserModel> {
        const queryCmd = UserCollection().findOne({email: email});
        if (showNotificationTokens) {
            queryCmd.select('+notificationToken')
        }
        return queryCmd.exec() as Promise<UserModel>;
    },

    removeToken: (userId: string): Promise<any> => {
        return UserCollection().findByIdAndUpdate(userId, {$set: {token: {}}})
            .lean()
            .exec();
    },

    getResetToken: function (token: any): Promise<ResetPasswordModel> {
        return ResetPasswordCollection().findOne({token: token})
            .lean()
            .exec() as Promise<ResetPasswordModel>;
    },

    invalidateResetToken: (token: string, date: Date): Promise<ResetPasswordModel> => {
        return ResetPasswordCollection().findOneAndUpdate({token: token}, {$set: {token_expiry: date}})
            .lean()
            .exec() as Promise<ResetPasswordModel>
    },

    changeUserPassword: async function (email: string, oldPassword: string, newPassword: string): Promise<UserModel> {
        const user = await UserCollection().findOne({email: email}, {password: 1});
        if(!user) throw new PlenuumError("User not found", ErrorType.NOT_FOUND);
        if(!user.verifyPasswordSync(oldPassword)) throw new PlenuumError("Incorrect password", ErrorType.FORBIDDEN);
        return UserCollection().findOneAndUpdate({email: email}, {password: newPassword, passwordUpdatedAt: new Date()})
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
            .select('+notificationToken')
            .lean()
            .exec()
            .then((user: any) => {
                if (!user.notificationToken || user.notificationToken.length === 0) {
                    throw new PlenuumError("Old token not found", ErrorType.NOT_FOUND);
                }
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
        return UserCollection().findById(userId).select('+notificationToken').lean().exec()
            .then((user: any) => {
                const modifiedToken = user.notificationToken.filter((currentToken: string) => {
                    return currentToken !== token;
                });
                return UserCollection().findByIdAndUpdate({_id: userId}, {$set: {notificationToken: modifiedToken}}, {"new": true}).lean().exec() as Promise<UserModel>;
            });
    },

    getNotificationToken: function (userId: string, token: string): Promise<string> {
        return UserCollection().findById(userId).select('+notificationToken').lean().exec()
            .then((user: any) =>
                user.notificationToken.find((elem: string) => {
                    return elem === token
                }))
    }
};

export default UserDataController