
mkdir -p data
node utils/database-init.js

export NODE_ENV="production"
npx sequelize-cli db:migrate
NODE_ENV=production node server.js
