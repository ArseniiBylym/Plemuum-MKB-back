import NotificationInterface from "./notification.interface";
export const TEMPLATE = {
    SURVEY: () => ({
        data: {
            body: 'Új kérdőved érkezett',
            title: `Új kérdőív`,
            type: "SURVEY"
        },
        notification: {
            body: 'Új kérdőved érkezett',
            title: `Új kérdőív`,
            type: "SURVEY"
        }
    }),
    FEEDBACK: (name?: string) => ({
        data: {
            body: name ? `Új visszajelzésed érkezett tőle: ${name}` : 'Új, név nélküli visszajelzésed érkezett',
            title: `Új visszajelzés`,
            type: "FEEDBACK"
        },
        notification: {
            body: name ? `Új visszajelzésed érkezett tőle: ${name}` : 'Új, név nélküli visszajelzésed érkezett',
            title: `Új visszajelzés`,
            type: "FEEDBACK"
        }
    }),
    REQUEST: (name: string) => ({
        data: {
            body: `${name} a visszajelzésedet kéri`,
            title: `Új visszajelzés kérés`,
            type: "REQUEST"
        },
        notification: {
            body: `${name} a visszajelzésedet kéri`,
            title: `Új visszajelzés kérés`,
            type: "REQUEST"
        }
    }),
    COMPASS: (name: string) => ({
        data: {
            body: `Szeretnél segíteni ${name} fejlődésében?`,
            title: `Új teendő`,
            type: "COMPASS"
        },
        notification: {
            body: `Szeretnél segíteni ${name} fejlődésében?`,
            title: `Új teendő`,
            type: "COMPASS"
        }
    }),
    STATISTICS: () => ({
        data: {
            body: `Koppints a frissített pontszámok megtekintéséhez`,
            title: `Készség pontszámok frissültek`,
            type: "STATISTICS"
        },
        notification: {
            body: `Koppints a frissített pontszámok megtekintéséhez`,
            title: `Készség pontszámok frissültek`,
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