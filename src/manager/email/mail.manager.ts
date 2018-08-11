import config from "../../../config/config";
import { promisify } from "util";
import * as sgMail from '@sendgrid/mail';

const ejs = require('ejs');

const USERNAME = config.plenuumBotEmail;
const SECRET = config.plenuumBotPass;
const SENGRID_TOKEN = config.plenuumSengridToken;

const MAIL_TEMPLATE_DIR = __dirname + "/content/";
const WELCOME_TEMPLATE = "welcome.ejs";
const SURVEY_RESULT = "surveyResult.ejs";
const SURVEY_RESULT_FOR_MANAGER = "surveyResultForManager.ejs";
const SURVEYNOTIFICATION_TEMPLATE = "surveyNotification.ejs";
const RESET_PASSWORD_TEMPLATE = "resetpassword.ejs";

export default class EmailManager {

    renderFile = promisify(ejs.renderFile);

    static getTransport(key: string) {
        sgMail.setApiKey(key);
    };

    getHtmlFromEjs(template: string, data: any): Promise<any> {
        return this.renderFile(MAIL_TEMPLATE_DIR + template, data);
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


    public sendSurveyNotificationEmail(email: string, firstName: string, link: string, organization: string, transporter?:any): Promise<any> {
        const data = {
            firstName: firstName,
            company: organization,
            email: email,
            link: link
        };
        return this.getHtmlFromEjs(SURVEYNOTIFICATION_TEMPLATE, data)
            .then((html) => {
                EmailManager.getTransport(SENGRID_TOKEN);
                const mailOptions = EmailManager.getMailOptions(email, html, "New survey");
                return Promise.resolve(sgMail.send(mailOptions))
            })
    };

    public sendSurveyAnswer(email: string, manager:any, respondent:any, surveyWithAnswer:any, organization: string, transporter?:any, forManager?:Boolean): Promise<any> {
        const answersArr = surveyWithAnswer.questions.map((itmes:any) => {return itmes.answer.answerText});
        const questionsArr = surveyWithAnswer.questions.map((question:any) => {return question.text});
        const surveyTitle = surveyWithAnswer.surveyTodo.survey.title;
        const data = {
            manager: manager,
            respondent: respondent,
            company: organization,
            email: email,
            answersArr: answersArr,
            questionsArr: questionsArr,
            surveyTitle: surveyTitle
        };
        return this.getHtmlFromEjs(forManager ? SURVEY_RESULT_FOR_MANAGER : SURVEY_RESULT, data)
            .then((html) => {
                EmailManager.getTransport(SENGRID_TOKEN);
                const mailOptions = EmailManager.getMailOptions(email, html, "Survey result");
                return Promise.resolve(sgMail.send(mailOptions))
            })
    };

    public sendWelcomeEmail(email: string, firstName: string, link: string, organization: string, transporter?:any): Promise<any> {
        const data = {
            firstName: firstName,
            company: organization,
            email: email,
            link: link,
            privacyLink: `${config.webappDomain}/privacy`
        };
        return this.getHtmlFromEjs(WELCOME_TEMPLATE, data)
            .then((html) => {
                EmailManager.getTransport(SENGRID_TOKEN);
                const mailOptions = EmailManager.getMailOptions(email, html, "Welcome to Plenuum");
                return Promise.resolve(sgMail.send(mailOptions))
            })
    };

    public async sendResetEmail(email: string, link: string, firstName?: string): Promise<any> {
        const data = {
            link: link,
            firstName: firstName
        };
        return this.getHtmlFromEjs(RESET_PASSWORD_TEMPLATE, data)
            .then((html) => {
                EmailManager.getTransport(SENGRID_TOKEN);
                const mailOptions = EmailManager.getMailOptions(email, html, "Plenuum password reset");
                return Promise.resolve(sgMail.send(mailOptions))
            });
    };

}
