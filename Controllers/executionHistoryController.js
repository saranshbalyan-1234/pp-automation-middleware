const db = require("../Utils/dataBaseConnection");
const getError = require("../Utils/sequelizeError");
const chalk = require("chalk");
const { getProjectById } = require("./projectController")
const { sendMail } = require("../Utils/Mail/nodeMailer");
const { getTestCaseDetailsById } = require("./testCaseController");
const ExecutionHistory = db.executionHistory;
const ProcessHistory = db.processHistory;
const TestStepHistory = db.testStepHistory;

const createExecutionHistory = async (req, res) => {
  try {
    const payload = { ...req.body };
    const testCaseId = req.params.testCaseId;
    payload.executedByUser = req.user.id;
    payload.testCaseId = testCaseId;
    payload.result = null;
    if (!req.body.history) return payload;
    return await ExecutionHistory.schema(req.database).create(payload);
  } catch (err) {
    console.log(err);
    getError(err, res);
  }
};
const createProcessHistory = async (req, process, executionHistory) => {
  if (!req.body.history) return;
  const payload = {};
  payload.executionHistoryId = executionHistory.id;
  payload.processId = process.id;
  payload.step = process.step;
  payload.name = process.name;
  payload.reusableProcess = process.reusableProcess;
  payload.comment = process.comment;
  payload.result = null;

  return await ProcessHistory.schema(req.database).create(payload);
};
const createStepHistory = async (
  req,
  step,
  executionHistory,
  processHistory
) => {
  if (!req.body.history) return;
  const payload = {};
  payload.testStepId = step.id;
  payload.comment = step.comment;
  payload.actionEvent = step.actionEvent;
  payload.step = step.step;
  payload.object = step.object;
  payload.processId = processHistory.dataValues.processId;
  payload.screenshot = step.screenshot || executionHistory.recordAllSteps;
  payload.executionHistoryId = executionHistory.id;
  payload.result = null;
  payload.failedOutput = null;
  payload.testParameters = Object.entries(step.testParameters).map((el) => {
    let temp = {};
    temp.type = el[0];
    temp.property = temp.type.toLowerCase().includes("password")
      ? "*".repeat(el[1].length)
      : el[1];
    return temp;
  });
  return await TestStepHistory.schema(req.database).create(payload);
};
const updateStepResult = async (req, id, result, failedLog = null, step) => {
  if (!req.body.history) return;
  if (step?.actionEvent == "End For Loop" && !id) return;
  if (!id) return console.log("Unable to update step result");
  try {
    return await TestStepHistory.schema(req.database).update(
      { result, failedLog },
      {
        where: {
          id,
        },
      }
    );
  } catch (err) {
    console.log(err);
  }
};
const updateProcessResult = async (req, id, result) => {
  if (!req.body.history) return;
  return await ProcessHistory.schema(req.database).update(
    { result },
    {
      where: {
        id,
      },
    }
  );
};

const updateExecutionResult = async (req, id, time, result, status, driver) => {
  if (req.body.history) {
    await ExecutionHistory.schema(req.database).update(
      { finishedAt: time, result: result, status },
      {
        where: {
          id,
        },
      }
    );
  }
  if (process.env.QUIT_AFTER_FINISH == "true") {
    await driver.quit();
  }

  return console.log(chalk.cyanBright("USER INFO: Execution Finished" + "\n"))
};

const sendExecutionMail = async (req, testCaseId, result) => {
  if (!req.body.history) return;
  const project = await getProjectById(req)
  const testCase = await getTestCaseDetailsById(req, testCaseId)
  let executedBy = project.members.find(el => { return el.id === req.user.id })?.name
  let email = project.members.map(el => { return el.email.toLowerCase() })

  sendMail({ executedBy, email, projectName: project.name, testCaseName: testCase.name, status: result ? "PASSED" : "FAILED" }, "failedExecution")
}
module.exports = {
  createExecutionHistory,
  createProcessHistory,
  createStepHistory,
  updateStepResult,
  updateProcessResult,
  updateExecutionResult,
  sendExecutionMail
};
