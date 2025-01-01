const LogService = require('../services/logService');

class LogController {
    static async logData(req, res, next) {
        try {
            console.debug('Request intitated in logController logData');
            const { requestId, data } = req.body;
            
            await LogService.appendLog(requestId, data);
            
            res.status(200).json({
                success: true,
                message: 'Log data added successfully'
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = LogController; 