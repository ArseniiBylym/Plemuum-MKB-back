import NotificationInterface from "./notification.interface";

export const TEMPLATE = {
    FEEDBACK: (name: string) => ({body: `You received a feedback from ${name}`, title: `New feedback`}),
    REQUEST: (name: string) => ({body: `${name} needs your feedback`, title: `New feedback request`}),
    COMPASS: (name: string) => ({body: `Would you like to help ${name} to improve?`, title: `New todo`}),
    STATISTICS: () => ({body: `Tap to see updated skill scores.`, title: `Skill scores updated`}),
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