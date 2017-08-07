import * as passport from 'passport';
import { Handler, Request } from 'express';
import * as localStrategy from 'passport-local';
import * as bearerStrategy from 'passport-http-bearer';
import * as DataControllerFactory from '../factory/datacontroller.factory';
import UserDataController from "../data/datacontroller/user.datacontroller";
import { UserModel } from "../data/database/schema/user.schema";

const userDataController: UserDataController = DataControllerFactory.getUserDataController();

function passportInit(): Handler {

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

    return passport.initialize();
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
        .catch(err => {
            return done(err);
        });
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
        .catch((err) => {
            done(err);
        });
}

export default passportInit