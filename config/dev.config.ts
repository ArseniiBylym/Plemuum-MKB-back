import { Config } from "./config.interface";

const devConfig: Config = {
    get port() {
        return '5000';
    },
    get mongoUrl() {
        return 'mongodb://localhost:27017'
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
            baseUrl: 'http://storage.googleapis.com/plenuumbackend.appspot.com/'
        };
    }
};

export default devConfig

