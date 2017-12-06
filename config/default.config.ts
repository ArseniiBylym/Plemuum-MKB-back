import { Config } from "./config.interface";
import { getDefaultFirebaseConfig, getProductionFirebaseConfig } from "./firebase/firebase.config";
import { ENVIRONMENTS } from "./config";

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
        return this.env === ENVIRONMENTS.PRODUCTION ? getProductionFirebaseConfig() : getDefaultFirebaseConfig();
    },
    get workerTime() {
        return "0 0 8 * * *"; //Every day at 08:00 AM
    },
    get webappDomain() {
        return <string> process.env.WEBAPP_DOMAIN;
    },
    get adminDomain() {
        return <string> process.env.ADMIN_DOMAIN;
    },
    get tokenHash() {
        return <string> process.env.TOKEN_HASH;
    }
};

export default defaultConfig



