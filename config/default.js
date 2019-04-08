module.exports = {
  store: {
    message_store: {
      host: process.env.MS_DB_HOST || '127.0.0.1',
      user: process.env.MS_DB_USER || 'message_app',
      password: process.env.MS_DB_PASS || 'message_app_password',
      database: process.env.MS_DB_DATABASE || 'message_store',
      port: process.env.MS_DB_PORT || 3306,
      dialect: 'mysql',
      pool: {
        max: 10,
        min: 1,
        idle: 10000
      }
    }
  },
  port: process.env.MS_PORT || 3000,
  appBaseUrl: process.env.MS_BASE_URL || 'http://localhost',
  version: '0.3.1'
};
