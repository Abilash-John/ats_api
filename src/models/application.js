const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Application extends Model {
    static associate(models) {
      this.belongsTo(models.Job, { foreignKey: 'job_id', as: 'job' });
      this.belongsTo(models.Candidate, { foreignKey: 'candidate_id', as: 'candidate' });
      this.hasMany(models.Interview, { foreignKey: 'application_id', as: 'interviews' });
    }
  }

  Application.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      status: {
        type: DataTypes.ENUM('Applied', 'Phone Screen', 'Technical Interview', 'HR Interview', 'Offered', 'Hired', 'Rejected', 'Withdrawn'),
        defaultValue: 'Applied',
      },
      notes: {
        type: DataTypes.TEXT,
      },
      applicationDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Application',
      timestamps: true,
      underscored: true,
    }
  );

  return Application;
};
