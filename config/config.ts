import devConfig from "./dev.config"
import prodConfig from "./prod.config"
import testConfig from "./test.config"
import stagingConfig from "./staging.config"
import { Config } from "./config.interface";

export enum ENVIRONMENTS {
    PRODUCTION = "prod",
    STAGING = "staging",
    TEST = "test",
    DEVELOPMENT = "dev",
}

const getConfig = (): Config => {
    switch (process.env.NODE_ENV) {
        case ENVIRONMENTS.PRODUCTION:
            return prodConfig;
        case ENVIRONMENTS.TEST:
            return testConfig;
        case ENVIRONMENTS.STAGING:
            return stagingConfig;
        default:
            return devConfig;
    }
};

const jwtOptions: any = {
    jwtFromRequest: require('passport-jwt').ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'HlP8IqXEfXyrP0LgZihWSyLwlcSlySc3H40yj9P2'
};

export { jwtOptions };
export default getConfig();
