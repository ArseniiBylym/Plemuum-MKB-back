import NotificationInterface from "./notification.interface";
export const TEMPLATE = {
    SURVEY: () => ({
        data: {
            body: 'You received a survey',
            title: `New survey`,
            type: "SURVEY"
        },
        notification: {
            body: 'You received a survey',
            title: `New survey`,
            type: "SURVEY"
        }
    }),
    FEEDBACK: (name?: string) => ({
        data: {
            body: name ? `You received a feedback from ${name}` : 'You received an anonymous feedback',
            title: `New feedback`,
            type: "FEEDBACK"
        },
        notification: {
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
        },
        notification: {
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
        },
        notification: {
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
        },
        notification: {
            body: `Tap to see updated skill scores.`,
            title: `Skill scores updated`,
            type: "STATISTICS"
        }
    }),
    GENERAL: (title: string, body: string) => ({
        data: {
            title: title, 
            body: body,
            type: "GENERAL"
        },
        notification: {
            title: title, 
            body: body,
            type: "GENERAL"
        }
    })
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