# Physical Device Log Service

A robust, production-ready logging service built with Node.js and Express that provides secure and efficient log management capabilities for physical devices through a RESTful API and SDK integration. The service handles log data persistence, queue management, and multi-device support with built-in security features.

## 🌟 Features

- **Secure Logging**: Built-in security features including CORS, Helmet, and HPP protection
- **Queue Management**: Efficient log processing using better-queue
- **Multiple Storage Support**: Configurable storage paths with automatic space management
- **Tunnel Support**: Built-in support for both LocalTunnel and Cloudflare Tunnel
- **SDK Integration**: Easy-to-use SDK for client applications
- **Production Ready**: Includes PM2 configuration and graceful shutdown
- **Request Validation**: Built-in request validation and sanitization
- **Compression**: Automatic response compression
- **Detailed Logging**: Morgan-based request logging with custom formats

## 🚀 Quick Start

1. **Clone the repository**
```
bash
git clone <repository-url>
cd log-service
bash

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
Create a `.env` file in the root directory:
```env
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000
STORAGE_PATHS=api-logs
DEFAULT_STORAGE_PATH=api-logs
TUNNEL_TYPE=localtunnel
TUNNEL_SUBDOMAIN=your-subdomain
CLOUDFLARE_TOKEN=your-token
CLOUDFLARE_HOSTNAME=your-hostname
```

4. **Start the service**
```bash
# Development mode
npm run dev

# Production mode
npm start

# With PM2
npm run start:pm2
```

## 💻 API Usage

### Log Data Endpoint
```http
POST /api/logData

{
  "requestId": "unique-request-id",
  "data": "Your log message here"
}
```

### Using the SDK
```javascript
const logService = require('./sdk/LogServiceSDK');

await logService.logData('request-123', 'Log message');
```

## 🛠️ Development Options

### Running with Tunnels
```bash
# Start with LocalTunnel
npm run tunnel:local

# Start with Cloudflare Tunnel
npm run tunnel:cloudflare
```

### PM2 Management
```bash
# Start with PM2
npm run start:pm2

# Stop PM2 service
npm run stop:pm2

# Restart PM2 service
npm run restart:pm2

# Monitor service
npm run monitor
```

## 🏗️ Architecture

The service is built with a modular architecture:

- **Queue System**: Handles log processing with retry mechanisms
- **Storage Service**: Manages multiple storage locations
- **Tunnel Service**: Provides development tunneling options
- **Validation Layer**: Ensures data integrity and security
- **Controller Layer**: Handles request processing
- **Service Layer**: Contains core business logic

## 🔒 Complete API Documentation

### Endpoints

#### Log Data
```http
POST /api/logData
Content-Type: application/json

{
  "requestId": "string",
  "data": "string|object",
  "level": "info|warn|error",  // optional
  "tags": ["string"],          // optional
  "timestamp": "ISO string"    // optional
}
```

#### Retrieve Logs
```http
GET /api/logs
Query Parameters:
  - startDate (ISO string)
  - endDate (ISO string)
  - level (string)
  - requestId (string)
  - tags (comma-separated string)
  - limit (number)
  - offset (number)
```

#### Clear Logs
```http
DELETE /api/logs
Query Parameters:
  - olderThan (ISO string)    // optional
  - level (string)            // optional
```

### SDK Methods

```javascript
// Initialize SDK
const logService = new LogServiceSDK({
  endpoint: 'http://your-service.com',
  apiKey: 'your-api-key'      // if enabled
});

// Log data
await logService.logData(requestId, data, options);

// Retrieve logs
const logs = await logService.getLogs(queryParams);

// Clear logs
await logService.clearLogs(queryParams);
```

## ⚙️ Advanced Configuration

### Environment Variables
```env
# Server Configuration
PORT=3000
NODE_ENV=development
API_KEY_ENABLED=false
API_KEY=your-secret-key

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,https://your-domain.com
ALLOWED_METHODS=GET,POST,DELETE
ALLOWED_HEADERS=Content-Type,Authorization

# Storage Configuration
STORAGE_PATHS=api-logs,backup-logs
DEFAULT_STORAGE_PATH=api-logs
MAX_STORAGE_SIZE=5GB
ROTATION_INTERVAL=7d

# Queue Configuration
QUEUE_CONCURRENCY=2
QUEUE_RETRY_LIMIT=3
QUEUE_RETRY_DELAY=5000

# Tunnel Configuration
TUNNEL_TYPE=localtunnel|cloudflare
TUNNEL_SUBDOMAIN=your-subdomain
CLOUDFLARE_TOKEN=your-token
CLOUDFLARE_HOSTNAME=your-hostname
```

### PM2 Configuration
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'log-service',
    script: 'src/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 80
    }
  }]
};
```

## 🔒 Security Features

- Helmet.js for secure headers
- CORS protection
- HTTP Parameter Pollution prevention
- Request size limits
- Path traversal protection
- Input validation and sanitization

## 📝 Configuration

The service can be configured through environment variables and the `ecosystem.config.js` file for PM2 deployment.

### Key Configuration Options

- Multiple storage paths
- Tunnel configuration
- CORS settings
- Log formats
- Queue settings
- PM2 process management

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.