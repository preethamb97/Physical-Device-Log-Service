require('dotenv').config();
const logService = require('../sdk/LogServiceSDK');

// Example usage
async function example() {
    // Success case
    await logService.logData(
        'test-request-123',
        'This is a test log message'
    );

    // Error case with invalid request ID
    await logService.logData(
        '', // invalid request ID
        'This should show a warning'
    );
}

example(); 