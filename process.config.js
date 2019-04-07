module.exports = {
  apps: [
    {
      name: 'messageStore',
      script: 'bin/server.js',
      exec_mode: 'cluster',
      max_restarts: 5,
      min_uptime: 5000,
      // Log STDERR/STDOUT to error log
      log: process.env.ERROR_LOG_FILE,
      merge_logs: true,
      instance_var: 'PM2_APP_INSTANCE',
      env: {
        watch: false,
        NODE_ENV: 'production'
      }
    }
  ]
};
