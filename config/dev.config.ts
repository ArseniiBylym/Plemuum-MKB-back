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
    }
};

export default devConfig 