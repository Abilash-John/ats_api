const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Job extends Model {
    static associate(models) {
      this.belongsTo(models.User, { foreignKey: 'recruiter_id', as: 'recruiter' });
      this.hasMany(models.Application, { foreignKey: 'job_id', as: 'applications' });
    }
  }

  Job.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      location: {
        type: DataTypes.STRING,
      },
      type: {
        type: DataTypes.ENUM('Full-time', 'Part-time', 'Contract', 'Internship'),
        defaultValue: 'Full-time',
      },
      department: {
        type: DataTypes.STRING,
      },
      salaryRange: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.ENUM('Open', 'Closed', 'On Hold'),
        defaultValue: 'Open',
      },
    },
    {
      sequelize,
      modelName: 'Job',
      timestamps: true,
      underscored: true,
    }
  );

  return Job;
};
