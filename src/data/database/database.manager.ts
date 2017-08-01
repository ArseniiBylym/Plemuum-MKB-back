import * as mongoose from 'mongoose';

export default class DatabaseManager {
    private dbConnection: mongoose.Connection;

    constructor(mongoUrl: string) {
        /* Use default Promise for mongoose */
        (mongoose as any).Promise = global.Promise;
        this.dbConnection = mongoose.createConnection(mongoUrl)
    }

    public getConnection(): mongoose.Connection {
        return this.dbConnection;
    }
}