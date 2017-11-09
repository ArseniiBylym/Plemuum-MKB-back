const {createLogger, format, transports} = require("winston");
const {json} = format;

const logger = createLogger({
    level: 'info',
    format: json(),
    transports: [
        new transports.Console({format: json()}),
        new transports.File({filename: './log/error.log', level: 'error'}),
        new transports.File({filename: './log/info.log', level: 'info'})
    ]
});

export default logger;