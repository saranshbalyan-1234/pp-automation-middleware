const moment = require("moment");
const { takeScreenshot } = require("../Service/utils");
const { createFolder } = require("./awsController");
const {
  createProcessHistory,
  createStepHistory,
  updateProcessResult,
  updateStepResult,
  updateExecutionResult,
  createExecutionHistory,
  sendExecutionMail,
} = require("./executionHistoryController");

const { getAllEnvironmentsByTestCase } = require("./environment");
const { createDriver } = require("../Utils/driver");
const { getTestStepByTestCase } = require("./testCaseController");
const { handleStep } = require("../Service");

const chalk = require("chalk");

const _ = require("lodash")
const execute = async (req, res) => {
  try {
    let testCases = req.body.testCases;

    if (!testCases?.length) {
      return res.status(400).json({ error: "Invalid Test Case" });
    }
    res.status(200).json({ message: "Starting Execution" });
    console.log(chalk.cyanBright("USER INFO: Execution Started" + "\n"))

    multipleExecution(req, res);
  } catch (err) {
    console.log(err);
  }
};

const multipleExecution = async (req, res) => {
  try {
    let testCases = req.body.testCases;
    for (let k = 0; k < testCases.length; k++) {
      let testCaseId = testCases[k].id;
      let envId = testCases[k].environment;
      if (!isNaN(testCaseId)) {
        req.params.testCaseId = testCaseId;
        req.body.environment = envId;
        let steps = await getTestStepByTestCase(req, res);
        let environment = await getAllEnvironmentsByTestCase(req, res);
        for (let i = 0; i < req.body.bots; i++) {
          let driver = await createDriver(req, res);
          if (driver) {
            if (req.body.async)
              await startExecution(req, res, steps, driver, environment, testCaseId);
            else startExecution(req, res, steps, driver, environment, testCaseId);
          }
        }
      }
    }
  } catch (err) {
    console.log(err);
  }
};

