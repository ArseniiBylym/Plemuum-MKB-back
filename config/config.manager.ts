import {DevConfig} from "./dev.config"
import {ProdConfig} from "./prod.config"
import {Config} from "./config";

export class ConfigManager {
    public static getConfig = (): Config => {
        switch (process.env.NODE_ENV) {
            case "dev":
                return new DevConfig();
            case "prod":
                return new ProdConfig();
            default:
                console.error('NODE_ENV environment variable not set | dev will be used');
                return new DevConfig();
        }
    };
}