module.exports = {
  apps: [{
    name: 'log-service',
    script: 'src/index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    },
    error_file: 'logs/pm2/err.log',
    out_file: 'logs/pm2/out.log',
    log_file: 'logs/pm2/combined.log',
    time: true,
    exp_backoff_restart_delay: 100,
    max_restarts: 10,
    restart_delay: 4000
  }]
}; 