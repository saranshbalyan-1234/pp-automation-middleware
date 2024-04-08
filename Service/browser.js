const { handleActionEventError } = require("./utils");
const {
  updateStepResult,
} = require("../Controllers/executionHistoryController");

const refreshPage = async (args) => {
  const { driver, req, stepHistoryId } = args;
  try {
    await driver.navigate().refresh();
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
   return await handleActionEventError({...args,err});
  }
};
const backPage = async (args) => {
  const { driver, req, stepHistoryId } = args;
  try {
    await driver.navigate().back();
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
   return await handleActionEventError({...args,err});
  }
};

const forwardPage = async (args) => {
  const { driver, req, stepHistoryId } = args;
  try {
    await driver.navigate().forward();
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
   return await handleActionEventError({...args,err});
  }
};

const newTab = async (args) => {
  const { driver, req, stepHistoryId }=args
  try {
    await driver.switchTo().newWindow("tab");
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
   return await handleActionEventError({...args,err});
  }
};
const newWindow = async (args) => {
  const { driver, req, stepHistoryId } = args;
  try {
    await driver.switchTo().newWindow("window");
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
   return await handleActionEventError({...args,err});
  }
};

const closeBrowser = async (args) => {
  const { driver, req, stepHistoryId } = args;
  try {
    await driver.quit();
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
   return await handleActionEventError({...args,err});
  }
};

const maximizeBrowser = async (args) => {
  const { driver, req, stepHistoryId } = args;
  try {
    await driver.manage().window().maximize();
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
   return await handleActionEventError({...args,err});
  }
};

const switchToDefaultTab = async (args) => {
  const { driver, req, stepHistoryId } = args;
  try {
    const tabs = await driver.getAllWindowHandles();
    await driver.switchTo().window(tabs[0]);

    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
   return await handleActionEventError({...args,err});
  }
};

const switchToTab = async (args) => {
  const { step, driver } = args;
  try {
    const number = parseInt(step.testParameters.TabNumber) - 1;
    const tabs = await driver.getAllWindowHandles();

    if (number > tabs.length) {
      throw new Error("Invalid TabNumber");
    } else await driver.switchTo().window(tabs[number]);
  } catch (err) {
   return await handleActionEventError({...args,err});
  }
};

module.exports = {
  refreshPage,
  backPage,
  forwardPage,
  newTab,
  newWindow,
  closeBrowser,
  maximizeBrowser,
  switchToTab,
  switchToDefaultTab,
};
