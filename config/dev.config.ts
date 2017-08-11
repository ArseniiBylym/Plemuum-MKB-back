import { Config } from "./config.interface";

const devConfig: Config = {
    get port() {
        return '5000';
    },
    get mongoUrl() {
        return 'mongodb://localhost'
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
            projectId: 'plenuum',
            keyFileName: 'Plenuum-8eba73778480.json',
            bucketName: 'plenuum.appspot.com',
            baseUrl: 'http://storage.googleapis.com/plenuum.appspot.com/'
        };
    }
};

export default devConfig

