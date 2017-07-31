import * as express from 'express'
import { Express } from 'express'
import config from '../config/config';
import * as DatabaseFactory from './factory/database.factory';
import Routes from './route/routes';
import * as bodyParser from "body-parser";

const app = (): Express => {
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    Routes(app);
    return app;
}

export default app();