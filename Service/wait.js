const chromeDriver = require("selenium-webdriver");
const { until } = chromeDriver;
const { updateStepResult } = require("../Controllers/executionHistoryController");

const { findByLocator, handleActionEventError } = require("./utils");

const masterWait = async (args) => {
  const { step } = args;
  try {
    const type = String(step.testParameters.WaitType)
    switch (type) {

      case "Object Located":
        return waitUntilObjectLocated(args);

      case "Objects Located":
        return await waitUntilObjectsLocated(args);

      case "Object Clickable":
        return await waitUntilObjectClickable({ ...args, updateStep: true });

      case "Object Not Clickable":
        return await waitUntilObjectNotClickable(args);

      case "Object Enabled":
        return await waitUntilObjectEnabled(args);

      case "Object Disabled":
        return await waitUntilObjectDisabled(args);

      case "Object Selected":
        return await waitUntilObjectSelected(args);

      case "Object Not Selected":
        return await waitUntilObjectNotSelected(args);

      case "Object Visible":
        return await waitUntilObjectVisible(args);

      case "Object Not Visible":
        return await waitUntilObjectNotVisible(args);

      case "Object Staleness Of":
        return await waitUntilObjectStalenessOf(args);

      case "Able To Switch Frame":
        return await waitUntilAbleToSwitchToFrame(args);

      case "Alert Present":
        return await waitUntilAlertPresent(args);

      default:
        throw new Error("Invalid Wait Argument")

    }
  }
  catch (err) {
    return await handleActionEventError({ ...args, err });
  }
}


const waitUntilAlertPresent = async (args) => {
  const { step, driver, req, stepHistoryId } = args;
  const temp = Number(step.testParameters.Timeout);
  const timeout = temp > 1000 ? temp : 1000;

  for (var i = 0; i < timeout; i = i + 1000) {
    try {
      await driver.wait(async () => {
        return await driver.switchTo().alert();
      });
      return await updateStepResult(req, stepHistoryId, true);
    } catch (err) {
      return await handleActionEventError({ ...args, err });
    }
  }
};

