import * as express from 'express'
import { Express } from 'express'
import Routes from './route/routes';
import * as bodyParser from "body-parser";
import * as path from "path";
import * as logger from 'morgan';
import passportInit from "./auth/passport.manager";

const app = (): Express => {
    const deviceChecker = require('express-device');
    const app = express();
    app.set("views", [path.join(__dirname, "./view"), path.join(__dirname, "./email/raw")]);
    app.set("view engine", "ejs");
    if (process.env.NODE_ENV == "dev") {
        app.use(logger("dev"));
    }
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(deviceChecker.capture());
    app.use(passportInit());
    Routes(app);

    return app;
};

export default app();