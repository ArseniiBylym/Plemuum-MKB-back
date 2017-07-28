import * as mongoose from 'mongoose';

export class DatabaseManager {
    private dbConnection: mongoose.Connection;
    constructor() { }

    public connect(mongoUrl: string) {
        this.dbConnection = mongoose.createConnection(mongoUrl)
    }

    public getConnection(): mongoose.Connection {
        return this.dbConnection;
    }
}

export default new DatabaseManager();