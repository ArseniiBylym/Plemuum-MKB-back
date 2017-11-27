import NotificationInterface from "./notification.interface";
import * as https from 'https';

export default class OneSignalNotification implements NotificationInterface {

    secret: string;
    appId: string;

    constructor(restSecret: string, appId: string){
        this.secret = restSecret;
        this.appId = appId;
    }

    sendNotification (token: string, content: Object,): Promise<any> {
        const headers = this.getHeaders();
        const options = OneSignalNotification.getOptions(headers);
        const message = this.getPayload(content, token);

        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                res.on('data', (data) => {
                    resolve(data);
                })
            });
            req.on('error', (err: Error) =>{
                reject(err);
            });
            req.write(JSON.stringify(message));
            req.end();
        });
    }

    getHeaders(){
        return {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": `Basic ${this.secret}`
        };
    }

    static getOptions(headers: Object): Object {
        return {
            host: 'onesignal.com',
            port: 443,
            path: '/api/v1/notifications',
            method: 'POST',
            headers: headers
        }
    }

    getPayload(content: any, player_id: string){
        return {
            app_id: this.appId,
            headings: {"en": content.title},
            contents: {"en": content.body},
            include_player_ids: [player_id]
        };
    }
}