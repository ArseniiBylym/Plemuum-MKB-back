import * as mongoose from 'mongoose';

export default class DatabaseManager {
    private dbConnection: mongoose.Connection;
    constructor(mongoUrl: string) {
        this.dbConnection = mongoose.createConnection(mongoUrl)
    }

    public getConnection(): mongoose.Connection {
        return this.dbConnection;
    }
}