import { User } from "../models/user.model";
import { Model } from 'mongoose';
import { UserCollection, UserModel } from "../database/schema/user.schema";
import DatabaseManager from "../database/database.manager";
import BaseDataController from "./base.datacontroller";
import { TokenObject } from "../../auth/token.manager";

export default class UserDataController extends BaseDataController<UserModel> {

    constructor(databaseManager: DatabaseManager) {
        super(databaseManager, UserCollection);
    }

    public saveUser(user: User): Promise<any> {
        return new Promise((resolve, reject) => {
            const userModel = UserCollection();
            new userModel(user).save((error: Error, savedUser: any) => {
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

    getUserById(orgId: string, userId: string): Promise<User> {
        return new Promise((resolve, reject) => {
            const query: any = {$and: [{orgIds: {$in: [orgId]}}, {_id: userId}]};
            UserCollection().findOne(query, (error: Error, user: User) => error ? reject(error) : resolve(user))
        })
    }

    getUserByIdWithoutOrgId(userId: string): Promise<Object> {
        return UserCollection().findById(userId).lean().exec();
    }

    getUserByToken(token: string): Promise<any> {
        return new Promise((resolve, reject) => {
            UserCollection().findOne({'tokens.token': token}, (error: Error, user) => error ? reject(error) : resolve(user))
        });
    }

    getUserByEmail(email: string): Promise<User> {
        return new Promise((resolve, reject) => {
            UserCollection().findOne({email: email}, (error: Error, user: UserModel) =>
                error ? reject(error) : resolve(user))
        });
    }

    getCurrentToken(user: UserModel, token: string): any {
        return user.tokens.find((element) => {
            return element.token === token;
        });
    }

    updateUserToken(userId: string, tokenObj: TokenObject, userAgent: string) {
        const query = {
            $push: {
                tokens: {
                    userId: userId,
                    token: tokenObj.token,
                    token_expiry: tokenObj.tokenExpiry,
                    issued_at: new Date(),
                    client_type: userAgent
                }
            }
        };
        return UserCollection().findByIdAndUpdate(userId, query, {"new": true}).exec();
    }

    changeTokens(userId: string, tokens: any) {
        return new Promise((resolve, reject) => {
            UserCollection().findByIdAndUpdate(userId, {$set: {tokens: tokens}}, {'new': true},
                (err, updatedUser: UserModel) => err ? reject(err) : resolve(updatedUser));
        });
    }
}