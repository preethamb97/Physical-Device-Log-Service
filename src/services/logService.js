const logQueue = require('../queue/logQueue');

class LogService {
    static async appendLog(requestId, data, nestedPath = null) {
        return new Promise((resolve, reject) => {
            logQueue.push({ requestId, data, nestedPath }, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });
    }
}

module.exports = LogService; 