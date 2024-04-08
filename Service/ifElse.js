const {
  updateStepResult,
} = require("../Controllers/executionHistoryController");
const chromeDriver = require("selenium-webdriver");
const { findByLocator, handleActionEventError } = require("./utils");
const parseRegex = require("regex-parser")
const { until } = chromeDriver;
const If = async (args) => {
  const { step, req, stepHistoryId, stepExtra } = args;
  stepExtra.conditional = true;
  stepExtra.conditionalType = "if";
  try {
    const value1 = String(step.testParameters.Value1)
    const value2 = String(step.testParameters.Value2)
    const condition = step.testParameters.Condition;
    const type = step.testParameters.IfType

    if (type == "Boolean") {
      let tempValue1 = false;
      let tempValue2 = false;
      if (value1 == "true") tempValue1 = true;
      if (value2 == "true") tempValue2 = true;
      if (condition == "==") {
        if (tempValue1 == tempValue2) {
          stepExtra.conditionalResult = true;
          return await updateStepResult(req, stepHistoryId, true);
        } else {
          await updateStepResult(req, stepHistoryId, false);
          stepExtra.conditionalResult = false;
        }
      } else if (condition == "!=") {
        if (tempValue1 != tempValue2) {
          stepExtra.conditionalResult = true;
          return await updateStepResult(req, stepHistoryId, true);
        } else {
          await updateStepResult(req, stepHistoryId, false);
          stepExtra.conditionalResult = false;
        }
      }
    }
    if (type == "String") {
      if (condition == "==") {
        if (value1 == value2) {
          stepExtra.conditionalResult = true;
          return await updateStepResult(req, stepHistoryId, true);
        } else {
          await updateStepResult(req, stepHistoryId, false);
          stepExtra.conditionalResult = false;
        }
      } else if (condition == "!=") {
        if (value1 != value2) {
          stepExtra.conditionalResult = true;
          return await updateStepResult(req, stepHistoryId, true);
        } else {
          await updateStepResult(req, stepHistoryId, false);
          stepExtra.conditionalResult = false;
        }
      }
    }
    if (type == "Number") {
      if (condition == "==") {
        if (Number(value1) == Number(value2)) {
          stepExtra.conditionalResult = true;
          return await updateStepResult(req, stepHistoryId, true);
        } else {
          await updateStepResult(req, stepHistoryId, false);
          stepExtra.conditionalResult = false;
        }
      } else if (condition == "!=") {
        if (Number(value1) != Number(value2)) {
          stepExtra.conditionalResult = true;
          return await updateStepResult(req, stepHistoryId, true);
        } else {
          await updateStepResult(req, stepHistoryId, false);
          stepExtra.conditionalResult = false;
        }
      } else if (condition == ">=") {
        if (Number(value1) >= Number(value2)) {
          stepExtra.conditionalResult = true;
          return await updateStepResult(req, stepHistoryId, true);
        } else {
          await updateStepResult(req, stepHistoryId, false);
          stepExtra.conditionalResult = false;
        }
      } else if (condition == "<=") {
        if (Number(value1) <= Number(value2.length)) {
          stepExtra.conditionalResult = true;
          return await updateStepResult(req, stepHistoryId, true);
        } else {
          await updateStepResult(req, stepHistoryId, false);
          stepExtra.conditionalResult = false;
        }
      } else if (condition == ">") {
        if (Number(value1) > Number(value2)) {
          stepExtra.conditionalResult = true;
          return await updateStepResult(req, stepHistoryId, true);
        } else {
          await updateStepResult(req, stepHistoryId, false);
          stepExtra.conditionalResult = false;
        }
      } else if (condition == "<") {
        if (Number(value1) < Number(value2)) {
          stepExtra.conditionalResult = true;
          return await updateStepResult(req, stepHistoryId, true);
        } else {
          await updateStepResult(req, stepHistoryId, false);
          stepExtra.conditionalResult = false;
        }
      }
    }

    if (condition == "Matches") {
      const regex = new RegExp(parseRegex(value2))
      if (regex.test(value1)) {
        stepExtra.conditionalResult = true;
        return await updateStepResult(req, stepHistoryId, true);
      } else {
        await updateStepResult(req, stepHistoryId, false);
        stepExtra.conditionalResult = false;
      }
    } else if (condition == "Not Matches") {
      const regex = new RegExp(parseRegex(value2))
      if (!regex.test(value1)) {
        stepExtra.conditionalResult = true;
        return await updateStepResult(req, stepHistoryId, true);
      } else {
        await updateStepResult(req, stepHistoryId, false);
        stepExtra.conditionalResult = false;
      }
    } else if (condition == "Not Empty") {
      if (value1) {
        stepExtra.conditionalResult = true;
        return await updateStepResult(req, stepHistoryId, true);
      } else {
        await updateStepResult(req, stepHistoryId, false);
        stepExtra.conditionalResult = false;
      }
    } else if (condition == "Empty") {
      if (!value1) {
        stepExtra.conditionalResult = true;
        return await updateStepResult(req, stepHistoryId, true);
      } else {
        await updateStepResult(req, stepHistoryId, false);
        stepExtra.conditionalResult = false;
      }
    } else if (condition == "Includes") {
      if (value1.includes(value2)) {
        stepExtra.conditionalResult = true;
        return await updateStepResult(req, stepHistoryId, true);
      } else {
        await updateStepResult(req, stepHistoryId, false);
        stepExtra.conditionalResult = false;
      }
    } else if (condition == "Not Includes") {
      if (!value1.includes(value2)) {
        stepExtra.conditionalResult = true;
        return await updateStepResult(req, stepHistoryId, true);
      } else {
        await updateStepResult(req, stepHistoryId, false);
        stepExtra.conditionalResult = false;
      }
    }

  } catch (err) {
    stepExtra.conditionalResult = false;
    return await handleActionEventError({ ...args, err });
  }
};
const EndCondition = async (args) => {
  const { req, stepHistoryId, stepExtra } = args;
  try {
    stepExtra.conditional = false;
    stepExtra.conditionalResult = false;
    stepExtra.conditionalType = "";
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const Else = async (args) => {
  const { req, stepHistoryId, stepExtra } = args
  try {
    stepExtra.conditionalType = "else";
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};

const IfObjectVisible = async (args) => {
  const { step, driver, req, stepHistoryId, stepExtra } = args;
  stepExtra.conditional = true;
  stepExtra.conditionalType = "if";
  try {

    await driver.wait(
      until.elementLocated(
        await findByLocator(step.object.dataValues.locators)
      ),
      1
    );

    const element = await driver.findElement(
      await findByLocator(step.object.dataValues.locators)
    );
    await driver.wait(until.elementIsVisible(element), timeout);

    stepExtra.conditionalResult = true;
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    stepExtra.conditionalResult = false;

    let condition =
      String(err).includes("NoSuchElementError") ||
      String(err).includes("StaleElementReferenceError");

    return await handleActionEventError({
      err,
      req,
      stepHistoryId,
      processResult: { result: false },
      continueOnError: "CONTINUE"
    });

  }
};

const ifObjectEnabled = async (args) => {
  const { step, driver, req, stepHistoryId, stepExtra } = args;
  stepExtra.conditional = true;
  stepExtra.conditionalType = "if";

  try {
    const element = await driver.findElement(
      await findByLocator(step.object.dataValues.locators)
    );
    try {
      await driver.wait(until.elementIsEnabled(element), 1);
      stepExtra.conditionalResult = true;
      return await updateStepResult(req, stepHistoryId, true);
    } catch (error) {
      stepExtra.conditionalResult = false;
      return await updateStepResult(req, stepHistoryId, false, String(error));
    }
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};

const ifObjectSelected = async (args) => {
  const { step, driver, req, stepHistoryId, stepExtra } = args;
  stepExtra.conditional = true;
  stepExtra.conditionalType = "if";

  try {
    const element = await driver.findElement(
      await findByLocator(step.object.dataValues.locators)
    );
    try {
      await driver.wait(until.elementIsSelected(element), 1);
      stepExtra.conditionalResult = true;
      return await updateStepResult(req, stepHistoryId, true);
    } catch (error) {
      stepExtra.conditionalResult = false;
      return await updateStepResult(req, stepHistoryId, false, String(error));
    }
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};

module.exports = {
  If,
  Else,
  EndCondition,
  IfObjectVisible,
  ifObjectEnabled,
  ifObjectSelected,
};
