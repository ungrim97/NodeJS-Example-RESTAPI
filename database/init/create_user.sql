/* uses mysql_native_password as caching_256_password not available in app container */
CREATE USER IF NOT EXISTS 'message_app' IDENTIFIED WITH mysql_native_password BY 'message_app_password';

GRANT ALL ON message_store.* TO 'message_app';
