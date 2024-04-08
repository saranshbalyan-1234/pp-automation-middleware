const db = require("../Utils/dataBaseConnection");
const getError = require("../Utils/sequelizeError");
const Process = db.process;
const Object = db.objects;
const TestParameter = db.testParameters;
const TestStep = db.testSteps;
const ReusableProcess = db.reusableProcess;
const ObjectLocator = db.ObjectLocators;
const TestCase = db.testCases

const getTestStepByTestCase = async (req, res) => {
  try {

    const testCaseId = req.params.testCaseId;
    const testCaseData = await Process.schema(req.database).findAll({
      where: { testCaseId },
      include: [
        {
          model: TestStep.schema(req.database),
          include: [
            {
              model: Object.schema(req.database),
              include: [
                {
                  model: ObjectLocator.schema(req.database),
                  as: "locators",
                },
              ],
            },
            { model: TestParameter.schema(req.database) },
          ],
        },
        {
          model: ReusableProcess.schema(req.database),
          include: [
            {
              model: TestStep.schema(req.database),
              include: [
                {
                  model: Object.schema(req.database),
                  include: [
                    {
                      model: ObjectLocator.schema(req.database),
                      as: "locators",
                    },
                  ],
                },
                { model: TestParameter.schema(req.database) },
              ],
            },
          ],
        },
      ],
      order: [
        ["step", "ASC"],
        [TestStep, "step", "ASC"],
        [ReusableProcess, TestStep, "step", "ASC"],
      ],
    });

    const updatedTestCase = testCaseData.map((process) => {
      let tempTestCaseData = { ...process.dataValues };

      if (tempTestCaseData.reusableProcess != null) {
        tempTestCaseData.testSteps =
          tempTestCaseData.reusableProcess.dataValues.testSteps;
        delete tempTestCaseData.reusableProcess.dataValues.testSteps;
      }
      return tempTestCaseData;
    });
    return updatedTestCase;
  } catch (err) {
    getError(err, res);
  }
};

const getTestCaseDetailsById = async (req, testCaseId) => {

  try {

    const testCase = await TestCase.schema(req.database).findByPk(testCaseId, {
      attributes: [
        "name",
      ],
    });

    let temp = { ...testCase.dataValues };

    return temp
  } catch (error) {
    console.log(error)
  }
};

module.exports = { getTestStepByTestCase, getTestCaseDetailsById };
