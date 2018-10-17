import FeedbackDataController from "../../data/datacontroller/feedback.datacontroller";
import UserDataController from "../../data/datacontroller/user.datacontroller";
import { ErrorType, PlenuumError } from "../../util/errorhandler";
import NotificationManager from "./notification.interactor";
import { TEMPLATE } from "../../manager/notification/notification.manager";
import { PRIVACY } from "../../data/models/organization/feedback.model";
import { User } from "../../data/models/common/user.model";
import * as XLSX from "xlsx";
import agenda from "../../util/agenda";

export default class FeedbackInteractor {

    private notificationManager: NotificationManager;

    constructor(notificationManager: NotificationManager) {
        this.notificationManager = notificationManager;
    }

    async sendReportAbusiveFeedback(orgId: string, feedbackId: string) {
        return FeedbackDataController.getDataSetForAbusiveReport(orgId, feedbackId)
            .then(async (result) => {
                return result;
            })
            .then(async (result) => {
                let HRUsers: any = await UserDataController.getHRUsers(orgId);

                if (!HRUsers || HRUsers.length === 0) {
                    throw new PlenuumError("HR user not found", ErrorType.NOT_FOUND);
                }

                await agenda.schedule(new Date(Date.now() + 2000), 'sendAbusiveReportEmailUser', result);

                for (let i = 0; i < HRUsers.length; i++) {
                    result.HRUser = HRUsers[i];
                    await agenda.schedule(new Date(Date.now() + i * 2000), 'sendAbusiveReportEmailHR', result);
                }
                return { abusiveReport: "Sended" };
            })
    }

    async getFeedbacks(orgId: string, userId: string) {
        return FeedbackDataController.getAllFeedback(orgId, userId)
    }

    async getSentFeedbacks(orgId: string, userId: string) {
        return FeedbackDataController.getSentFeedbacks(orgId, userId)
    }

    async getIncomingFeedbacks(orgId: string, userId: string) {
        return FeedbackDataController.getIncomingFeedbacks(orgId, userId)
    }

    async getSentFeedbacksReport(orgId: string, userId: string) {
        return FeedbackDataController.getSentFeedbacksReport(orgId, userId)
            .then(async (result:any) => {
                let res = result.filter((item : any) => item && item.senderId && item.recipientId).map((item:any) => { return {
                    createdAt:item.createdAt.toString(),
                    sender: item.senderId.firstName + ' ' + item.senderId.lastName,
                    "sender email": item.senderId.email,
                    "recipient firstName": item.recipientId.firstName,
                    "recipient lastName": item.recipientId.lastName,
                    "recipient email": item.recipientId.email,
                    message: item.message,
                    type: item.type}
                });
                //result export to xlsx
                const ws = await XLSX.utils.json_to_sheet(res);
                const wb = await XLSX.utils.book_new();
                await XLSX.utils.book_append_sheet(wb, ws, "SentFeedbacksReport");
                /* generate an XLSX file */
                return XLSX.write(wb, {bookType:'xlsx', type:'buffer'});
            })
    }

    async getIncomingFeedbacksReport(orgId: string, userId: string) {
        return FeedbackDataController.getIncomingFeedbacksReport(orgId, userId)
            .then(async (result:any) => {
                let res = result.filter((item : any) => item && item.senderId && item.recipientId).map((item:any) => { return {
                    createdAt:item.createdAt.toString(),
                    recipient: item.recipientId.firstName + ' ' + item.recipientId.lastName,
                    "recipient email": item.recipientId.email,
                    "sender firstName": item.senderId.firstName,
                    "sender lastName": item.senderId.lastName,
                    "sender email": item.senderId.email,
                    message: item.message,
                    type: item.type}
                });
                //result export to xlsx
                const ws = await XLSX.utils.json_to_sheet(res);
                const wb = await XLSX.utils.book_new();
                await XLSX.utils.book_append_sheet(wb, ws, "IncomingFeedbacksReport");
                /* generate an XLSX file */
                return XLSX.write(wb, {bookType:'xlsx', type:'buffer'});
            })
    }

    async postFeedback(orgId: string, sender: User, feedback: any) {
        const recipient = await UserDataController.getUserByIdFromOrg(orgId, feedback.recipientId);
        if (!recipient) {
            throw new PlenuumError("Recipient user not found", ErrorType.NOT_FOUND);
        }
        const savedFeedback = await FeedbackDataController.saveFeedback(orgId, feedback);
        try {
            let senderName = (feedback.privacy && feedback.privacy.indexOf(PRIVACY.ANONYMOUS) !== -1) ? undefined : sender.firstName;
            
            await this.notificationManager.sendNotificationById(feedback.recipientId,TEMPLATE.FEEDBACK(senderName));
            await agenda.schedule(new Date(Date.now() + 2000), 'sendEmailNotificationAboutFeedback', {senderName:senderName, user:recipient}); 
        } catch (error) {
            console.error(error);
        }
        return savedFeedback;
    }

}