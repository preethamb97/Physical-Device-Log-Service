const express = require('express');
const router = express.Router();
const LogController = require('../controllers/logController');
const { validateLogRequest } = require('../middleware/validator');
const validatePath = require('../middleware/pathValidator');

/**
 * @swagger
 * components:
 *   schemas:
 *     LogRequest:
 *       type: object
 *       required:
 *         - requestId
 *         - data
 *       properties:
 *         requestId:
 *           type: string
 *           description: Unique identifier for the log request
 *           example: request-123
 *         data:
 *           type: string
 *           description: Log message or data to be stored
 *           example: Application started successfully
 *         level:
 *           type: string
 *           enum: [info, warn, error]
 *           description: Log level (optional)
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of tags (optional)
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: ISO timestamp (optional)
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               msg:
 *                 type: string
 *               param:
 *                 type: string
 */

/**
 * @swagger
 * /api/logData:
 *   post:
 *     summary: Log data for a physical device
 *     tags: [Logs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LogRequest'
 *     responses:
 *       200:
 *         description: Log data added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Log data added successfully
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.use(validatePath('/logData'));
router.post('/logData', validateLogRequest, LogController.logData);

module.exports = router; 