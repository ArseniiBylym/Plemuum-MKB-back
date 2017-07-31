import * as express from 'express'
import { Express } from 'express'
import config from '../config/config';
import * as DatabaseFactory from './data/database/database.factory';

const controllers = require('./controllers/controllers');

class App {
    public express: Express;

    constructor() {
        this.express = express();
        DatabaseFactory.getDatabaseManager().connect(config.mongoUrl);
        controllers.set(this.express);
    }
}

export default new App().express