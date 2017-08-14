import { User } from "../models/user.model";
import { Model } from 'mongoose';
import { UserCollection, UserModel } from "../database/schema/user.schema";
import DatabaseManager from "../database/database.manager";
import BaseDataController from "./base.datacontroller";
import { TokenObject } from "../../auth/token.manager";
import ResetPassword from "../models/resetpassword.model";
import { ResetPasswordCollection } from "../database/schema/resetpassword.schema";
import * as crypto from 'crypto';

export default class UserDataController extends BaseDataController<UserModel> {

    constructor(databaseManager: DatabaseManager) {
        super(databaseManager, UserCollection);
    }

    public saveUser(user: User): Promise<any> {
        return new Promise((resolve, reject) => {
            const userModel = UserCollection();
            new userModel(user).save((error: Error, savedUser: UserModel) => {
                userModel.findById(savedUser._id).lean().exec()
                    .then((user: UserModel) => resolve(user))
                    .catch((error) => reject(error))
            });
        });
    }

    public getOrganizationUsers(orgId: any): Promise<User[]> {
        return new Promise((resolve, reject) => {
            const query: any = {orgIds: {$in: [orgId]}};
            UserCollection().find(query, (error: Error, users: User[]) => error ? reject(error) : resolve(users))
        })
    }

    public getUserById(orgId: string, userId: string): Promise<User> {
        return new Promise((resolve, reject) => {
            const query: any = {$and: [{orgIds: {$in: [orgId]}}, {_id: userId}]};
            UserCollection().findOne(query, (error: Error, user: User) => error ? reject(error) : resolve(user))
        })
    }

    public static getUserByIdWithoutOrgId(userId: string): Promise<Object> {
        return UserCollection().findById(userId).lean().exec();
    }

    public getUserByToken(token: string): Promise<any> {
        return UserCollection().findOne({'token.token': token}).lean().exec();
    }

    public getUserByEmail(email: string): Promise<User> {
        return new Promise((resolve, reject) => {
            UserCollection().findOne({email: email}, (error: Error, user: UserModel) =>
                error ? reject(error) : resolve(user))
        });
    }

    public static updateUserToken(userId: string, tokenObj: TokenObject) {
        const query = {
            token: {
                userId: userId,
                token: tokenObj.token,
                token_expiry: tokenObj.tokenExpiry,
                issued_at: new Date(),
            }
        };
        return UserCollection().findByIdAndUpdate(userId, query, {"new": true}).lean().exec();
    }

    public changeTokens(userId: string, tokens: any) {
        return new Promise((resolve, reject) => {
            UserCollection().findByIdAndUpdate(userId, {$set: {tokens: tokens}}, {'new': true},
                (err, updatedUser: UserModel) => err ? reject(err) : resolve(updatedUser));
        });
    }

    public getResetToken(token: any): Promise<ResetPassword> {
        return new Promise((resolve, reject) => ResetPasswordCollection().findOne({token: token})
            .lean().exec((err, resetedPwd: ResetPassword) => err ? reject(err) : resolve(resetedPwd)
            )
        );
    }

    public changeUserPassword(email: string, newPassword: string): Promise<any> {
        return new Promise((resolve, reject) => UserCollection().findOneAndUpdate({email: email}, {password: newPassword},
            (err: any, updatedUser: UserModel) => err ? reject(err) : resolve(updatedUser))
        );
    }
    public changeUserPasswordByUserId(userId: string, newPassword: string): Promise<any> {
        return new Promise((resolve, reject) => UserCollection().findByIdAndUpdate(userId, {password: newPassword},
            (err: any, updatedUser: UserModel) => err ? reject(err) : resolve(updatedUser))
        );
    }

    public static generateToken(days: number) {
        let token = crypto.randomBytes(64).toString('hex');
        let token_expiry = new Date();
        let token_duration = process.env.TOKEN_DURATION;
        token_expiry.setDate(token_expiry.getDate() + days.valueOf());
        return {token, token_expiry}
    }

    public setUserPic(userId: string, pictureUrl: string): Promise<UserModel> {
        return new Promise((resolve, reject) => {
            UserCollection().findByIdAndUpdate(userId, {pictureUrl: pictureUrl},
                {"new": true, "select": "_is firstName lastName email orgData"}).lean().exec(
                (err: Error, user: UserModel) => err ? reject(err) : resolve(user));
        });
    };
}