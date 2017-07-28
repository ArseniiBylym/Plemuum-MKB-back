import { Config } from "./config";

const devConfig: Config = {
    get port() {
        return '5000';
    },
    get mongoUrl() {
        return 'mongodb://localhost/test'
    }
}

export default devConfig 