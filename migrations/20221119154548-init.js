'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', { 
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: Sequelize.STRING,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      birthdate: {
        type: Sequelize.DATEONLY,
      },
      is_admin: {
        type: Sequelize.BOOLEAN,
      },
      password: {
        type: Sequelize.STRING,
      },
      reset_token: {
        type: Sequelize.STRING,
      }
    });
    await queryInterface.createTable('auth_tokens', { 
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'user_id'
        }
      },
      token: {
        type: Sequelize.STRING,
        primaryKey : true,
      }
    });
    await queryInterface.createTable('seats', { 
      seat_id: {
        type: Sequelize.STRING,
        primaryKey: true
      }
    });
    await queryInterface.createTable('showings', { 
      showing_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      tmdb_id: {
        type: Sequelize.STRING,
      },
      title: {
        type: Sequelize.STRING,
      },
      poster_path: {
        type: Sequelize.STRING,
      },
      year: {
        type: Sequelize.INTEGER,
      },
      showing_datetime: {
        type: Sequelize.STRING,
      }
    });
    await queryInterface.createTable('reservations', {
      seat_id: {
        type: Sequelize.STRING,
        primaryKey: true,
        references: {
          model: 'seats',
          key: 'seat_id'
        }
      },
      showing_id: {
        type: Sequelize.INTEGER,
        primaryKey : true,
        references: {
          model: 'showings',
          key: 'showing_id'
        }
      },
      user_id: {
          type: Sequelize.INTEGER,
          primaryKey : true,
          references: {
            model: 'users',
            key: 'user_id'
          }
        }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('reservations');
    await queryInterface.dropTable('showings');
    await queryInterface.dropTable('seats');
    await queryInterface.dropTable('auth_tokens');
    await queryInterface.dropTable('users');
  }
};
