import devConfig from "./dev.config"
import prodConfig from "./prod.config"
import testConfig from "./test.config"
import stagingConfig from "./staging.config"
import { Config } from "./config.interface";

export enum ENVIRONMENTS {
    production = "prod",
    staging = "staging",
    test = "test",
    development = "dev",
}

const getConfig = (): Config => {
    switch (process.env.NODE_ENV) {
        case ENVIRONMENTS.development:
            return devConfig;
        case ENVIRONMENTS.production:
            return prodConfig;
        case ENVIRONMENTS.test:
            return testConfig;
        case ENVIRONMENTS.staging:
            return stagingConfig;
        default:
            console.error('NODE_ENV environment variable not set | dev will be used');
            return devConfig;
    }
};

const jwtOptions: any = {
    jwtFromRequest: require('passport-jwt').ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'mEQHQ9Ks3h'
};

export { jwtOptions };
export default getConfig();
