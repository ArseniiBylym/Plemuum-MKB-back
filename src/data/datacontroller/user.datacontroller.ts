import { User } from "../models/user.model";
import { Model } from 'mongoose';
import { UserModel, getDatabaseModel } from "../database/schema/user.schema";
import * as databaseManager from "../database/database.manager";
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
}