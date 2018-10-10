import EmailManager from "../manager/email/mail.manager";
import UserDataController from "../data/datacontroller/user.datacontroller";
import config from "../../config/config";
import {resetPasswordDataController} from "../data/datacontroller/resetpassword.datacontroller";
import {default as getLogger} from "../util/logger";
import * as Raven from "raven";



export default async function (agenda:any, transporter:any) {

    agenda.define('sendAbusiveReportEmailUser', async function(job:any, done:any) {

        let dataSet = job.attrs.data;
        const {firstName, lastName, email, orgId} = dataSet.recipientId;
        let senderFullName = (dataSet.privacy[1] && dataSet.privacy[1] === "ANONYMOUS") ? 
            "Anonymous" :  dataSet.senderId.firstName + ' '+dataSet.senderId.lastName;
        let dateOption = {hour: 'numeric', minute: 'numeric', second:"numeric"};
        try {
            const mailService = new EmailManager();
            await mailService.sendAbusiveRiportUser(email, firstName,lastName, senderFullName, dataSet.createdAt.toLocaleDateString('hu-Hu',dateOption),dataSet.message,orgId, transporter );
            await done();
        } catch (error) {
            getLogger().error({
                type: "error",
                request: {
                    user: dataSet.respondentId
                },
                message: error,
                timeStamp: new Date()
            });
        }

    });

    agenda.define('sendAbusiveReportEmailHR', async function(job:any, done:any) {

        let dataSet = job.attrs.data;
        const {firstName, lastName, orgId} = dataSet.recipientId;
        const {email} = dataSet.HRUser;
        let senderFullName = dataSet.senderId.firstName + ' '+dataSet.senderId.lastName;
        let dateOption = {hour: 'numeric', minute: 'numeric', second:"numeric"};
        try {
            const mailService = new EmailManager();
            await mailService.sendAbusiveRiportHR(email, firstName,lastName, senderFullName, dataSet.createdAt.toLocaleDateString('hu-Hu',dateOption),dataSet.message, orgId,transporter);
            await done();
        } catch (error) {
            getLogger().error({
                type: "error",
                request: {
                    user: dataSet.respondentId
                },
                message: error,
                timeStamp: new Date()
            });
        }

    });

    agenda.define('sendWelcomeEmailsInBackground', async function(job:any, done:any) {

        let user = job.attrs.data;

        const origin = config.webappDomain;
        const {email, firstName, _id, orgName} = user;
        const {token, token_expiry} = UserDataController.generateToken(60);
        const data = {userId: _id, token: token, token_expiry: token_expiry, reseted: false};

        try {
            const response = await resetPasswordDataController.saveResetPassword(data);
            let link = origin + "/set_new_password?token=" + response.token + "&email=" + email + "&welcome=true&name=" + firstName;
            const mailService = new EmailManager();
            await mailService.sendWelcomeEmail(email, firstName, link, orgName, transporter);
            await done();
        } catch (error) {
            Raven.captureException(error);
            getLogger().error({
                type: "error",
                request: {
                    user: user
                },
                message: error,
                timeStamp: new Date()
            });
        }

    });
    agenda.define('sendSurveyNotificationEmailsInBackground', async function(job:any, done:any) {

        let user = job.attrs.data;

        const origin = config.webappDomain;
        const {email, firstName, _id, orgId} = user;

        try {
            let link = `${origin}/api/organizations/${user.orgId}/surveys/${user.surveyId}`;
            const mailService = new EmailManager();
            await mailService.sendSurveyNotificationEmail(email, firstName, link, orgId, transporter);
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

    });
    agenda.define('sendSurveyAnswers', async function(job:any, done:any) {
        let surveyWithAnswers = job.attrs.data;
        const {manager, respondent} = surveyWithAnswers.surveyTodo;
        const managerData = await UserDataController.getUserById(manager, true, true, false);
        const respondentData = await UserDataController.getUserById(respondent, true, true, false);
        const {firstName, _id, orgId} = respondentData;

        try {

            const mailService = new EmailManager();
            await mailService.sendSurveyAnswer(managerData.email, managerData, respondentData, surveyWithAnswers,orgId, transporter, true);
            await mailService.sendSurveyAnswer(respondentData.email, managerData, respondentData, surveyWithAnswers,orgId, transporter, false);
            await done();
        } catch (error) {
            getLogger().error({
                type: "error",
                request: {
                    user: manager
                },
                message: error,
                timeStamp: new Date()
            });
        }

    })
};