import { Config } from "./config.interface";

const devConfig: Config = {
    get port() {
        return '5000';
    },
    get mongoUrl() {
        return 'mongodb://mongo:27017'
    },
    get adminPwd() {
        return 'incline diadem passed hoop'
    },
    get plenuumBotEmail() {
        return "bot@plenuum.com"
    },
    get plenuumBotPass() {
        return "Cocobongo1"
    },
    get debugMode() {
        return true;
    },
    get firebaseConfig() {
        return {
            projectId: 'plenuumbackend',
            keyFileName: 'PlenuumBackend-25b19e804e20.json',
            bucketName: 'plenuumbackend.appspot.com',
            baseUrl: 'http://storage.googleapis.com/plenuumbackend.appspot.com/',
            databaseUrl: 'https://plenuumbackend.firebaseio.com/'
        };
    },
    get workerTime() {
        return "0 0 8 * * *"; //Every day at 08:00 AM
    },
    get webappDomain() {
        return "http://localhost:3000";
    }
};

export default devConfig

