import { User } from "../models/user.model";
import * as mongoose from "mongoose";
import { UserModel, getDatabaseModel } from "../database/schema/user.schema";
import * as databaseManager from "../database/database.manager";

const saveUser = (user: User): Promise<User> => {
    return new Promise((resolve, reject) => {
        const userModel: mongoose.Model<UserModel> = getDatabaseModel(databaseManager.dbConnection);
        new userModel(user).save((error: Error, user: User) => {
            if (error) {
                reject(error);
            } else {
                resolve(user);
            }
        });
    });
}

export { saveUser }