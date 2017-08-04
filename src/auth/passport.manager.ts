import * as passport from 'passport';
import { Handler } from 'express';
import * as localStrategy from 'passport-local';
import { getUserModel } from "../data/database/schema/user.schema"
import { getDatabaseManager } from "../factory/database.factory"

function passportInit(): Handler {

    passport.use(new localStrategy.Strategy({
        usernameField: 'email',
        passwordField: 'password'
    }, (email, password, done): void => {
        let userModel = getUserModel(getDatabaseManager().getConnection());
        userModel.findOne({email: email}, {password: 1}, (err, user) => {
            if (err) {
                return done(err);
            } else if (!user) {
                return done(null, false);
            } else if (!user.verifyPasswordSync(password)) {
                return done(null, false);
            }
            return done(null, user);
        });
    }));

    return passport.initialize();
}

export default passportInit