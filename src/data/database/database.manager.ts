import * as mongoose from 'mongoose';

module.exports = {
    dbConnection: mongoose.Connection,
    connect: function (mongoUrl: string) {
        this.dbConnection = mongoose.createConnection(mongoUrl);
    }
}