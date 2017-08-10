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
    }
};

export default devConfig

