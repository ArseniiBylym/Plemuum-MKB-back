import * as mongoose from 'mongoose';

export default class DatabaseManager {
    private dbConnection: mongoose.Connection;

    constructor() {
        /* Use default Promise for mongoose */
        (mongoose as any).Promise = global.Promise;
    }

    public openConnection(mongoUrl: string): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.dbConnection) {
                this.dbConnection = mongoose.createConnection(mongoUrl);
                // CONNECTION EVENTS
                // When successfully connected
                this.dbConnection.on('connected', () => {
                    console.log('Mongoose default connection open to ' + mongoUrl);
                    resolve();
                });
                // If the connection throws an error
                this.dbConnection.on('error', function (err) {
                    console.log('Mongoose default connection error: ' + err);
                    reject(err);
                });

                // When the connection is disconnected
                this.dbConnection.on('disconnected', function () {
                    console.log('Mongoose default connection disconnected');
                });
            } else {
                resolve();
            }
        });
    }

    public getConnection(): mongoose.Connection {
        return this.dbConnection;
    }

    public closeConnection(): Promise<any> {
        return new Promise((resolve, reject) => {
                if (this.dbConnection) {
                    this.dbConnection.close(() => {
                        console.log('Mongoose default connection disconnected through app termination');
                        resolve();
                    })
                } else {
                    resolve();
                }
            }
        );
    }
}