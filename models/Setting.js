const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define("settings", {
    key: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    type: {
        type: DataTypes.STRING
    },
    value: {
      type: DataTypes.STRING
    },
  },
  {
    timestamps: false
  });
};
