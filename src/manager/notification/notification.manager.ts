import NotificationInterface from "./notification.interface";

export const TEMPLATE = {
    FEEDBACK: (name?: string) => ({
        data: {
            body: name ? `You received a feedback from ${name}` : 'You received an anonymous feedback',
            title: `New feedback`,
            type: "FEEDBACK"
        }
    }),
    REQUEST: (name: string) => ({
        data: {
            body: `${name} needs your feedback`,
            title: `New feedback request`,
            type: "REQUEST"
        }
    }),
    COMPASS: (name: string) => ({
        data: {
            body: `Would you like to help ${name} to improve?`,
            title: `New todo`,
            type: "COMPASS"
        }
    }),
    STATISTICS: () => ({
        data: {
            body: `Tap to see updated skill scores.`,
            title: `Skill scores updated`,
            type: "STATISTICS"
        }
    }),
    GENERAL: (title: string, body: string) => ({title: title, body: body})
};

export default class NotificationManager {

    service: NotificationInterface;

    constructor(service: NotificationInterface) {
        this.service = service;
    }

    sendNotification(deviceToken: string, template: Object): Promise<any> {
        return this.service.sendNotification(deviceToken, template);
    }
}