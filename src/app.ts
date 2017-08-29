import * as express from 'express';
import { Express } from 'express';
import * as passport from 'passport';
import Routes from './api/route/routes';
import * as bodyParser from "body-parser";
import * as path from "path";
import * as logger from 'morgan';
import passportInit from "./service/auth/passport.manager";
import * as session from 'express-session';
import * as expressValidator from 'express-validator';
import * as cors from 'cors';

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

    // TODO finish and use this before release!
    const corsOptions = {
        origin: 'http://example.com',
        optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    };

    app.use(cors());

    app.use(require('cookie-parser')());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(require('express-device').capture());
    app.use(session(sessionOptions));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(expressValidator({
        errorFormatter: function (param, msg, value) {
            let namespace = param ? param.split('.') : []
                , root = namespace.shift()
                , formParam = root;

            while (namespace.length) {
                formParam += '[' + namespace.shift() + ']';
            }
            return {
                param: formParam,
                msg: msg,
                value: value
            };
        }
    }));

    passportInit();
    Routes(app);

    return app;
};

export default app();