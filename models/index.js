const { Sequelize } = require('sequelize');
const dbpath = './data/production.db'
const db = require('better-sqlite3')(dbpath)

const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: dbpath,
});

const modelDefiners = [
	require('./Showing'),
  require('./Seat'),
	require('./User'),
	require('./AuthToken'),
	require('./Reservation'),
];

for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize);
}

module.exports = sequelize;