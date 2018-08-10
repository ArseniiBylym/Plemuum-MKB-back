import * as mongoose from 'mongoose';
import { Document, Model, Schema, Connection } from 'mongoose';

export default class DatabaseManager {
    private dbConnection: mongoose.Connection;
    private connectionPromise: Promise<Connection>;

    constructor(mongoUrl: string) {
        /* Use default Promise for mongoose */
        (mongoose as any).Promise = global.Promise;

        this.dbConnection = null as any;

        this.connectionPromise = new Promise((resolve, reject) => {
            if (!this.dbConnection) {
                this.dbConnection = mongoose.connect(mongoUrl, { useMongoClient: true });
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

    public openConnection(): Promise<any> {
        return this.connectionPromise;
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

    public createCollection<T extends Document>(dbName: string, modelName: string, schema: Schema): Model<T> {
        return this.dbConnection.useDb(dbName).model<T>(modelName, schema);
    }
}