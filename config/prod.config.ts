import { Config } from "./config";

const prodConfig: Config = {
    get port() {
        return '1234';
    },
    get mongoUrl() {
        return 'mongodb://localhost/test'
    }
}

export default prodConfig 