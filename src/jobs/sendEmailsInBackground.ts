import EmailManager from "../manager/email/mail.manager";
import UserDataController from "../data/datacontroller/user.datacontroller";
import config from "../../config/config";
import {resetPasswordDataController} from "../data/datacontroller/resetpassword.datacontroller";
import {default as getLogger} from "../util/logger";



export default async function (agenda:any, transporter:any) {

    agenda.define('sendWelcomeEmailsInBackground', async function(job:any, done:any) {

        let user = job.attrs.data;

        const origin = config.webappDomain;
        const {email, firstName, _id, orgName} = user;
        const {token, token_expiry} = UserDataController.generateToken(1);
        const data = {userId: _id, token: token, token_expiry: token_expiry, reseted: false};

        try {
            const response = await resetPasswordDataController.saveResetPassword(data);
            let link = origin + "/set_new_password?token=" + response.token + "&email=" + email + "&welcome=true&name=" + firstName;
            const mailService = new EmailManager();
            await mailService.sendWelcomeEmail(email, firstName, link, orgName, transporter);
            await done();
        } catch (error) {
            getLogger().error({
                type: "error",
                request: {
                    user: user
                },
                message: error,
                timeStamp: new Date()
            });
        }

    })
};