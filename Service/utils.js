const chromeDriver = require("selenium-webdriver");
const { By } = chromeDriver;
const { uploadFile } = require("../Controllers/awsController");
const {
  updateStepResult,
} = require("../Controllers/executionHistoryController");
const chalk = require("chalk");
const findByLocator = async (locators) => {
  // XPATH
  // ClassName
  // CSS
  // Id
  // JS
  // LinkText
  // Name
  // PartialLinkText
  // TagName

  for (const el of locators) {
    try {
      const type = el.dataValues.type;
      const locator = el.dataValues.locator;
      if (type == "XPATH") {
        return By.xpath(locator);
      } else if (type == "ClassName") {
        return By.className(locator);
      } else if (type == "CSS") {
        return By.css(locator);
      } else if (type == "LinkText") {
        return By.linkText(locator);
      } else if (type == "PartialLinkText") {
        return By.partialLinkText(locator);
      } else if (type == "name") {
        return By.name(locator);
      } else if (type == "Id") {
        return By.id(locator);
      } else if (type == "TagName") {
        return By.tagName(locator);
      } else if (type == "JS") {
        return By.js(locator);
      }
    } catch (err) {
      console.log(err);
    }
  }
};
const takeScreenshot = async (driver, req, step, executionHistoryId, process) => {
  try {
    console.log("Taking screenshot");
    if (!req.body.history) return;
    await driver.takeScreenshot().then(async (data, err) => {
      if (err) {
        console.log(chalk.redBright("SYSTEM ERROR: Screenshot"))
        return console.log(err);
      }

      var buf = Buffer.from(
        data.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );

      const fileName = `${executionHistoryId}/${process.id}_${step.id}`;
      uploadFile(buf, req.database.split("_")[1].toLowerCase(), fileName);
    });
  } catch (error) {
    console.log(chalk.redBright("SYSTEM ERROR: Screenshot"))
    console.log(error);
  }
};

const handleActionEventError = async (args) => {
  const { err, req, stepHistoryId, processResult, continueOnError } = args;

  console.log(chalk.redBright("SYSTEM ERROR: Action Event"))
  console.log(err);
  try {
    if (req.body.history) {
      if (processResult.result) {
        processResult.result = false;
        await updateStepResult(req, stepHistoryId, false, String(err));
      }
    }

    if (continueOnError) return "CONTINUE";
    else return "STOP";
  } catch (error) {
    console.log(chalk.redBright("SYSTEM ERROR: Action Event"))
    console.log(error)
  }
};

const handleLog = async (args) => {
  const { step, driver, req } = args;
  const wait = req.body.wait

  if (wait > 0) {
    await driver.sleep(wait);
  }
  try {
    let log = {
      step: step.step,
      process: { step: step.process.step, name: step.process.name },
      actionEvent: step.actionEvent,
      screenshot: step.screenshot,
    }
    if (Object.keys(step.testParameters).length > 0) log.testParameters = step.testParameters
    if (step.object) {
      let temp = { ...step.object.dataValues }
      log.object = {
        name: temp.name, locators: JSON.stringify(temp.locators.map(el => {
          return {
            type: el.dataValues.type,
            locator: el.dataValues.locator,
          }
        }))
      }
    }
    if (step.process.reusableProcess) {
      log.process.reusableProcess = step.process.reusableProcess.dataValues.name
    }
    return console.log(log, "\n")
  } catch (error) {
    console.log(chalk.redBright("SYSTEM ERROR: Logger"))
    return console.log(error)
  }
}

module.exports = { findByLocator, takeScreenshot, handleActionEventError, handleLog };
