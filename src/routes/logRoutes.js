const express = require('express');
const router = express.Router();
const LogController = require('../controllers/logController');
const { validateLogRequest } = require('../middleware/validator');
const validatePath = require('../middleware/pathValidator');

router.use(validatePath('/logData'));

router.post('/logData', validateLogRequest, LogController.logData);

module.exports = router; 