const Queue = require('better-queue');
const fs = require('fs').promises;
const path = require('path');
const MemoryStore = require('better-queue-memory');
const { LOG_DIR } = require('../constants');
const storageService = require('../services/storageService');

const LOGS_BASE_DIR = path.join(__dirname, `../../${LOG_DIR}`);

const logQueue = new Queue(async function (task, cb) {
    try {
        const { requestId, data, nestedPath } = task;
        
        // Get available storage location
        const storagePath = await storageService.getAvailableStorage();
        
        // Validate file path to prevent directory traversal
        const sanitizedRequestId = requestId.replace(/[^a-zA-Z0-9-_]/g, '');
        
        let finalPath;
        if (nestedPath) {
            const sanitizedNestedPath = nestedPath.replace(/[^a-zA-Z0-9-_\/]/g, '');
            const nestedDir = await storageService.createNestedDirectory(storagePath, sanitizedNestedPath);
            finalPath = path.join(nestedDir, sanitizedRequestId);
        } else {
            finalPath = path.join(storagePath, sanitizedRequestId);
        }
        
        // Check file size before writing
        try {
            const stats = await fs.stat(finalPath);
            const fileSizeInMB = stats.size / (1024 * 1024);
            if (fileSizeInMB > 10) {
                throw new Error('File size limit exceeded');
            }
        } catch (error) {
            if (error.code !== 'ENOENT') throw error;
        }
        
        await fs.appendFile(finalPath, data + '\n');
        cb(null, { success: true, path: finalPath });
    } catch (error) {
        cb(error);
    }
}, { 
    concurrent: 1,
    maxRetries: 3,
    retryDelay: 1000,
    maxTimeout: 30000, // 30 seconds maximum processing time
    afterProcessDelay: 50, // Small delay between tasks
    
    // Memory management
    store: new MemoryStore(),
});

// Monitor queue size
setInterval(() => {
    const queueSize = logQueue.getStats().total;
    if (queueSize > 900) { // 90% of max size
        console.warn(`Queue size warning: ${queueSize} items`);
    }
}, 60000);

// Clean up on process exit
process.on('SIGINT', () => {
    logQueue.destroy(() => {
        process.exit(0);
    });
});

module.exports = logQueue; 