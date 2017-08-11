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
            projectId: 'plenuum',
            keyFileName: 'Plenuum-8eba73778480.json',
            bucketName: 'plenuum.appspot.com',
            baseUrl: 'http://storage.googleapis.com/plenuum.appspot.com/'
        };
    }
};

export default prodConfig



