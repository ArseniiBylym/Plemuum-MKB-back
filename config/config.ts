import devConfig from "./dev.config"
import prodConfig from "./prod.config"
import testConfig from "./test.config"
import { Config } from "./config.interface";

const getConfig = (): Config => {
    switch (process.env.NODE_ENV) {
        case "dev":
            return devConfig;
        case "prod":
            return prodConfig;
        case "test":
            return testConfig;
        default:
            console.error('NODE_ENV environment variable not set | dev will be used');
            return devConfig;
    }
};

export default getConfig();