import { User } from "../models/user.model";
import { Model } from 'mongoose';
import { getDatabaseModel, UserModel } from "../database/schema/user.schema";
import DatabaseManager from "../database/database.manager";
import BaseDataController from "./base.datacontroller";

export default class UserDataController extends BaseDataController<UserModel> {

    constructor(databaseManager: DatabaseManager) {
        super(databaseManager, getDatabaseModel);
    }

    public saveUser(user: User): Promise<User> {
        return new Promise((resolve, reject) => {
            const userModel = getDatabaseModel(this.databaseManager.getConnection());
            new userModel(user).save((error: Error, user: User) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(user);
                }
            });
        });
    }

    public getOrganizationUsers(orgId: any): Promise<User[]> {
        return new Promise((resolve, reject) => {
            const userModel = getDatabaseModel(this.databaseManager.getConnection());
            const query: any = {orgIds: {$in: [orgId]}};
            userModel.find(query, (error: Error, users: User[]) => error ? reject(error) : resolve(users))
        })
    }
}