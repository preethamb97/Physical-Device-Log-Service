const fs = require('fs').promises;
const path = require('path');

class StorageService {
    constructor() {
        this.storagePaths = (process.env.STORAGE_PATHS || 'api-logs').split(',');
        this.defaultPath = process.env.DEFAULT_STORAGE_PATH || 'api-logs';
    }

    async initializeStoragePaths() {
        for (const storagePath of this.storagePaths) {
            const normalizedPath = path.normalize(storagePath);
            
            try {
                await fs.access(normalizedPath);
            } catch (error) {
                if (error.code === 'ENOENT') {
                    await fs.mkdir(normalizedPath, { recursive: true, mode: 0o755 });
                } else {
                    console.error(`Error accessing ${normalizedPath}:`, error);
                }
            }
        }
    }

    async createNestedDirectory(basePath, nestedPath) {
        const fullPath = path.join(basePath, nestedPath);
        const normalizedPath = path.normalize(fullPath);
        
        // Security check to prevent directory traversal
        if (!normalizedPath.startsWith(basePath)) {
            throw new Error('Invalid nested path detected');
        }

        await fs.mkdir(normalizedPath, { recursive: true, mode: 0o755 });
        return normalizedPath;
    }

    async getAvailableStorage() {
        for (const storagePath of this.storagePaths) {
            try {
                const stats = await fs.statfs(storagePath);
                const availableSpace = stats.bavail * stats.bsize;
                if (availableSpace > 1024 * 1024 * 100) { // 100MB minimum
                    return storagePath;
                }
            } catch (error) {
                console.warn(`Storage path ${storagePath} not accessible:`, error);
            }
        }
        return this.defaultPath;
    }
}

module.exports = new StorageService(); 