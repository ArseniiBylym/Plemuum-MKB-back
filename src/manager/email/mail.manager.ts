import config from "../../../config/config";
import { promisify } from "util";
import * as sgMail from '@sendgrid/mail';
import EmailTemplateDataController from '../../data/datacontroller/emailTemplate.datacontroller';
import UserDataController from '../../data/datacontroller/user.datacontroller';


const ejs = require('ejs');

// const USERNAME = config.plenuumBotEmail;
// const SECRET = config.plenuumBotPass;
const SENGRID_TOKEN = config.plenuumSengridToken;

// const MAIL_TEMPLATE_DIR = __dirname + "/content/";
// const WELCOME_TEMPLATE = "welcome.ejs";
// const SURVEY_RESULT = "surveyResult.ejs";
// const SURVEY_RESULT_FOR_MANAGER = "surveyResultForManager.ejs";
// const SURVEYNOTIFICATION_TEMPLATE = "surveyNotification.ejs";
// const RESET_PASSWORD_TEMPLATE = "resetpassword.ejs";

export default class EmailManager {

    // renderFile = promisify(ejs.renderFile);

    static getTransport(key: string) {
        sgMail.setApiKey(key);
    };

    // getHtmlFromEjs(template: string, data: any): Promise<any> {
    //     return this.renderFile(MAIL_TEMPLATE_DIR + template, data);
    // }

    getUserAndOrgLang(email: string) {
        return UserDataController.getUserAndOrgLang(email)
    }

    async getHtmlFromDB(data: any, orgId: string, emailType: string, email: string) {
        let languages = await this.getUserAndOrgLang(email);
        let userAndOrgLang: any = { userLang: languages.lang, orgLang: languages.organization[0].lang };
        let emailTempalte = await EmailTemplateDataController.getEmailTemplate(orgId, emailType, userAndOrgLang);
        if (!emailTempalte) {
            throw new Error("Email template not found!");
        }
        return { html: ejs.render(emailTempalte.html, data), subject: emailTempalte.subject };
    }

    static getMailOptions(email: string, html: string, subject: string,
        message: string = "This is an automated answer, there is no need to reply!") {
        return {
            from: 'bot@plenuum.com',
            to: email,
            subject: subject,
            text: message,
            html: html
        };
    };


    public async sendSurveyNotificationEmail(email: string, firstName: string, link: string, organization: string, transporter?: any): Promise<any> {
        const data = {
            firstName: firstName,
            company: organization,
            email: email,
            link: link
        };
        return this.getHtmlFromDB(data, organization, "surveyNotification", email)
            .then((emailTemplate: any) => {
                EmailManager.getTransport(SENGRID_TOKEN);
                const mailOptions = EmailManager.getMailOptions(email, emailTemplate.html, emailTemplate.subject);
                return new Promise((resolve, reject) => {
                    console.log("sending mail");
                    sgMail.send(mailOptions)
                        .then(result => resolve(result))
                        .catch((err) => reject(err));
                })
            }).catch((err) => console.log("error sending survey notif mail: " + err));
    };
    //survey2 not used
    public sendSurveyAnswer(email: string, manager: any, respondent: any, surveyWithAnswer: any, organization: string, transporter?: any, forManager?: Boolean): Promise<any> {
        const answersArr = surveyWithAnswer.questions.map((itmes: any) => { return itmes.answer.answerText });
        const questionsArr = surveyWithAnswer.questions.map((question: any) => { return question.text });
        const surveyTitle = surveyWithAnswer.surveyTodo.survey.title;

        const data = {
            managerFirstName: manager.firstName,
            managerLastName: manager.lastName,
            respondentFirstName: respondent.firstName,
            respondentLastName: respondent.lastName,
            company: organization,
            email: email,
            answersArr: answersArr,
            questionsArr: questionsArr,
            surveyTitle: surveyTitle
        };

        return this.getHtmlFromDB(data, organization, forManager ? 'surveyResultForManager' : 'surveyResult', email)
            .then((emailTemplate: any) => {
                EmailManager.getTransport(SENGRID_TOKEN);
                const mailOptions = EmailManager.getMailOptions(email, emailTemplate.html, forManager ? `Kitöltött TÉR kérdőív (${respondent.lastName} ${respondent.firstName})- Összefoglaló` : "Kitöltött TÉR kérdőív - Összefoglaló");
                return new Promise((resolve, reject) => {
                    sgMail.send(mailOptions)
                        .then(result => resolve(result))
                        .catch((err) => reject(err));
                })
            }).catch((err) => { console.log("mail send error: " + err) });
    };

    public async sendWelcomeEmail(email: string, firstName: string, link: string, organization: string, transporter?: any): Promise<any> {
        const data = {
            firstName: firstName,
            company: organization,
            email: email,
            link: link,
            privacyLink: `${config.webappDomain}/privacy`
        };
        let emailTemplate: any = await this.getHtmlFromDB(data, organization, 'welcome', email);
        try {
            EmailManager.getTransport(SENGRID_TOKEN);
            const mailOptions = EmailManager.getMailOptions(email, emailTemplate.html, emailTemplate.subject)
            return new Promise((resolve, reject) => {
                sgMail.send(mailOptions)
                    .then(result => resolve(result))
                    .catch((err) => reject(err));
            }).catch((e) => {
                console.log("failed to send 'Welcome' email: " + e);
            });
        }
        catch (e) {
            console.log("welcome mail send error: " + e)
        }
    };

    public async sendResetEmail(email: string, link: string, orgId: string, firstName?: string): Promise<any> {
        const data = {
            link: link,
            firstName: firstName
        };
        return this.getHtmlFromDB(data, orgId, "resetPassword", email)
            .then((emailTemplate: any) => {
                EmailManager.getTransport(SENGRID_TOKEN);
                const mailOptions = EmailManager.getMailOptions(email, emailTemplate.html, emailTemplate.subject);
                return new Promise((resolve, reject) => {
                    sgMail.send(mailOptions)
                        .then(result => resolve(result))
                        .catch((err) => reject(err));
                })
            }).catch((err) => { console.log("reset mail send error: " + err); });
    };

}
