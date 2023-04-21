const { Sequelize } = require('sequelize');
const dbpath = './data/production.db'
const db = require('better-sqlite3')(dbpath)
const config = require('../config/config.js')

const sequelize = new Sequelize(config.production);

const modelDefiners = [
	require('./Showing'),
    require('./Seat'),
	require('./User'),
	require('./AuthToken'),
	require('./Reservation'),
	require('./Setting'),
];

for (const modelDefiner of modelDefiners) {
	modelDefiner(sequelize);
}

sequelize.models.showings.hasMany(
	sequelize.models.reservations,
	{ foreignKey: 'showing_id', sourceKey: 'showing_id' }
);

sequelize.models.reservations.belongsTo(
	sequelize.models.showings,
	{ foreignKey: 'showing_id', targetKey: 'showing_id' }
);

sequelize.models.reservations.belongsTo(
	sequelize.models.users,
	{ foreignKey: 'user_id', targetKey: 'user_id' }
);

module.exports = sequelize;