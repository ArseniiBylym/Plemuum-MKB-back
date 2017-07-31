import * as express from 'express'
import { Express } from 'express'
import config from '../config/config';
import * as DatabaseFactory from './factory/database.factory';
import Routes from './route/routes';

class App {
    public express: Express;

    constructor() {
        this.express = express();
        DatabaseFactory.getDatabaseManager().connect(config.mongoUrl);
        Routes(this.express);
    }
}

export default new App().express