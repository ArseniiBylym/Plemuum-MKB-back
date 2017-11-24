import NotificationInterface from "./notification.interface";

export const TEMPLATE = {
    FEEDBACK: (name: string) => ({
        body: `You received a feedback from ${name}`,
        title: `New feedback`,
        data: {type: "FEEDBACK"}
    }),
    REQUEST: (name: string) => ({
        body: `${name} needs your feedback`,
        title: `New feedback request`,
        data: {type: "REQUEST"}
    }),
    COMPASS: (name: string) => ({
        body: `Would you like to help ${name} to improve?`,
        title: `New todo`,
        data: {type: "COMPASS"}
    }),
    STATISTICS: () => ({
        body: `Tap to see updated skill scores.`,
        title: `Skill scores updated`,
        data: {type: "STATISTICS"}
    }),
    GENERAL: (title: string, body: string) => ({title: title, body: body})
};

export default class NotificationService {

    service: NotificationInterface;

    constructor(service: NotificationInterface) {
        this.service = service;
    }

    sendNotification(deviceToken: string, template: Object): Promise<any> {
        return this.service.sendNotification(deviceToken, template);
    }
}