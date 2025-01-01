# Use Node.js LTS (Long Term Support) as base image
FROM node:20-slim

# Create app directory
WORKDIR /usr/src/app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    cloudflared \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application source
COPY . .

# Create necessary directories
RUN mkdir -p api-logs logs/pm2 && \
    chown -R node:node /usr/src/app

# Switch to non-root user
USER node

# Expose the port the app runs on
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production \
    PORT=3000 \
    STORAGE_PATHS=api-logs \
    DEFAULT_STORAGE_PATH=api-logs

# Start the application
CMD ["npm", "start"]