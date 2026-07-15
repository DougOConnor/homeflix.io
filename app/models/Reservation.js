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
      },
    checked_in: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    checked_in_at: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    timestamps: false,
  });
};
