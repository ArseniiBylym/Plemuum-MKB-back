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
    }
};

export default prodConfig 