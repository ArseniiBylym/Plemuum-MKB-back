import config from "../../../config/config";
import * as admin from "firebase-admin";

export default class NotificationService {



    constructor(){
        var serviceAccount = require(`res/${config.firebaseConfig.keyFileName}`);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://plenuumbackend.firebaseio.com"
        });
    }

    getPayLoad(){
        return {
            notification: {
                title: "",
                body: ""
            }
        };
    }

    sendNotification(){
        const condition = ""
        const payload = this.getPayLoad();
    }
}