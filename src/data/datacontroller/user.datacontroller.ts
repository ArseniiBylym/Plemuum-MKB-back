import { User } from "../models/user.model";
import { Model } from 'mongoose';
import { getUserModel, UserModel } from "../database/schema/user.schema";
import DatabaseManager from "../database/database.manager";
import BaseDataController from "./base.datacontroller";

export default class UserDataController extends BaseDataController<UserModel> {

    constructor(databaseManager: DatabaseManager) {
        super(databaseManager, getUserModel);
    }

    public saveUser(user: User): Promise<any> {
        return new Promise((resolve, reject) => {
            const userModel = getUserModel(this.databaseManager.getConnection());
            new userModel(user).save((error: Error, savedUser: any) => {
                userModel.findById(savedUser._id, (error, user: any) => {
                    error ? reject(error) : resolve(user);
                });
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
}