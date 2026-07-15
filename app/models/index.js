const { Sequelize } = require('sequelize');
const dbpath = './data/production.db'
const config = require('../config/config.js')

const sequelize = new Sequelize(config);

const modelDefiners = [
	require('./Showing'),
    require('./Seat'),
	require('./user'),
	require('./AuthToken'),
	require('./Reservation'),
	require('./Setting'),
	require('./Snack'),
	require('./SnackOrder'),
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
	sequelize.models.user,
	{ foreignKey: 'user_id', targetKey: 'user_id' }
);

module.exports = sequelize;