import UserDataController from "../../data/datacontroller/user.datacontroller";
import SurveyDataController from "../../data/datacontroller/survey.datacontroller";
import ComapassDataController from "../../data/datacontroller/compass.datacontroller";
import {requestDataController, RequestDataController} from "../../data/datacontroller/request.datacontroller";


import { resetPasswordDataController } from "../../data/datacontroller/resetpassword.datacontroller";
import { generateNewTokensForResetPassword } from "../../manager/auth/token.manager";
import { ErrorType, PlenuumError } from "../../util/errorhandler";
import { UserModel } from "../../data/database/schema/common/user.schema";
import FileManager from "../../manager/file/file.manager";
import EmailManager from "../../manager/email/mail.manager";
import * as crypto from 'crypto';
import { OrganizationDataController } from "../../data/datacontroller/organization.datacontroller";
import FeedbackDataController from "../../data/datacontroller/feedback.datacontroller";
import StatisticDataController from "../../data/datacontroller/statistics.datacontroller";
import agenda from "../../util/agenda";
import * as Raven from 'raven';
import * as XLSX from "xlsx";
import * as moment from "moment";
import SurveyManager from "../interactor/survey.interactor";



export default class UserInteractor {

    private emailManager: EmailManager;
    private fileManager: FileManager;
    private organizationDataController: OrganizationDataController;
    private surveyManager: SurveyManager;

    constructor(emailService: EmailManager, fileManager: FileManager, organizationDataController: OrganizationDataController, surveyManager: SurveyManager) {
        this.emailManager = emailService;
        this.fileManager = fileManager;
        this.organizationDataController = organizationDataController;
        this.surveyManager = surveyManager;
    }

    async sendEmailForUsers(orgId:string, respodents:string[], html:string, subject:string) {
       
        let respondentUsers:any = await this.surveyManager.analysisRespondentsId(orgId ,respodents);
        for (let i = 0; i < respondentUsers.length; i++) {
              agenda.schedule(new Date(Date.now() + (i + 1)*1000),'sendEmailFromAdminInterface', {user:respondentUsers[i], html:html, subject:subject, orgId:orgId});
        }
        return "Email sending in progress";
    } 

    async updateUserManager(userId:string, managerId:string) {
       
        if (managerId === userId) throw new PlenuumError("The user can not be himself a manager", ErrorType.FORBIDDEN);

        const updatedUser = await UserDataController.updateUserManagerId(userId, managerId);
        if (!updatedUser) {
            throw new PlenuumError("User not found", ErrorType.NOT_FOUND);
        }
        return updatedUser;
    }  
    async getUserFeedbacksExcel(orgId:string, userId:string) {
        //get user feedbacks
        let feedbacks = await FeedbackDataController.getIncomingFeedbacksReportForExcelFile(orgId, userId);
        feedbacks = feedbacks.filter((feedback:any)=> (!feedback.privacy.includes('PRIVATE')));
        let formatedFeedbacks = await feedbacks.map((feedback:any)=>{
            if (feedback.type === "CONTINUE") feedback.type = "Folytasd"
            else if (feedback.type === "CONSIDER")  feedback.type = "Fontold meg";
            let sender;

            if (feedback.privacy.includes("ANONYMOUS")) sender = "Névtelen"
            else sender = feedback.senderId.lastName+' '+feedback.senderId.firstName; 
            return {
            ['Visszajelzés szövege']: feedback.message,
            ['Visszajelzés típusa']: feedback.type,
            ['Küldő']: sender,
            ['Dátum']: moment(feedback.updatedAt).format('YYYY-MM-DD'),
            ['Időpont']: moment(feedback.updatedAt).format('HH:mm'),
        }})
        //result export to xlsx
        const ws = await XLSX.utils.json_to_sheet(formatedFeedbacks);
        const wb = await XLSX.utils.book_new();
        await XLSX.utils.book_append_sheet(wb, ws, "user_feedbacks");
        /* generate an XLSX file */
        let user = await UserDataController.getUserById(userId);
        let date = moment().format('YYYY-MM-DD');
        let filename = `feedbacks_${user.lastName}_${user.firstName}_${date}.xlsx`
        let path = `./media/${filename}`;
        await XLSX.writeFile(wb, path);
        return [path, filename];
    }

