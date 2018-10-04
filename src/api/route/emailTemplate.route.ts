import { Express } from "express";
import EmailTemplateController from "../controller/emailTemplate.controller";
import * as passport from 'passport';
import checkAdmin from '../../middleware/admin.checker';

export default (app: Express, EmailTemplateController: EmailTemplateController) => {
app.route('/api/organizations/:orgId/emailTemplate/:emailType/:emailLang')
    .get(passport.authenticate('jwt', {session: false}), checkAdmin(), EmailTemplateController.getEmailTemplate.bind(EmailTemplateController))
    .post(passport.authenticate('jwt', {session: false}), checkAdmin(), EmailTemplateController.createEmailTemplate.bind(EmailTemplateController))
    .patch(passport.authenticate('jwt', {session: false}), checkAdmin(), EmailTemplateController.modifyEmailTemplate.bind(EmailTemplateController));
}