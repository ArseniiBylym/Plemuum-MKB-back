import config from "../../../config/config";
import * as admin from "firebase-admin";
import NotificationInterface from "./notification.interface";

const FEEDBACK_TEMPLATE = "FEEDBACK";
const REQUEST_TEMPLATE = "REQUEST";
const COMPASS_TEMPLATE = "COMPASS";

export default class NotificationService {

    service : any;

    constructor(service: NotificationInterface){
        this.service = service;
    }

    static getNotificationFromTemplate(senderName: string, template: string){
        switch (template){
            case FEEDBACK_TEMPLATE:
                return { body: `You received a feedback from ${senderName}`, title: `New feedback`};
            case REQUEST_TEMPLATE:
                return { body: `${senderName} needs your feedback`, title: `New feedback request`};
            case COMPASS_TEMPLATE:
                return { body: `Would you like to help ${senderName} to improve?`, title: `New todo`};
            default:
                return { body: "", title: "" };
        }
    }

    sendNotification(deviceToken: string, senderName: string, notificationType: string): Promise<any> {
        const content = NotificationService.getNotificationFromTemplate(senderName, notificationType);
        return this.service.sendNotification(deviceToken, content)
            .then((response: any) => response)
            .catch((err: Error) => err);
    }
}