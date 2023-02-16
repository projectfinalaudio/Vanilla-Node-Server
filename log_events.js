const log = console.log;
const fs = require('fs');
const fsPromises = require('fs').promises;
const { v4: uuid } = require('uuid');
const { format } = require('date-fns');
const path = require('path');
exports.logEvents = async (message, file_name) => {
    const log_date = format(new Date(), 'yyyyMMdd\tHH:mm:ss');
    const log_entry = `${log_date}\t${uuid()}\t${message}\n`;
    log(log_entry);
    try {
        let dir_path = path.join(__dirname, 'logs');
        let file_path = path.join(__dirname, 'logs', file_name);
        if (!fs.existsSync(dir_path)) {
            log('Logs will be stored in the /logs directory...');
            await fsPromises.mkdir(dir_path);
            await fsPromises.appendFile(file_path, log_entry);
        } else {
            await fsPromises.appendFile(file_path, log_entry);
        }
    } catch (err) {
        console.error(err);
    }
}
