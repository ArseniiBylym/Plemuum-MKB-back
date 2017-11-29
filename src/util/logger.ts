import config, { ENVIRONMENTS } from "../../config/config";

const {createLogger, format, transports} = require("winston");
const {json} = format;

export default function getLogger() {
    const logger = createLogger({
        level: 'info',
        format: json(),
        transports: []
    });
    if (config.env === ENVIRONMENTS.DEVELOPMENT) {
        logger.add(new transports.Console({format: json()}));
    } else {
        const currentDateString = new Date().toISOString().substr(0, 10);
        logger.add(new transports.File({filename: `./log/error-${currentDateString}.log`, level: 'error'}));
        logger.add(new transports.File({filename: `./log/info-${currentDateString}.log`, level: 'info'}));
    }
    return logger;
}