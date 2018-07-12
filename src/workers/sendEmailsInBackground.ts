import EmailManager from "../manager/email/mail.manager";
import UserDataController from "../data/datacontroller/user.datacontroller";
import config from "../../config/config";
import {resetPasswordDataController} from "../data/datacontroller/resetpassword.datacontroller";
import {default as getLogger} from "../util/logger";
import { sleep } from "../util/util";
export default async function sendEmailsInBackground(users: any[]) {

    const USERNAME = config.plenuumBotEmail;
    const SECRET = config.plenuumBotPass;
    const SECURE = true; // This has effect on port, use carefully
    const PORT = SECURE ? 465 : 587;
    const HOST = 'smtp.gmail.com';
    const transporter = EmailManager.getTransport(HOST, PORT, SECURE, USERNAME, SECRET);

    for (let i = 0; i < users.length; i++){
        await sleep(2000);

        const origin = config.webappDomain;
        const {email, firstName, _id, orgName} = users[i];
        const {token, token_expiry} = UserDataController.generateToken(1);
        const data = {userId: _id, token: token, token_expiry: token_expiry, reseted: false};

        try {
            const response = await resetPasswordDataController.saveResetPassword(data);
            let link = origin + "/set_new_password?token=" + response.token + "&email=" + email + "&welcome=true&name=" + firstName;
            const mailService = new EmailManager();
            await mailService.sendWelcomeEmail(email, firstName, link, orgName, transporter);
        } catch (error) {
            getLogger().error({
                type: "error",
                request: {
                    user: users[i]
                },
                message: error,
                timeStamp: new Date()
            });
        }
    }
};