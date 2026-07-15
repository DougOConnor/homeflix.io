const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define("snack_orders", {
    order_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
    },
    showing_id: {
      type: DataTypes.INTEGER,
    },
    // JSON snapshot of [{snack_id, name, price, qty}] at order time
    items: {
      type: DataTypes.TEXT,
    },
    created_at: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  });
};
