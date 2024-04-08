const { findByLocator, handleActionEventError } = require("./utils");
const {
  updateStepResult,
} = require("../Controllers/executionHistoryController");
const collectObjectText = async (args) => {
  const { step, driver, output, req, stepHistoryId } = args;
  try {
    const text = await driver
      .findElement(await findByLocator(step.object.dataValues.locators))
      .getText();
    output[step.testParameters.Output] = text;

    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
   return await handleActionEventError({...args,err});
  }
};
const collectObjectCSSProperty = async (args) => {
  const { step, driver, output, req, stepHistoryId } = args;
  try {
    const attribute = await driver
      .findElement(await findByLocator(step.object.dataValues.locators))
      .getCssValue(step.testParameters.Attribute);
    output[step.testParameters.Output] = attribute;

    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
   return await handleActionEventError({...args,err});
  }
};
const collectObjectProperty = async (args) => {
  const { step, driver, output, req, stepHistoryId }=args
  try {
    const attribute = await driver
      .findElement(await findByLocator(step.object.dataValues.locators))
      .getAttribute(step.testParameters.Attribute);
    output[step.testParameters.Output] = attribute;
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
   return await handleActionEventError({...args,err});
  }
};

const scrollToObject = async (args) => {
  const { step, driver, req, stepHistoryId } = args;
  try {
    const element = await driver.findElement(
      await findByLocator(step.object.dataValues.locators)
    );
    await driver.executeScript("arguments[0].scrollIntoView()", element);
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
   return await handleActionEventError({...args,err});
  }
};

module.exports = {
  collectObjectText,
  collectObjectCSSProperty,
  collectObjectProperty,
  scrollToObject,
};
