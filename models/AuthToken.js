const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define("auth_tokens", {
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'user_id'
      }
    },
    token: {
      type: DataTypes.STRING,
      primaryKey : true,
    }
  },
  {
    timestamps: false,
  });
};