const startExecution = async (req, res, steps, driver, environment, testCaseId) => {
  try {
    let totalSteps = 0
    for (let i = 0; i < steps.length; i++) {
      let process = steps[i];
      totalSteps += process.testSteps.length
    }
    req.body.totalSteps = totalSteps
    const executionHistory = await createExecutionHistory(req, res);

    let internalVar = { canCreateS3Folder: true, prevNetworkCalls: 0 }

    let output = {};
    let executionResult = { result: true };
    for (let i = 0; i < steps.length; i++) {
      let process = steps[i];

      if (process.enable == true) {
        let processResult = { result: true };
        let stepExtra = {
          conditional: false,
          conditionalType: "",
          conditionalResult: false,
          forLoopInitialValue: null,
          break: false,
          skip: false,
          initial: null,
          final: null,
          counter: null,
          current: null,
        };
        const processHistory = await createProcessHistory(
          req,
          process,
          executionHistory
        );
        for (let j = 0; j < process.testSteps.length; j++) {
          let step = process.testSteps[j];


          if (step.enable == true) {
            let tempParameter = {};

            step.testParameters.forEach((parameter) => {
              if (parameter.method == "Static") {
                tempParameter[parameter.type] = parameter.property;
              } else if (parameter.method == "Dynamic") {
                tempParameter[parameter.type] = _.get(output, parameter.property)
              } else if (parameter.method == "Environment") {
                tempParameter[parameter.type] = environment[parameter.property];
              }
            });

            let tempStep = { ...step.dataValues, testParameters: tempParameter, process };

            // construct object locator if direct xpath
            if (tempStep.xpath) {
              const xpath = tempStep.testParameters.XPATH;
              const locator = [
                {
                  dataValues: {
                    type: "XPATH",
                    locator: xpath,
                  },
                },
              ];
              tempStep.object = {
                dataValues: {
                  locators: locator,
                },
              };
            }
            let stepHistory = { dataValues: {} };
            if (tempStep.actionEvent !== "End For Loop") {
              stepHistory = await createStepHistory(
                req,
                tempStep,
                executionHistory,
                processHistory
              );
            } else if (
              stepExtra.final === stepExtra.current &&
              tempStep.actionEvent == "End For Loop"
            ) {
              console.log("For Loop Finished");
              stepHistory = await createStepHistory(
                req,
                tempStep,
                executionHistory,
                processHistory
              );
            }

            let ifElseConditionCheck =
              stepExtra.conditional == false ||
              tempStep.actionEvent == "End Condition" ||
              tempStep.actionEvent == "Else" ||
              (stepExtra.conditional == true &&
                stepExtra.conditionalType == "if" &&
                stepExtra.conditionalResult == true) ||
              (stepExtra.conditional == true &&
                stepExtra.conditionalType == "else" &&
                stepExtra.conditionalResult == false) ||
              (stepExtra.conditional == true &&
                stepExtra.conditionalType == "Else If" &&
                stepExtra.conditionalResult == false);

            if (tempStep.actionEvent == "For Loop") {
              console.log("For Loop Started");
              stepExtra.initial = Number(tempStep.testParameters.Initial);
              stepExtra.current = Number(tempStep.testParameters.Initial);
              stepExtra.final = Number(tempStep.testParameters.Final);
              stepExtra.counter = Number(tempStep.testParameters.Counter);
              stepExtra.forLoopInitialValue = j;
              await updateStepResult(
                req,
                stepHistory?.dataValues?.id,
                true,
                null,
                tempStep
              );
            }
            if (tempStep.actionEvent == "End For Loop") {
              stepExtra.current = stepExtra.current + stepExtra.counter;
              if (stepExtra.break == false || stepExtra.skip) {
                if (stepExtra.final >= stepExtra.current) {
                  j = stepExtra.forLoopInitialValue;
                }
                if (stepExtra.skip) {
                  stepExtra.skip = false;
                }
              } else {
                stepExtra.break = false;
              }
              await updateStepResult(
                req,
                stepHistory?.dataValues?.id,
                true,
                null,
                tempStep
              );
            }
            if (tempStep.actionEvent == "Break For Loop") {
              console.log("For Loop Break");
              stepExtra.break = true;
              await updateStepResult(
                req,
                stepHistory?.dataValues?.id,
                true,
                null,
                tempStep
              );
            }
            if (tempStep.actionEvent == "Skip For Loop Iteration") {
              console.log("Skipped For Loop Iteration");
              stepExtra.skip = true;
              await updateStepResult(
                req,
                stepHistory?.dataValues?.id,
                true,
                null,
                tempStep
              );
            }
            if (
              ifElseConditionCheck &&
              stepExtra.break == false &&
              stepExtra.skip == false
            ) {
              const continueOnError = await handleStep({
                step: tempStep,
                driver,
                output,
                req,
                stepHistoryId: stepHistory?.dataValues?.id,
                processResult,
                executionHistory,
                stepExtra,
                internalVar
              });

              if (j + 1 < process.testSteps.length) {
                let nextStep = process.testSteps[j + 1];

                if (nextStep.dataValues.actionEvent == "Wait For Network Calls") {
                  networkCalls = await driver.executeScript("var performance = window.performance || window.mozPerformance || window.msPerformance || window.webkitPerformance || {}; var network = performance.getEntries() || {}; return network;")
                  internalVar.prevNetworkCalls = networkCalls.length
                }
              }

              if (req.body.history) {
                if (tempStep.screenshot || executionHistory?.recordAllSteps) {
                  await createFolder(
                    req.database.split("_")[1].toLowerCase(),
                    executionHistory?.id
                  );
                  internalVar.canCreateS3Folder = false;
                  await takeScreenshot(driver, req, tempStep, executionHistory?.id, process);
                }
              }
              if (continueOnError === "STOP") {
                console.log(chalk.redBright("USER INFO: Execution Stopped" + "\n"))
                await updateProcessResult(req, processHistory?.dataValues?.id, false);
                return await updateExecutionResult(
                  req,
                  executionHistory?.id,
                  moment(),
                  false,
                  "INCOMPLETE",
                  driver
                );
              }
            } else {
              await updateStepResult(req, stepHistory?.dataValues?.id, null);
            }
          }
        }
        await updateProcessResult(
          req,
          processHistory?.dataValues?.id,
          processResult.result
        );
        if (!processResult.result) {
          executionResult.result = false;
        }
      }
    }
    sendExecutionMail(req, testCaseId, executionResult.result)
    return await updateExecutionResult(
      req,
      executionHistory?.id,
      moment(),
      executionResult.result,
      "COMPLETE",
      driver
    );
  } catch (err) {
    console.log(err)
  }
};
module.exports = { execute };
