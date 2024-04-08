const { handleActionEventError } = require("./utils");
const {
  updateStepResult,
} = require("../Controllers/executionHistoryController");

const acceptAlert = async (args) => {
  const { driver, req, stepHistoryId } = args;
  try {
    await driver.switchTo().alert().accept();
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const dismissAlert = async (args) => {
  const { driver, req, stepHistoryId } = args;
  try {
    await driver.switchTo().alert().dismiss();
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const getAlertMessage = async (args) => {
  const { step, driver, req, stepHistoryId, output } = args;
  try {
    const text = await driver.switchTo().alert().getText();
    output[step.testParameters.Output] = text;
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const enterTextInAlert = async (args) => {
  const { step, driver, req, stepHistoryId, output } = args;
  try {
    const text = output[step.testParameters.Text];
    await driver.switchTo().alert().sendKeys(text);

    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
//5 Action Keywords
module.exports = {
  acceptAlert,
  dismissAlert,
  enterTextInAlert,
  getAlertMessage,
};
