import * as express from 'express';
import {Express} from 'express';
import * as passport from 'passport';
import Routes from './api/route/routes';
import * as bodyParser from "body-parser";
import * as path from "path";
import * as logger from 'morgan';
import passportInit from "./service/auth/passport.manager";
import * as session from 'express-session';
import * as expressValidator from 'express-validator';
import * as cors from 'cors';
import OrganizationChecker from "./middleware/organization.checker";
import {getOrganizationDataController} from "./data/datacontroller/organization.datacontroller";


const viewsPath = [path.join(__dirname, "./view"), path.join(__dirname, "./email/raw")];
const sessionOptions = {
    secret: "secret",
    resave: false,
    saveUninitialized: false
};

const app = (): Express => {

    const app = express();

    //https://helmetjs.github.io/
    app.use(require('helmet')());

    app.set("views", viewsPath);
    app.set("view engine", "ejs");
    app.use(logger("dev"));

    // TODO finish and use this before release!
    const corsOptions = {
        "origin": ["http://localhost:3000", "http://localhost:8081", "http://188.142.231.10:8082"],
        "optionsSuccessStatus": 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
        "credentials": true,
    };
    app.use(cors(corsOptions));
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

    // view engine setup
    app.set("views", path.join(__dirname, "./view"));
    app.set("view engine", "jade");

    app.use('/api', (req, res, next) => {
        if (req.cookies.token) {
            req.headers.authorization = `Bearer ${req.cookies.token}`;
        }
        next();
    });

    passportInit();

    app.use("/api/organizations/:orgId", OrganizationChecker(getOrganizationDataController()));

    Routes(app);

    /* Serve API docs */
    app.use('/docs/api', passport.authenticate('basic', {session: false}));
    app.use('/docs/api', express.static(path.join(__dirname, '../docs/api')));
    app.use('/docs/api', (req, res) => {
        res.sendFile('index.html', express.static(path.join(__dirname, '../docs/api')));
    });

    /* Serve Postman collection */
    app.route('/docs/postman')
        .get(passport.authenticate('basic', {session: false}), (req, res) => {
            const file = path.join(__dirname, '../docs/postman/', 'api-v2.postman.json');
            res.download(file.toString());
        });

    return app;
};

export default app();