'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('reservations', 'checked_in', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
    await queryInterface.addColumn('reservations', 'checked_in_at', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.createTable('snacks', {
      snack_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      price: {
        type: Sequelize.FLOAT,
      },
      image_path: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      available: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    });
    await queryInterface.createTable('snack_orders', {
      order_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
      },
      showing_id: {
        type: Sequelize.INTEGER,
      },
      items: {
        type: Sequelize.TEXT,
      },
      created_at: {
        type: Sequelize.STRING,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('reservations', 'checked_in');
    await queryInterface.removeColumn('reservations', 'checked_in_at');
    await queryInterface.dropTable('snacks');
    await queryInterface.dropTable('snack_orders');
  }
};
