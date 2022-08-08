mkdir -p data
node utils/databaseMigration.js

NODE_ENV=production node server.js
