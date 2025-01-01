require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const helmet = require('helmet');
const hpp = require('hpp');
const cors = require('cors');
const compression = require('compression');
const logRoutes = require('./routes/logRoutes');
const { LOG_DIR } = require('./constants');
const storageService = require('./services/storageService');
const tunnelService = require('./services/tunnelService');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const app = express();
const PORT = process.env.PORT;

// Wrap the initialization in an async function
async function initializeApp() {
    try {
        // Security Headers
        app.use(helmet());

        // Add custom Morgan logging format
        morgan.token('request-id', (req) => req.body?.requestId || '-');
        morgan.token('response-time', (req, res) => {
            if (!res._header || !req._startAt) return '-';
            const diff = process.hrtime(req._startAt);
            const time = diff[0] * 1e3 + diff[1] * 1e-6;
            return time.toFixed(2);
        });

        // Development logging
        if (process.env.NODE_ENV !== 'production') {
            app.use(morgan(':method :url :status :response-time ms - RequestID: :request-id'));
        } else {
            // Production logging
            // Create a write stream (in append mode)
            const accessLogStream = fs.createWriteStream(
                path.join(normalizedLogsDir, 'access.log'),
                { flags: 'a' }
            );
            
            app.use(morgan(
                ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms - RequestID: :request-id',
                { stream: accessLogStream }
            ));
        }

        // CORS protection
        app.use(cors({
            origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
            credentials: true,
            maxAge: 86400 // 24 hours
        }));

        // Prevent HTTP Parameter Pollution
        app.use(hpp());

        // Compress responses
        app.use(compression());

        // Body parser with size limits
        app.use(express.json({ limit: '10kb' }));

        // Create logs directory if it doesn't exist
        const logsDir = path.join(__dirname, `../${LOG_DIR}`);
        const normalizedLogsDir = path.normalize(logsDir);

        // Ensure the logs directory is where we expect it to be
        if (!normalizedLogsDir.startsWith(path.normalize(path.join(__dirname, '..')))) {
            throw new Error('Invalid logs directory path');
        }

        if (!fs.existsSync(normalizedLogsDir)) {
            fs.mkdirSync(normalizedLogsDir, { mode: 0o755 });
        }

        // Initialize storage paths
        await storageService.initializeStoragePaths();

        // Routes
        app.use('/api', logRoutes);

        // Global error handler
        app.use((err, req, res, next) => {
            console.error(err.stack);
            const error = process.env.NODE_ENV === 'production' 
                ? 'Internal Server Error' 
                : err.message;
            res.status(500).json({ error });
        });

        // Swagger documentation
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
            customCss: '.swagger-ui .topbar { display: none }',
            customSiteTitle: "Log Service API Documentation"
        }));

        // Start the server
        const server = app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });

        // Create tunnel in development environment
        if (process.env.NODE_ENV !== 'production') {
            await tunnelService.createTunnel(PORT, {
                type: process.env.TUNNEL_TYPE || 'localtunnel',
                subdomain: process.env.TUNNEL_SUBDOMAIN,
                cloudflareToken: process.env.CLOUDFLARE_TOKEN,
                cloudflareHostname: process.env.CLOUDFLARE_HOSTNAME
            });
        }

        return server;
    } catch (error) {
        console.error('Failed to initialize application:', error);
        throw error;
    }
}

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    await tunnelService.closeTunnel();
    app.close(() => {
        console.log('Process terminated');
        process.exit(0);
    });
});

// Initialize the application
initializeApp().catch(error => {
    console.error('Failed to initialize application:', error);
    process.exit(1);
}); 