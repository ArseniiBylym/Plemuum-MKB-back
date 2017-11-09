import { Express } from 'express';
import LogController from "../controller/log.controller";
import * as passport from 'passport';
import checkAdmin from '../../middleware/admin.checker';

export default (app: Express, logController: LogController) => {
    app.route("/api/logs")
        .get(passport.authenticate('jwt', {session: false}), checkAdmin(), logController.getLogs.bind(logController));
}