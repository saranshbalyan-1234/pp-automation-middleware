const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv");
const path = require('path');
const chalk = require("chalk");
const User = require("../Models/User");
const TestCase = require("../Models/TestCase/TestCase");
const Object = require("../Models/TestCase/Object/Object");
const ObjectLocator = require("../Models/TestCase/Object/ObjectLocator");
const TestParameter = require("../Models/TestCase/TestParameter");
const TestStep = require("../Models/TestCase/TestStep");
const Process = require("../Models/TestCase/Process");
const ReusableProcess = require("../Models/TestCase/ReusableProcess");

//Project
const UserProject = require("../Models/Project/UserProject.js")
const Project = require("../Models/Project/Project.js")

//Execution History
const ExecutionHistory = require("../Models/TestCase/ExecutionHistory/ExecutionHistory");
const ProcessHistory = require("../Models/TestCase/ExecutionHistory/ProcessHistory");
const TestStepHistory = require("../Models/TestCase/ExecutionHistory/TestStepHistory");

//Environment
const Environment = require("../Models/TestCase/Environment/Environment");
const Column = require("../Models/TestCase/Environment/Column");

const dotenvAbsolutePath = path.join(__dirname, '../.env');
dotenv.config({ path: dotenvAbsolutePath });

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASS,

  {
    host: process.env.DATABASE_HOST,
    dialect: "mysql",
    logging: false,
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log(chalk.blueBright("SYSTEM INFO: You can execute now!" + "\n"))
  })
  .catch((err) => {
    console.log("Sequalize Error", err);
  });

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.sequelize.dialect.supports.schemas = true;

db.testParameters = TestParameter(sequelize, DataTypes);
db.objects = Object(sequelize, DataTypes);
db.ObjectLocators = ObjectLocator(sequelize, DataTypes);
db.testSteps = TestStep(sequelize, DataTypes);
db.testCases = TestCase(sequelize, DataTypes);
db.process = Process(sequelize, DataTypes);
db.reusableProcess = ReusableProcess(sequelize, DataTypes);

//Project
db.userProjects = UserProject(sequelize, DataTypes)
db.projects = Project(sequelize, DataTypes);

//executionHistory
db.executionHistory = ExecutionHistory(sequelize, DataTypes);
db.processHistory = ProcessHistory(sequelize, DataTypes);
db.testStepHistory = TestStepHistory(sequelize, DataTypes);

//environment
db.enviroments = Environment(sequelize, DataTypes);
db.columns = Column(sequelize, DataTypes);

db.users = User(sequelize, DataTypes); //all associations

module.exports = db;
