const path = require('path');

const validatePath = (basePath) => (req, res, next) => {
    const requestPath = req.path;
    const normalizedPath = path.normalize(requestPath);
    // Prevent path traversal
    if (normalizedPath.includes('..') || !normalizedPath.startsWith(basePath)) {
        return res.status(400).json({ error: 'Invalid path' });
    }
    next();
};

module.exports = validatePath; 