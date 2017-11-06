import * as passport from 'passport';
import * as localStrategy from 'passport-local';
import * as basicStrategy from 'passport-http';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { default as config, jwtOptions } from "../../../config/config";
import UserDataController from "../../data/datacontroller/user.datacontroller";
import { UserCollection, UserModel } from "../../data/database/schema/common/user.schema";

function passportInit() {
    passport.use(basicAuth());
    passport.use(jwtAuth());
    passport.use(localAuth());

    passport.serializeUser((user: UserModel, done: Function) => done(null, user._id));
    passport.deserializeUser((id: string, done: Function) => {
            return UserDataController.getUserById(id, true)
                .then((user) => done(null, user))
                .catch((err) => done(err, null))
        }
    )
}

function localAuth() {
    return new localStrategy.Strategy({
        usernameField: 'email',
        passwordField: 'password'
    }, (email: string, password: string, done: Function): void => {
        if (email === "admin") {
            return password === config.adminPwd ? done(null, true) : done(null, false)
        } else {
            UserCollection().findOne({email: email}, {password: 1})
                .then((user: UserModel) => {
                    return !user
                        ? done(null, false)
                        : !user.verifyPasswordSync(password)
                            ? done(null, false)
                            : done(null, user);
                })
                .catch(err => done(err));
        }
    })
}

function basicAuth() {
    return new basicStrategy.BasicStrategy((userid: string, password: string, done: Function) => {
            console.log(userid, password);
            return (userid === "admin" && password === config.adminPwd) ? done(null, true) : done(null, false);
        }
    )
}

function jwtAuth() {
    return new JwtStrategy(jwtOptions, async (payload, next) => {
        if (payload.id === "admin") {
            const admin = {
                _id: "admin",
                firstName: "admin",
                lastName: "admin",
                email: "admin",
                admin: true
            };
            next(null, admin);
        } else {
            const user = await UserDataController.getUserById(payload.id, true, false, true);
            if (!user) {
                next(null, false);
                return;
            }
            user.admin = payload.admin;
            next(null, new Date(payload.createdAt) >= user.passwordUpdatedAt ? user : false);
        }
    });
}

export default passportInit