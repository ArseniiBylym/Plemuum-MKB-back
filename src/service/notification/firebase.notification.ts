import NotificationInterface from "./notification.interface";
import * as admin from "firebase-admin";

export default class FirebaseNotification implements NotificationInterface {

    constructor(serviceAccount: string, databaseURL: string){
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: databaseURL
        });
    }

    sendNotification (token: string, content: Object): Promise<admin.messaging.MessagingDevicesResponse> {
        const options = this.getOptions();
        const payload = this.getPayload(content);
        return admin.messaging().sendToDevice(token, payload, options)
    }

    getPayload (content: any): any {
        const {body, title, data} = content;
        return { notification: { title: title, body: body }, data: data};
    }

    getOptions() : any {
        return { priority: "high",  timeToLive: 60 * 60 * 24 };
    }
}