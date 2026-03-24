const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Interview extends Model {
    static associate(models) {
      this.belongsTo(models.Application, { foreignKey: 'application_id', as: 'application' });
      this.belongsTo(models.User, { foreignKey: 'interviewer_id', as: 'interviewer' });
    }
  }

  Interview.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      interviewType: {
        type: DataTypes.ENUM('Phone', 'Technical', 'HR', 'On-site', 'Video'),
        defaultValue: 'Technical',
      },
      scheduledAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      durationMinutes: {
        type: DataTypes.INTEGER,
        defaultValue: 60,
      },
      meetingLink: {
        type: DataTypes.STRING,
      },
      feedback: {
        type: DataTypes.TEXT,
      },
      rating: {
        type: DataTypes.INTEGER,
        validate: { min: 1, max: 5 },
      },
      status: {
        type: DataTypes.ENUM('Scheduled', 'Completed', 'Cancelled', 'Rescheduled'),
        defaultValue: 'Scheduled',
      },
    },
    {
      sequelize,
      modelName: 'Interview',
      timestamps: true,
      underscored: true,
    }
  );

  return Interview;
};
