const { body, validationResult } = require('express-validator');

const validateLogRequest = [
    body('requestId')
        .trim()
        .notEmpty()
        .withMessage('RequestId is required')
        .isLength({ min: 1, max: 100 })
        .withMessage('RequestId must be between 1 and 100 characters')
        .matches(/^[a-zA-Z0-9-_]+$/)
        .withMessage('RequestId can only contain letters, numbers, hyphens, and underscores')
        .escape(),
    
    body('data')
        .trim()
        .notEmpty()
        .withMessage('Data is required')
        .isLength({ max: 1000000 }) // 1MB max
        .withMessage('Data exceeds maximum length')
        .escape(),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

module.exports = {
    validateLogRequest
}; 