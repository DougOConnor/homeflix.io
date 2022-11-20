const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define("reservations", {
    seat_id: {
      type: DataTypes.STRING,
      primaryKey: true,
      references: {
        model: 'seats',
        key: 'seat_id'
      }
    },
    showing_id: {
      type: DataTypes.INTEGER,
      primaryKey : true,
      references: {
        model: 'showings',
        key: 'showing_id'
      }
    },
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey : true,
        references: {
          model: 'users',
          key: 'user_id'
        }
      }
  },
  {
    timestamps: false,
  });
};
