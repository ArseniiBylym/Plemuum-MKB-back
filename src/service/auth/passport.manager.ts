import * as passport from 'passport';
import * as localStrategy from 'passport-local';
import * as basicStrategy from 'passport-http'
import { Strategy as JwtStrategy } from 'passport-jwt'
import config, { jwtOptions } from "../../../config/config";
import UserDataController from "../../data/datacontroller/user.datacontroller";
import { UserCollection, UserModel } from "../../data/database/schema/common/user.schema";

function passportInit() {
    passport.use(jwtAuth());
    passport.use(localAuth());
    passport.use(basicAuth());

    passport.serializeUser((user: UserModel, done: Function) => done(null, user._id));
    passport.deserializeUser((id: string, done: Function) =>
        UserDataController.getUserById(id, true)
            .then((user) => done(null, user))
            .catch((err) => done(err, null))
    )
}

function localAuth() {
    return new localStrategy.Strategy({
        usernameField: 'email',
        passwordField: 'password'
    }, (email: string, password: string, done: Function): void => {
        UserCollection().findOne({email: email}, {password: 1})
            .then((user: UserModel) => {
                return !user
                    ? done(null, false)
                    : !user.verifyPasswordSync(password)
                        ? done(null, false)
                        : done(null, user);
            })
            .catch(err => done(err));
    })
}

function basicAuth() {
    return new basicStrategy.BasicStrategy((userid: string, password: string, done: Function) =>
        (userid == "admin" && password == config.adminPwd) ? done(null, true) : done(null, false)
    )
}

function jwtAuth() {
    return new JwtStrategy(jwtOptions, async (payload, next) => {
        const user = await UserDataController.getUserById(payload.id, true, false, true);
        if (user) {
            user.admin = payload.admin;
        }

        const createdAt = new Date(payload.createdAt);
        if (createdAt < user.passwordUpdatedAt) {
            next(null, false);
        }else{
            next(null, user ? user : false);
        }
    });
}

export default passportInit