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
    }
};

export default prodConfig



