const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Candidate extends Model {
    static associate(models) {
      this.hasMany(models.Application, { foreignKey: 'candidate_id', as: 'applications' });
    }
  }

  Candidate.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: DataTypes.STRING,
      },
      resumeUrl: {
        type: DataTypes.STRING,
      },
      experienceYears: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      skills: {
        type: DataTypes.JSON, // To keep skill list as JSON/Array
      },
      status: {
        type: DataTypes.ENUM('Applied', 'Screening', 'Interview', 'Offered', 'Rejected', 'Hired'),
        defaultValue: 'Applied',
      },
    },
    {
      sequelize,
      modelName: 'Candidate',
      timestamps: true,
      underscored: true,
    }
  );

  return Candidate;
};
