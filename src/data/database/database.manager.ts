import * as mongoose from 'mongoose';

let dbConnection: mongoose.Connection;
const connect = (mongoUrl: string) => dbConnection = mongoose.createConnection(mongoUrl);

export { dbConnection, connect }