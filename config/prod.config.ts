import { Config } from "./config.interface";

const prodConfig: Config = {
    get port() {
        return '1234';
    },
    get mongoUrl() {
        return 'mongodb://localhost'
    },
    get adminPwd() {
        return <string> process.env.ADMIN_PASSWORD
    },
    get plenuumBotEmail() {
        return <string> process.env.PLENUUMBOTEMAIL
    },
    get plenuumBotPass() {
        return <string> process.env.PLENUUMBOTPASS
    },
    get debugMode() {
        return false;
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

export default prodConfig



