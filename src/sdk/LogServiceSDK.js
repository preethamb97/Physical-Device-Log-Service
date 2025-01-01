class LogServiceSDK {
    constructor(config = {}) {
        this.baseUrl = config.baseUrl || process.env.LOG_SERVICE_URL || 'http://localhost:3000';
        this.endpoint = config.endpoint || '/api/logData';
        this.timeout = config.timeout || 5000; // 5 seconds default timeout
    }

    async logData(requestId, data) {
        try {
            const response = await fetch(`${this.baseUrl}${this.endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ requestId, data }),
                timeout: this.timeout
            });

            if (!response.ok) {
                console.warn(`Warning: Failed to log data. Status: ${response.status}`);
                return false;
            }

            console.debug(`Successfully logged data for requestId: ${requestId}`);
            return true;
        } catch (error) {
            console.warn('Warning: Error logging data:', error.message);
            return false;
        }
    }
}

// Export as singleton
const instance = new LogServiceSDK();
Object.freeze(instance);

module.exports = instance; 