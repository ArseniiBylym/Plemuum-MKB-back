import { Config } from "./config.interface";
import { ENVIRONMENTS } from "./config";
import { getDefaultFirebaseConfig } from "./firebase/firebase.config";

const devConfig: Config = {
    get env() {
        return ENVIRONMENTS.DEVELOPMENT
    },
    get port() {
        return '5000';
    },
    get mongoUrl() {
        return 'mongodb://localhost:27017'
    },
    get adminPwd() {
        return 'admin'
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
        return getDefaultFirebaseConfig();
    },
    get workerTime() {
        return "0 0 8 * * *"; //Every day at 08:00 AM
    },
    get webappDomain() {
        return "http://localhost:3000";
    },
    get adminDomain() {
        return "http://localhost:8081";
    },
    get tokenHash() {
        return 'HlP8IqXEfXyrP0LgZihWSyLwlcSlySc3H40yj9P2';
    },
    get plenuumSengridToken() {
      return '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';
    },
    get SentryDSN() {
        return <string> '';
    },
    get accessTokenExpiryInMins() {
        return <number> (process.env.ACCESS_TOKEN_EXPIRY_IN_MINS ? process.env.ACCESS_TOKEN_EXPIRY_IN_MINS : 10080);
    },
    get refreshTokenExpiryInDays() {
        return <number> (process.env.REFRESH_TOKEN_EXPIRY_IN_DAYS ? process.env.REFRESH_TOKEN_EXPIRY_IN_DAYS : 7);
    }
};

export default devConfig
