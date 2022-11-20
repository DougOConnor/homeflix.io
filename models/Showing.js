const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define("showings", {
    showing_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    tmdb_id: {
      type: DataTypes.STRING,
    },
    title: {
      type: DataTypes.STRING,
    },
    poster_path: {
      type: DataTypes.STRING,
    },
    year: {
      type: DataTypes.INTEGER,
    },
    showing_datetime: {
      type: DataTypes.STRING,
    }
  },
  {
    timestamps: false,
  });
};

