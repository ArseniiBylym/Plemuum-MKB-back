import * as passport from 'passport';
import * as localStrategy from 'passport-local';
import * as basicStrategy from 'passport-http';
import { Strategy as JwtStrategy } from 'passport-jwt';
import { default as config, jwtOptions } from "../../../config/config";
import UserDataController from "../../data/datacontroller/user.datacontroller";
import { UserCollection, UserModel } from "../../data/database/schema/common/user.schema";

function passportInit() {
    passport.use(basicAuth());
    passport.use('jwt', jwtAuth());
    passport.use(localAuth());
    passport.use('jwtWithoutExpiryCheck', jwtWithoutExpiryCheckAuth());

    passport.serializeUser((user: UserModel, done: Function) => done(null, user._id));
    passport.deserializeUser((id: string, done: Function) => {
            return UserDataController.getUserById(id, true)
                .then((user) => done(null, user))
                .catch((err) => done(err, null))
        }
    )
    passport.serializeUser((user: UserModel, done: Function) => {});
    passport.deserializeUser((id: string, done: Function) => {}
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
            UserCollection().findOne({email: email, isActive : true}, {password: 1})
                .then((user: UserModel | null) => {
                    return !user
                        ? done(null, false)
                        : !user.verifyPasswordSync(password)
                            ? done(null, false)
                            : done(null, user);
                })
                .catch((err: any) => done(err));
        }
    })
}

function basicAuth() {
    return new basicStrategy.BasicStrategy((userid: string, password: string, done: Function) => {
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
            const user: UserModel = await UserDataController.getUserById(payload.id, true, false, true);

            if (!validateUser(user, payload.createdAt)) {
                next(null, false);
                return;
            }

            user.lastActive = new Date();
            user.admin = payload.admin;
            await UserDataController.updateUser(payload.id, user);
            next(null, user);
        }
    });
}

function jwtWithoutExpiryCheckAuth() {
    let jwtWithoutExpiryTimeCheckOptions = Object.assign({}, jwtOptions);
    jwtWithoutExpiryTimeCheckOptions.ignoreExpiration = true;
    return new JwtStrategy(jwtWithoutExpiryTimeCheckOptions, async (payload, next) => {
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
            const user: UserModel = await UserDataController.getUserById(payload.id, true, false, true);

            if (!validateUser(user, payload.createdAt)) {
                next(null, false);
                return;
            }

            user.lastActive = new Date();
            user.admin = payload.admin;
            await UserDataController.updateUser(payload.id, user);
            next(null, user);
        }
    });
}

function validateUser(user: UserModel, createdAt: any) {
    return user && user.isActive && new Date(createdAt) >= user.passwordUpdatedAt;
}

export default passportInit