import * as express from 'express'
import { Express } from 'express'
import config from '../config/config';
import databaseManager from './data/database/database.manager';

const controllers = require('./controllers/controllers');

class App {
    public express: Express;

    constructor() {
        this.express = express();
        databaseManager.connect(config.mongoUrl);
        controllers.set(this.express);
    }
}

export default new App().express