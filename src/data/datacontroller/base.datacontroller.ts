import { Document, Model } from 'mongoose';
import DatabaseManager from "../database/database.manager";

export default class BaseDataController<T extends Document> {

    public static COMMON = "common";
    protected databaseManager: DatabaseManager;
    public getDatabaseModel: Function;

    constructor(databaseManager: DatabaseManager, getDatabaseModel: Function) {
        this.databaseManager = databaseManager;
        this.getDatabaseModel = getDatabaseModel;
    }
}