const implicitWait = async (args) => {
  const { step, driver, req, stepHistoryId } = args;
  try {
    const time = Number(step.testParameters.Time);
    await driver.sleep(time);
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const waitUntilObjectLocated = async (args) => {
  const { step, driver, req, stepHistoryId } = args;
  const timeout = Number(step.testParameters.Timeout);
  try {
    //locator
    await driver.wait(
      until.elementLocated(
        await findByLocator(step.object.dataValues.locators)
      ),
      timeout
    );
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const waitUntilObjectsLocated = async (args) => {
  const { step, driver, req, stepHistoryId } = args;
  const timeout = Number(step.testParameters.Timeout);
  try {
    //locator
    await driver.wait(
      until.elementsLocated(
        await findByLocator(step.object.dataValues.locators)
      ),
      timeout
    );

    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const waitUntilObjectEnabled = async (args) => {
  const { step, driver, req, stepHistoryId } = args;
  const timeout = Number(step.testParameters.Timeout);
  try {
    const element = await driver.findElement(
      await findByLocator(step.object.dataValues.locators)
    );
    await driver.wait(until.elementIsEnabled(element), timeout);

    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const waitUntilObjectDisabled = async (args) => {
  const { step, driver, req, stepHistoryId } = args;
  const timeout = Number(step.testParameters.Timeout);
  try {
    const element = await driver.findElement(
      await findByLocator(step.object.dataValues.locators)
    );
    await driver.wait(until.elementIsDisabled(element), timeout);

    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};

const waitUntilObjectNotSelected = async (args) => {
  const { step, driver, req, stepHistoryId } = args;
  const timeout = Number(step.testParameters.Timeout);
  try {
    const element = await driver.findElement(
      await findByLocator(step.object.dataValues.locators)
    );
    await driver.wait(until.elementIsNotSelected(element), timeout);

    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};

const waitUntilObjectSelected = async (args) => {
  const { step, driver, req, stepHistoryId } = args;
  const timeout = Number(step.testParameters.Timeout);
  try {
    const element = await driver.findElement(
      await findByLocator(step.object.dataValues.locators)
    );
    await driver.wait(until.elementIsSelected(element), timeout);

    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};

const waitUntilObjectNotVisible = async (args) => {
  const { step, driver, req, stepHistoryId } = args;
  const timeout = Number(step.testParameters.Timeout);
  try {
    const element = await driver.findElement(
      await findByLocator(step.object.dataValues.locators)
    );
    await driver.wait(until.elementIsNotVisible(element), timeout);

    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};

const waitUntilObjectVisible = async (args) => {
  const { step, driver, req, stepHistoryId } = args;
  const timeout = Number(step.testParameters.Timeout);
  try {
    const element = await driver.findElement(
      await findByLocator(step.object.dataValues.locators)
    );

    await driver.wait(until.elementIsVisible(element), timeout);

    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const waitUntilObjectStalenessOf = async (args) => {
  const { step, driver, processResult, req, stepHistoryId, executionHistory } = args;
  const timeout = Number(step.testParameters.Timeout);
  try {
    const element = await driver.findElement(
      await findByLocator(step.object.dataValues.locators)
    );
    await driver.wait(until.stalenessOf(element), timeout);
    await driver.sleep(10)
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {

    //need to look into this for more information;
    let condition = String(err).includes("TimeoutError")
    // String(err).includes("NoSuchElementError") ||
    // String(err).includes("StaleElementReferenceError") ||

    return await handleActionEventError({
      err,
      req,
      stepHistoryId,
      processResult: condition ? processResult : { result: false },
      continueOnError: condition ? executionHistory.continueOnError : "CONTINUE"
    });
  }
};
const waitUntilAbleToSwitchToFrame = async (args) => {
  const { step, driver, req, stepHistoryId } = args;
  const timeout = Number(step.testParameters.Timeout);
  try {
    const element = await driver.findElement(
      await findByLocator(step.object.dataValues.locators)
    );
    await driver.wait(until.ableToSwitchToFrame(element), timeout);

    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};

const waitUntilObjectClickable = async (args) => {
  const { step, driver, req, stepHistoryId, updateStep } = args;

  const timeout = Number(step.testParameters.Timeout);
  if (!timeout) return true
  try {
    await driver.wait(
      until.elementLocated(
        await findByLocator(step.object.dataValues.locators)
      ),
      timeout
    );

    const element = await driver.findElement(
      await findByLocator(step.object.dataValues.locators)
    );

    await driver.wait(until.elementIsVisible(element), timeout);
    await driver.wait(until.elementIsEnabled(element), timeout);

    if (updateStep == true) await updateStepResult(req, stepHistoryId, true);
    return true;
  } catch (err) {
    await handleActionEventError({ ...args, err });
    return false;
  }
};

const waitUntilObjectNotClickable = async (args) => {
  const { step, driver, req, stepHistoryId } = args;
  const timeout = Number(step.testParameters.Timeout);
  try {
    const element = await driver.findElement(
      await findByLocator(step.object.dataValues.locators)
    );

    try {
      await driver.wait(until.elementIsNotVisible(element), timeout);
    } catch (err) {
      await driver.wait(until.elementIsDisabled(element), timeout);
    }

    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};

const waitForNetworkCalls = async (args) => {
  const { step, driver, req, stepHistoryId, internalVar } = args;
  const timeout = Number(step.testParameters.Timeout);
  const count = Number(step.testParameters.Count);
  let prevNetworkCalls = internalVar.prevNetworkCalls
  try {
    await driver.wait(async () => {
      let currentNetworkCalls = await driver.executeScript("var performance = window.performance || window.mozPerformance || window.msPerformance || window.webkitPerformance || {}; var network = performance.getEntries() || {}; return network;")
      if (currentNetworkCalls.length >= prevNetworkCalls + count) {
        console.log(currentNetworkCalls.length, prevNetworkCalls)
        return true
      }
    }, timeout);
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};


module.exports = {
  masterWait,
  implicitWait,
  waitUntilObjectClickable,
  waitForNetworkCalls
};