    async getUserSkillScoresExcel(orgId:string, userId:string) {
        //get user skill scores
        let result = await StatisticDataController.getStatisticsByUserIdForExcelFile(orgId, userId);
        let skillScores = result.skillScores; 
        let formatedSkillScores = [];
        //formated skill scores
        for (let i = 0; i < skillScores.length; i++) {
            for (let j = 0; j < skillScores[i].sentenceScores.length; j++) {
                let {sentenceScores} = skillScores[i];
                let skillInpercent = (sentenceScores[j].numberOfAgree || sentenceScores[j].numberOfDisagree) ?
                    Math.round((sentenceScores[j].numberOfAgree * 100) / (sentenceScores[j].numberOfAgree + sentenceScores[j].numberOfDisagree)*10)/10
                    : '';
                let item = {
                    ['Készség']: skillScores[i].skill.name,
                    ['Mondat']: sentenceScores[j].sentence.message ? sentenceScores[j].sentence.message : '',
                    ['Egyetért']: sentenceScores[j].numberOfAgree ? sentenceScores[j].numberOfAgree : '',
                    ['Nem ért egyet']: sentenceScores[j].numberOfDisagree ? sentenceScores[j].numberOfDisagree : '',
                    ['Pontszám']: skillInpercent
                }
                formatedSkillScores.push(item);
            }
        }
        //sort
        formatedSkillScores = await formatedSkillScores.sort((a: any, b: any) => {
            if (a['Készség'] === b['Készség']) {
                let x = a['Mondat'].toLowerCase(), y = b['Mondat'].toLowerCase();
                return x < y ? -1 : x > y ? 1 : 0;
            }
                let x = a['Készség'].toLowerCase(), y = b['Készség'].toLowerCase();
                return x < y ? -1 : x > y ? 1 : 0;
        });
        //result export to xlsx
        const ws = await XLSX.utils.json_to_sheet(formatedSkillScores);
        const wb = await XLSX.utils.book_new();
        await XLSX.utils.book_append_sheet(wb, ws, "user_skillScores");
        /* generate an XLSX file */
        let user = await UserDataController.getUserById(userId);
        let date = moment().format('YYYY-MM-DD');
        let filename = `skills_${user.lastName}_${user.firstName}_${date}.xlsx`
        let path = `./media/${filename}`;
        await XLSX.writeFile(wb, path);
        return [path, filename];
    }


    async updateUser(user: UserModel) {
        const id = user._id;
        delete user._id;
        const updatedUser = await UserDataController.updateUser(id, user);
        if (!updatedUser) {
            throw new PlenuumError("User not found", ErrorType.NOT_FOUND);
        }
        return updatedUser;
    }

    async inactiveUsers(usersId: string[]) {
        let inactiveUsers = [];
        for (let i = 0; i < usersId.length; i++) {
            let surveys: any;
            //set isActive false
            inactiveUsers.push(await UserDataController.inactiveUser(usersId[i]));
            
            // get inactive users surveys and each surveys surveyTodo change to isComplited: true
            surveys = await SurveyDataController.getAllSurveysByUserId(inactiveUsers[i].orgId, inactiveUsers[i]._id)
            for (let j = 0; j < surveys.length; j++) {
                await SurveyDataController.updateSurveyTodoIsComplet(inactiveUsers[i].orgId, surveys[j]._id.toString())
            }
            //answered compassTodos about inactive users
            await ComapassDataController.answeredCompassTodos(inactiveUsers[i].orgId, inactiveUsers[i]._id.toString());
            //delete requests
            await requestDataController.deleteRequestsByUserId(inactiveUsers[i].orgId, inactiveUsers[i]._id.toString());
            // delete inactive users from managerId
            await UserDataController.inactiveUsersDeleteFromManagerId(inactiveUsers[i]._id.toString());
        }

        if (usersId.length !== inactiveUsers.length) {
            throw new PlenuumError("Something went wrong", ErrorType.NOT_FOUND);
        }

        return inactiveUsers;
    }



