import { User } from "../models/user.model";
import { Model } from 'mongoose';
import { getUserModel, UserModel } from "../database/schema/user.schema";
import DatabaseManager from "../database/database.manager";
import BaseDataController from "./base.datacontroller";
import { TokenObject } from "../../auth/token.manager";

export default class UserDataController extends BaseDataController<UserModel> {

    constructor(databaseManager: DatabaseManager) {
        super(databaseManager, getUserModel);
    }

    public saveUser(user: User): Promise<any> {
        return new Promise((resolve, reject) => {
            const userModel = getUserModel(this.databaseManager.getConnection());
            new userModel(user).save((error: Error, savedUser: any) => {
                userModel.findById(savedUser._id).lean().exec()
                    .then((user: UserModel) => resolve(user))
                    .catch((error) => reject(error))
            });
        });
    }

    public getOrganizationUsers(orgId: any): Promise<User[]> {
        return new Promise((resolve, reject) => {
            const userModel = getUserModel(this.databaseManager.getConnection());
            const query: any = {orgIds: {$in: [orgId]}};
            userModel.find(query, (error: Error, users: User[]) => error ? reject(error) : resolve(users))
        })
    }

    getUserById(orgId: string, userId: string): Promise<User> {
        return new Promise((resolve, reject) => {
            const userModel = getUserModel(this.databaseManager.getConnection());
            const query: any = {$and: [{orgIds: {$in: [orgId]}}, {_id: userId}]};
            userModel.findOne(query, (error: Error, user: User) => error ? reject(error) : resolve(user))
        })
    }

    getUserByIdWithoutOrgId(userId: string): Promise<Object> {
        const userModel = getUserModel(this.databaseManager.getConnection());
        return userModel.findById(userId).lean().exec();
    }

    getUserByToken(token: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const userModel = getUserModel(this.databaseManager.getConnection());
            userModel.findOne({'tokens.token': token}, (error: Error, user) => error ? reject(error) : resolve(user))
        });
    }

    getUserByEmail(email: string): Promise<User> {
        return new Promise((resolve, reject) => {
            const userModel = getUserModel(this.databaseManager.getConnection());
            userModel.findOne({email: email}, {password: 1}, (error: Error, user: UserModel) =>
                error ? reject(error) : resolve(user))
        });
    }

    getCurrentToken(user: UserModel, token: string): any {
        const userModel = getUserModel(this.databaseManager.getConnection());
        return user.tokens.find((element) => {
            return element.token === token;
        });
    }

    updateUserToken(userId: string, tokenObj: TokenObject, userAgent: string) {
        const userModel = getUserModel(this.databaseManager.getConnection());
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
        return userModel.findByIdAndUpdate(userId, query, {"new": true}).exec();
    }
}