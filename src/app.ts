import * as express from 'express'
import { Express } from 'express'
import config from '../config/config';
import * as DatabaseFactory from './factory/database.factory';
import * as Controllers from './controller/controllers'

class App {
    public express: Express;

    constructor() {
        this.express = express();
        DatabaseFactory.getDatabaseManager().connect(config.mongoUrl);
        Controllers.set(this.express);
    }
}

export default new App().express