const winston = require('winston');
const fs = require('fs');


if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs');
}
module.exports = new winston.createLogger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: "logs/payFastInfo.log",
            maxFiles: 10,
            maxsize: 100000
        })
    ],
});