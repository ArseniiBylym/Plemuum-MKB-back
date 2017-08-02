import * as express from 'express'
import { Express, Request ,Response } from 'express'
import Routes from './route/routes';
import * as bodyParser from "body-parser";
import * as path from "path";

const app = (): Express => {
    const app = express();
    app.set("views", path.join(__dirname, "./view"));
    app.set("view engine", "jade");
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    Routes(app);
    return app;
};

export default app();