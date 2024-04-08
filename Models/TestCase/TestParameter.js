module.exports = (sequelize, DataTypes) => {
  const TestParameter = sequelize.define("testParameters", {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
      },
    },
    property: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
      },
      defaultValue: "Static",
    },
    method: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
      },
    },
    testStepId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: true,
      },
      references: {
        model: "testSteps",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  });

  return TestParameter;
};
