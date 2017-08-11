import * as express from 'express';
import { Express } from 'express';
import * as passport from 'passport';
import Routes from './route/routes';
import * as bodyParser from "body-parser";
import * as path from "path";
import * as logger from 'morgan';
import passportInit from "./auth/passport.manager";
import * as session from 'express-session';

const viewsPath = [path.join(__dirname, "./view"), path.join(__dirname, "./email/raw")];
const sessionOptions = {
    secret: "secret",
    resave: false,
    saveUninitialized: false
};

const app = (): Express => {
    const app = express();

    app.set("views", viewsPath);
    app.set("view engine", "ejs");
    if (process.env.NODE_ENV == "dev") {
        app.use(logger("dev"));
    }
    app.use(require('cookie-parser')());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(require('express-device').capture());
    app.use(session(sessionOptions));
    app.use(passport.initialize());
    app.use(passport.session());

    passportInit();
    Routes(app);

    return app;
};

export default app();