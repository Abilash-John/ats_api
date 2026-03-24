'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('interviews', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      application_id: {
        type: Sequelize.UUID,
        references: {
          model: 'applications',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      interviewer_id: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      interview_type: {
        type: Sequelize.ENUM('Phone', 'Technical', 'HR', 'On-site', 'Video'),
        defaultValue: 'Technical'
      },
      scheduled_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      duration_minutes: {
        type: Sequelize.INTEGER,
        defaultValue: 60
      },
      meeting_link: {
        type: Sequelize.STRING
      },
      feedback: {
        type: Sequelize.TEXT
      },
      rating: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.ENUM('Scheduled', 'Completed', 'Cancelled', 'Rescheduled'),
        defaultValue: 'Scheduled'
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
    await queryInterface.dropTable('interviews');
  }
};
