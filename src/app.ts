import * as express from 'express'
import { Express } from 'express'
import Routes from './route/routes';
import * as bodyParser from "body-parser";
import * as path from "path";
import * as logger from 'morgan';
import passportInit from "./auth/passport.manager";
import * as passport from 'passport';
import EmailService from "./email/mail.service";

const app = (): Express => {
    const emailService: EmailService = new EmailService();

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

    app.route('/mail/send/welcome')
        .get(passport.authenticate('basic', {session: false}), (req, res, next) => {
            emailService.sendWelcomeEmail("peter.szabo@hipteam.io", "Peter", "http://www.hipteam.io", "hipteam")
                .then((info) => res.json({msg: "sent", info: info}))
                .catch(reason => res.status(500).json(reason));
        });
    app.route('/mail/send/resetpassword')
        .get(passport.authenticate('basic', {session: false}), (req, res, next) => {
            emailService.sendResetEmail("peter.szabo@hipteam.io", "http://www.hipteam.io")
                .then((info) => res.json({msg: "sent", info: info}))
                .catch(reason => res.status(500).json(reason));
        });
    app.route('/mail/welcome')
        .get(passport.authenticate('basic', {session: false}), (req, res, next) => res.render('welcome', {}));

    app.route('/mail/resetpassword')
        .get(passport.authenticate('basic', {session: false}), (req, res, next) => res.render('resetpassword', {link: 'http://www.google.com'}));

    return app;
};

export default app();