import { User } from "../models/user.model";
import * as mongoose from "mongoose";
import { UserModel, getDatabaseModel } from "../database/schema/user.schema";
import * as databaseManager from "../database/database.manager";
import DatabaseManager from "../database/database.manager";

export default class UserDataController {

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

    public handleUserSave(): Promise<Object> {
        const random: number = Math.floor(Math.random() * (1000 + 1));
        const user: User = {
            firstName: "Kovacs",
            lastName: "Bela",
            email: `bela.kovacs@${random}gmail.com`,
            tokens: [],
            pictureUrl: "",
            orgIds: [],
            password: "asd123"
        };
        return this.saveUser(user)
    }
}