'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('candidates', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      phone: {
        type: Sequelize.STRING
      },
      resume_url: {
        type: Sequelize.STRING
      },
      experience_years: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      skills: {
        type: Sequelize.JSON
      },
      status: {
        type: Sequelize.ENUM('Applied', 'Screening', 'Interview', 'Offered', 'Rejected', 'Hired'),
        defaultValue: 'Applied'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('candidates');
  }
};
