
import { Model, Document } from 'mongoose';
import DatabaseManager from "../database/database.manager";

export default class BaseDataController<T extends Document> {

    public static COMMON = "common";
    protected databaseManager: DatabaseManager;
    public getDatabaseModel: Function;

    constructor(databaseManager: DatabaseManager, getDatabaseModel: Function) {
        this.databaseManager = databaseManager;
        this.getDatabaseModel = getDatabaseModel;
    }

    public clearData(dbName?: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const userModel: Model<T> = this.getDatabaseModel(this.databaseManager.getConnection(), dbName);
            userModel.remove({}, (error: any) => error ? reject(error) : resolve())
        })
    }
}