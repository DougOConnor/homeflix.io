const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define("seats", {
    seat_id: {
      type: DataTypes.STRING,
      primaryKey: true
    }
  },
  {
    timestamps: false,
  });
};

