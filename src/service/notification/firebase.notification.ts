import NotificationInterface from "./notification.interface";
import * as admin from "firebase-admin";
import config from "../../../config/config";

export default class FirebaseNotification implements NotificationInterface {

    constructor(){
        const serviceAccount = require(`../../../res/${config.firebaseConfig.keyFileName}`);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://plenuumbackend.firebaseio.com"
        });
    }

    sendNotification (token: string, content: Object): Promise<admin.messaging.MessagingDevicesResponse> {
        const options = this.getOptions();
        const payload = this.getpayload(content);
        return admin.messaging().sendToDevice(token, payload, options)
    }

    getpayload (content: any): any {
        const {body, title} = content;
        return { notification: { title: title, body: body }};
    }

    getOptions() : any {
        return { priority: "high",  timeToLive: 60 * 60 * 24 };
    }
}