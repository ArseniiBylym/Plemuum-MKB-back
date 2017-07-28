import devConfig from "./dev.config"
import prodConfig from "./prod.config"
import { Config } from "./config";

const getConfig = (): Config => {
    switch (process.env.NODE_ENV) {
        case "dev":
            return devConfig;
        case "prod":
            return prodConfig;
        default:
            console.error('NODE_ENV environment variable not set | dev will be used');
            return devConfig;
    }
}

export { getConfig };