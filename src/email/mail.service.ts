import config from "../../config/config";

const nodemailer = require('nodemailer');
const ejs = require('ejs');

const USERNAME = config.plenuumBotEmail;
const SECRET = config.plenuumBotPass;
const SECURE = true; // This has effect on port, use carefully
const PORT = SECURE ? 465 : 587;
const HOST = 'smtp.gmail.com';

const MAIL_TEMPLATE_DIR = __dirname + "/content/";
const WELCOME_TEMPLATE = "welcome.ejs";
const RESET_PASSWORD_TEMPLATE = "resetpassword.ejs";

export default class EmailService {

    private static getTransport(host: string, port: number, secure: boolean, username: string, password: string) {

        return nodemailer.createTransport({
            host: host,
            port: port,
            secure: secure,
            auth: {
                user: username,
                pass: password
            },
            debug: config.debugMode
        });
    };

    private getHtmlFromEjs(template: string, data: any): Promise<any> {
        return new Promise((resolve, reject) => ejs.renderFile(MAIL_TEMPLATE_DIR + template, data,
            (error: any, html: any) => error ? reject(error) : resolve(html)));
    }


    private static getMailOptions(html: string, email: string) {
        const message = "This is an automated answer, there is no need to reply!";
        return {
            from: 'bot@plenuum.com',
            to: email,
            subject: 'Pleenum Change password step 2',
            text: message,
            html: html
        };
    };

    public sendWelcomeEmail(email: string, firstName: string, link: string, organization: string): Promise<any> {
        const data = {
            firstName: firstName,
            company: organization,
            email: email,
            link: link
        };
        return this.getHtmlFromEjs(WELCOME_TEMPLATE, data)
            .then((html) => {
                const transporter = EmailService.getTransport(HOST, PORT, SECURE, USERNAME, SECRET);
                const mailOptions = EmailService.getMailOptions(html, email);
                return new Promise((resolve, reject) => {
                    transporter.sendMail(mailOptions, (error: any, info: any) => error ? reject({
                        error: error,
                        info: info
                    }) : resolve(info));
                })
            })
    };

    public sendResetEmail(email: string, link: string): Promise<any> {
        const data = {
            link: link
        };
        return this.getHtmlFromEjs(RESET_PASSWORD_TEMPLATE, data)
            .then((html) => {
                const transporter = EmailService.getTransport(HOST, PORT, SECURE, USERNAME, SECRET);
                const mailOptions = EmailService.getMailOptions(html, email);
                return new Promise((resolve, reject) => {
                    transporter.sendMail(mailOptions, (error: any, info: any) => error ? reject({
                        error: error,
                        info: info
                    }) : resolve(info));
                })
            });
    };

}
