import { User } from "../models/user.model";
import * as mongoose from "mongoose";
import { UserModel, getDatabaseModel } from "../database/schema/user.schema";
import * as databaseManager from "../database/database.manager";
import { DatabaseManager } from "../database/database.manager";

let instance: UserDataController;

export class UserDataController {

    private databaseManager: DatabaseManager;

    constructor(databaseManager: DatabaseManager) {
        this.databaseManager = databaseManager;
    }
    public saveUser(user: User): Promise<User> {
        return new Promise((resolve, reject) => {
            const userModel: mongoose.Model<UserModel> = getDatabaseModel(this.databaseManager.getConnection());
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

const controllerFactory = (databaseManager: DatabaseManager) => {
    if (instance) {
        return instance;
    } else {
        return new UserDataController(databaseManager);
    }
}

export default controllerFactory;