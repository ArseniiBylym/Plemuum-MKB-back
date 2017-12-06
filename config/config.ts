import devConfig from "./dev.config"
import defaultConfig from "./default.config"
import { Config } from "./config.interface";

export enum ENVIRONMENTS {
    PRODUCTION = "production",
    STAGING = "staging",
    TEST = "test",
    DEVELOPMENT = "dev",
}

const getConfig = (): Config => {
    return process.env.NODE_ENV === ENVIRONMENTS.DEVELOPMENT
        ? devConfig
        : defaultConfig
};

const jwtOptions: any = {
    jwtFromRequest: require('passport-jwt').ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: getConfig().tokenHash
};

export { jwtOptions };
export default getConfig();
