const chromeDriver = require("selenium-webdriver");
const { findByLocator, handleActionEventError } = require("./utils");
const { By } = chromeDriver;
const {
  updateStepResult,
} = require("../Controllers/executionHistoryController");
const { waitUntilObjectClickable } = require("./wait");
const _ = require("lodash");

const click = async (args) => {
  const { step, driver, req, stepHistoryId, executionHistory } = args;
  try {
    const canExecute = await waitUntilObjectClickable(args);
    if (!canExecute) {
      if (executionHistory.continueOnError) return "CONTINUE";
      else return "STOP";
    }

    await driver
      .findElement(await findByLocator(step.object.dataValues.locators))
      .click();

    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const doubleClick = async (args) => {
  const { step, driver, req, stepHistoryId, executionHistory } = args;
  try {
    const canExecute = await waitUntilObjectClickable(args);
    if (!canExecute) {
      if (executionHistory.continueOnError) return "CONTINUE";
      else return "STOP";
    }

    await driver
      .actions()
      .doubleClick(
        await driver.findElement(
          await findByLocator(step.object.dataValues.locators)
        )
      )
      .perform();
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const rightClick = async (args) => {
  const { step, driver, req, stepHistoryId, executionHistory } = args;
  try {
    const canExecute = await waitUntilObjectClickable(args);
    if (!canExecute) {
      if (executionHistory.continueOnError) return "CONTINUE";
      else return "STOP";
    }
    await driver
      .actions()
      .contextClick(
        await driver.findElement(
          await findByLocator(step.object.dataValues.locators)
        )
      )
      .perform();
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const clickByJs = async (args) => {
  const { step, driver, req, stepHistoryId, executionHistory } = args;
  try {

    const canExecute = await waitUntilObjectClickable(args);
    if (!canExecute) {
      if (executionHistory.continueOnError) return "CONTINUE";
      else return "STOP";
    }

    const element = await driver.findElement(
      await findByLocator(step.object.dataValues.locators)
    );

    await driver.executeScript("arguments[0].click();", element);
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const clickLinkByText = async (args) => {
  const { step, driver, req, stepHistoryId, executionHistory } = args;
  try {
    const canExecute = await waitUntilObjectClickable(args);
    if (!canExecute) {
      if (executionHistory.continueOnError) return "CONTINUE";
      else return "STOP";
    }

    await driver.findElement(By.linkText(step.testParameters.Text)).click();
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const clickLinkByPartialText = async (args) => {
  const { step, driver, req, stepHistoryId, executionHistory } = args;
  try {
    const canExecute = await waitUntilObjectClickable(args);
    if (!canExecute) {
      if (executionHistory.continueOnError) return "CONTINUE";
      else return "STOP";
    }

    await driver
      .findElement(By.partialLinkText(step.testParameters.Text))
      .click();
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const clickElementByXpath = async (args) => {
  const { step, driver, req, stepHistoryId, executionHistory } = args;
  try {
    const xpath = step.testParameters.XPATH;
    const locator = [
      {
        dataValues: {
          type: "XPATH",
          locator: xpath,
        },
      },
    ];
    const tempStep = _.cloneDeep(step);

    tempStep.object = {
      dataValues: {
        locators: locator,
      },
    };

    const canExecute = await waitUntilObjectClickable({ ...args, step: tempStep });
    if (!canExecute) {
      if (executionHistory.continueOnError) return "CONTINUE";
      else return "STOP";
    }

    await driver.findElement(await findByLocator(locator)).click();
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};

module.exports = {
  click,
  doubleClick,
  rightClick,
  clickByJs,
  clickLinkByText,
  clickLinkByPartialText,
  clickElementByXpath,
};
