const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Physical Device Log Service API',
      version: '1.0.0',
      description: 'API documentation for the Physical Device Log Service',
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
      contact: {
        name: 'API Support',
        url: 'https://github.com/yourusername/log-service',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Path to the API routes
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec; 