module.exports = (sequelize, DataTypes) => {
  const Process = sequelize.define("processes", {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: true,
      },
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    step: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: true,
      },
    },
    enable: {
      type: DataTypes.BOOLEAN,
      defaultValue: 1,
      values: [0, 1],
    },
    testCaseId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: true,
      },
      references: {
        model: "testCases",
        key: "id",
      },
    },
    reusableProcessId: {
      type: DataTypes.INTEGER,
      references: {
        model: "reusableProcesses",
        key: "id",
      },
    },
  });

  return Process;
};
