const { DataTypes } = require('sequelize');
const bcrypt = require("bcrypt")

module.exports = (sequelize) => {
  const User = sequelize.define("user", {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    is_admin: {
      type: DataTypes.BOOLEAN,
    },
    reset_token: {
      type: DataTypes.STRING,
    },
    auth_salt: {
      type: DataTypes.STRING,
    }
  },
  {
    timestamps: false,
    tableName: 'users',
    hooks: {
      beforeCreate: async (user, options) => {
        const saltRounds = 10
        if (user.password) {
          user.auth_salt = await bcrypt.genSalt(saltRounds);
          user.password = await user.generateHash(user.password, user.auth_salt);
        }
      },
      beforeUpdate: async (user, options) => {
        let changed = user.changed()
        if (changed.includes("password")) {
          user.password = await user.generateHash(user.password, user.auth_salt);
        }
        if (changed.includes("reset_token")) {
          if (user.reset_token !== null) {
            user.reset_token = await user.generateHash(user.reset_token, user.auth_salt);
          }
        }
      }
    }
  });
  User.prototype.generateHash = async function (password, salt) {
    var hash = await bcrypt.hash(password, salt);
    return hash
  }
  
  User.prototype.validatePassword = async function (password) {
    const hashed = await this.generateHash(password, this.auth_salt)
    return this.password === hashed;
  }

  User.prototype.validateResetToken = async function (token) {
    const hashed = await this.generateHash(token, this.auth_salt)
    return this.reset_token === hashed;
  }

};