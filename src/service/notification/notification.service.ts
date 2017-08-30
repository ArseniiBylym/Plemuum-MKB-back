import NotificationInterface from "./notification.interface";

export const TEMPLATE = {
    FEEDBACK: (name: string) => {
        return { body: `You received a feedback from ${name}`,  title: `New feedback` }
    },
    REQUEST: (name: string) => {
        return { body: `${name} needs your feedback`, title: `New feedback request`};
    },
    COMPASS: (name: string) => {
        return { body: `Would you like to help ${name} to improve?`, title: `New todo`};
    },
};

export default class NotificationService {

    service : NotificationInterface;

    constructor(service: NotificationInterface){
        this.service = service;
    }

    sendNotification(deviceToken: string, template: Object): Promise<any> {
        return this.service.sendNotification(deviceToken, template);
    }
}