    async setPassword(token: string, newPassword: string) {
        const resetedPassword: any = await resetPasswordDataController.getResetPasswordByToken(token);
        if (resetedPassword.token_expiry <= new Date()) {
            throw new PlenuumError("Token expired", ErrorType.FORBIDDEN);
        }

        const {tokenExpired} = generateNewTokensForResetPassword();
        await resetPasswordDataController.updateResetPassword(resetedPassword._id, tokenExpired);

        const user = await UserDataController.getUserById(resetedPassword.userId);
        if (!user) throw new PlenuumError("User not found", ErrorType.NOT_FOUND);
        await UserDataController.changeUserPasswordByUserId(resetedPassword.userId, newPassword);
        user.passwordUpdatedAt = new Date();
        await UserDataController.updateUser(user._id, user);
        return {
            successMessage: "Your password was successfully changed. You can now go to Plenuum " +
            "web app and log with new password"
        }
    }

    async resetPassword(email: string, origin: string = '', isWelcome: boolean) {
        const user = await UserDataController.getUserByEmail(email);
        if (!user) throw new PlenuumError("User not found", ErrorType.NOT_FOUND);
        const {token, token_expiry} = UserDataController.generateToken(1);
        const data = {userId: String(user._id), token: token, token_expiry: token_expiry, reseted: false};

        const resetPassword = await resetPasswordDataController.saveResetPassword(data);
        const link = origin + "/set_new_password?token=" + resetPassword.token + "&email="
            + user.email + (isWelcome ? "&welcome=true" : "");
        const resetPasswordToken = resetPassword.token;
        const response = {email: user.email, link: link};

        await this.emailManager.sendResetEmail(user.email, link, user.orgId, user.firstName);
        return {resetPasswordToken: resetPasswordToken, response: "Check your mailbox!"};
    }

    async userRegistrationFromCSV(csvFile: any, orgId: string) {

        const savedUsers: any[] = [];
        const users = await this.fileManager.convertCSV2UserArray(csvFile);
        const organization = await this.organizationDataController.getOrganizationByDbName(orgId);

        for (let i = 0; i < users.length; i++) {
            let user = users[i];
            user.orgId = orgId;
            user.passwordUpdatedAt = new Date();
            let savedUser;
            try {
                savedUser = await UserDataController.saveUser(user);
                if (!savedUser) {
                    throw new PlenuumError("User not saved", ErrorType.VALIDATION);
                }
            }
            catch (e) {
                console.log('Error creating user in user collection from csv: ',e.message);
                Raven.captureException(e);
                continue
            }
            agenda.schedule(new Date(Date.now() + (i + 1)*2000),'sendWelcomeEmailsInBackground', Object.assign({orgName:organization.name}, savedUser));
            savedUsers.push(savedUser);
        }
        return savedUsers;
    }

    async profilePictureUpload(avatar: any, userId: string) {
        const pictureUrl = await this.fileManager.uploadUserPicture(avatar, userId);
        const updatedUser = await UserDataController.setUserPic(userId, pictureUrl);

        if (!updatedUser) {
            throw new PlenuumError("User not found", ErrorType.NOT_FOUND);
        }
        return {avatar: pictureUrl}
    }

    async saveUser(body: any, orgId?: string) {
        body.admin = body.admin && body.admin === 'true';
        const organization = await this.organizationDataController.getOrganizationByDbName(orgId ? orgId : body.orgId);
        body.passwordUpdatedAt = new Date();
        const savedUser = await UserDataController.saveUser(body);
        if (!savedUser) {
            throw new PlenuumError("User not saved", ErrorType.VALIDATION);
        }

        agenda.schedule(new Date(Date.now() + 2000),'sendWelcomeEmailsInBackground', Object.assign({orgName:organization.name}, savedUser));

        return savedUser;
    }

}