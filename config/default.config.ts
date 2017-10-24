import { Config } from "./config.interface";
import { getDefaultFirebaseConfig } from "./firebase.config";

const defaultConfig: Config = {
    get env() {
        return <string> process.env.NODE_ENV;
    },
    get port() {
        return '5000';
    },
    get mongoUrl() {
        return <string> process.env.DATABASE_URL
    },
    get adminPwd() {
        return <string> process.env.ADMIN_PASSWORD
    },
    get plenuumBotEmail() {
        return <string> process.env.PLENUUM_BOT_EMAIL
    },
    get plenuumBotPass() {
        return <string> process.env.PLENUUM_BOT_PWD
    },
    get debugMode() {
        return false;
    },
    get firebaseConfig() {
        return getDefaultFirebaseConfig();
    },
    get workerTime() {
        return "0 0 8 * * *"; //Every day at 08:00 AM
    },
    get webappDomain() {
        return <string> process.env.WEBAPP_DOMAIN;
    },
    get adminDomain() {
        return <string> process.env.ADMIN_DOMAIN;
    }
};

export default defaultConfig



