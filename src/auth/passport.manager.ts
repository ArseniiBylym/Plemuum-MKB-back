import * as passport from 'passport';
import { Handler, Request } from 'express';
import * as localStrategy from 'passport-local';
import * as bearerStrategy from 'passport-http-bearer';
import * as basicStrategy from 'passport-http'
import * as DataControllerFactory from '../factory/datacontroller.factory';
import UserDataController from "../data/datacontroller/user.datacontroller";
import { UserCollection, UserModel } from "../data/database/schema/user.schema";
import config from "../../config/config";

const userDataController: UserDataController = DataControllerFactory.getUserDataController();

function passportInit() {

    /* LOCAL STRATEGY USING EMAIL + PASSWORD */
    passport.use(new localStrategy.Strategy({
        usernameField: 'email',
        passwordField: 'password'
    }, localAuth));

    /* BEARER STRATEGY USING TOKENS */
    passport.use(new bearerStrategy.Strategy({
            scope: '',
            realm: '',
            passReqToCallback: true
        }, bearerTokenAuth
    ));

    passport.use(new basicStrategy.BasicStrategy(basicAuth));

    passport.serializeUser((user: UserModel, done: Function) => {
        done(null, user._id);
    });

    passport.deserializeUser((id: string, done: Function) => {
        UserCollection().findById(id, (err, user) => {
            done(err, user)
        });
    });
}

function localAuth(email: string, password: string, done: Function): void {
    userDataController.getUserByEmail(email)
        .then((user: UserModel) => {
            return !user
                ? done(null, false)
                : !user.verifyPasswordSync(password)
                    ? done(null, false)
                    : done(null, user);
        })
        .catch(err => done(err));
}

function bearerTokenAuth(req: Request, token: any, done: Function) {
    userDataController.getUserByToken(token)
        .then((user: UserModel) => {
            if (!user) {
                return done(null, false);
            }
            const currentToken = userDataController.getCurrentToken(user, token);
            if (!currentToken.token_expiry) {
                return done(null, false);
            }
            const now = new Date();
            if (currentToken.token_expiry < now) {
                return done(null, false);
            }
            return done(null, user);
        })
        .catch((err) => done(err));
}

function basicAuth(userid: string, password: string, done: Function) {
    return userid == "admin" && password == config.adminPwd
        ? done(null, true)
        : done(null, false);
}

export default passportInit