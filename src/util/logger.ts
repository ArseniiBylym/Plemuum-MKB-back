import { default as config, ENVIRONMENTS } from "../../config/config";

const winston = require("winston");

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({format: winston.format.json()})
    ]
});

if (config.env !== ENVIRONMENTS.DEVELOPMENT) {
    logger.add(new winston.transports.File({filename: './log/error.log', level: 'error'}));
}

export default logger;