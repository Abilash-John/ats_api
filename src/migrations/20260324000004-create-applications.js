'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('applications', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      job_id: {
        type: Sequelize.UUID,
        references: {
          model: 'jobs',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      candidate_id: {
        type: Sequelize.UUID,
        references: {
          model: 'candidates',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.ENUM('Applied', 'Phone Screen', 'Technical Interview', 'HR Interview', 'Offered', 'Hired', 'Rejected', 'Withdrawn'),
        defaultValue: 'Applied'
      },
      notes: {
        type: Sequelize.TEXT
      },
      application_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
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

    // Add unique constraint for (job_id, candidate_id) to prevent duplicate applications
    await queryInterface.addConstraint('applications', {
      fields: ['job_id', 'candidate_id'],
      type: 'unique',
      name: 'unique_application_per_candidate_job'
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('applications');
  }
};
