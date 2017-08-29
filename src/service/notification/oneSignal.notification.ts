import NotificationInterface from "./notification.interface";
import * as https from 'https';

const app_id_oneSignal: string = "1284220e-209d-431a-8de7-01fdbce815ac";
// public static rest_api_secret_oneSignal : string = process.env.REST_API_SECRET_ONESIGNAL || "MGMyODhhMjAtNWUzMC00NGE2LTgwMzQtNTNkZGI4MDllNTk4";

export default class OneSignalNotification implements NotificationInterface {
    constructor(){

    }


    sendNotification (token: string, content: Object,): Promise<any> {
        const headers = this.getHeaders();
        const options = this.getOptions(headers);
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
            "Authorization": "Basic MGMyODhhMjAtNWUzMC00NGE2LTgwMzQtNTNkZGI4MDllNTk4"
        };
    }

    getOptions(headers: Object): Object {
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
            app_id: app_id_oneSignal,
            headings: {"en": content.title},
            contents: {"en": content.body},
            include_player_ids: [player_id]
        };
    }
}