const { findByLocator, handleActionEventError } = require("./utils");
const { updateStepResult } = require("../Controllers/executionHistoryController");
const { waitUntilObjectClickable } = require("./wait");
const moment = require("moment");

const enterDateTime = async (args) => {
  const { step, driver, req, stepHistoryId, executionHistory } = args;
  try {
    const canExecute = await waitUntilObjectClickable(args)
    if (!canExecute) {
      if (executionHistory.continueOnError) return "CONTINUE";
      else return "STOP";
    }

    const format = step.testParameters.Format;
    const tempDateTime = step.testParameters.DateTime;
    const momentDateTime =
      typeof tempDateTime == "string" ? moment(tempDateTime) : tempDateTime;
    const dateTime = momentDateTime.format(format);
    await driver
      .findElement(await findByLocator(step.object.dataValues.locators))
      .sendKeys(dateTime);
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
   return await handleActionEventError({...args,err});
  }
};

const getCurrentDateTime = async (args) => {
  const { step, output, req, stepHistoryId } = args;
  try {
    const dateTime = moment(new Date());
    output[step.testParameters.Output] = dateTime;
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
   return await handleActionEventError({...args,err});
  }
};

const getDateTime = async (args) => {
  const { step, req, stepHistoryId, output } = args;
  try {
    const dateTime = step.testParameters.DateTime;

    const finalDateTime = moment(dateTime);
    output[step.testParameters.Output] = finalDateTime;
    if (finalDateTime == "Invalid date") throw new Error("Invalid Date");

    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
   return await handleActionEventError({...args,err});
  }
};

const addDateTime = async (args) => {
  const { step, req, stepHistoryId, output } = args;
  try {
    const dateTime = step.testParameters.DateTime;
    const dayMonthYear = step.testParameters["Day Month Year"].split(" ");

    const day = parseInt(dayMonthYear[0]);
    const month = parseInt(dayMonthYear[1]);
    const year = parseInt(dayMonthYear[2]);

    const hourMinSec = step.testParameters["Hour Min Sec"].split(" ");
    const hour = parseInt(hourMinSec[0]);
    const min = parseInt(hourMinSec[1]);
    const sec = parseInt(hourMinSec[2]);

    let finalDateTime =
      typeof dateTime == "string" ? moment(dateTime) : dateTime;

    if (day) finalDateTime = finalDateTime.add(day, "days");
    if (month) finalDateTime = finalDateTime.add(month, "months");
    if (year) finalDateTime = finalDateTime.add(year, "years");

    if (hour) finalDateTime = finalDateTime.add(hour, "hours");
    if (min) finalDateTime = finalDateTime.add(min, "minutes");
    if (sec) finalDateTime = finalDateTime.add(sec, "seconds");

    output[step.testParameters.Output] = finalDateTime;
    if (finalDateTime == "Invalid date") throw new Error("Invalid Date");
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
   return await handleActionEventError({...args,err});
  }
};

const subtractDateTime = async (args) => {
  const { step, req, stepHistoryId, output}=args
  try {
    const dateTime = step.testParameters.DateTime;
    const dayMonthYear = step.testParameters["Day Month Year"].split(" ");

    const day = parseInt(dayMonthYear[0]);
    const month = parseInt(dayMonthYear[1]);
    const year = parseInt(dayMonthYear[2]);

    const hourMinSec = step.testParameters["Hour Min Sec"].split(" ");
    const hour = parseInt(hourMinSec[0]);
    const min = parseInt(hourMinSec[1]);
    const sec = parseInt(hourMinSec[2]);

    let finalDateTime =
      typeof dateTime == "string" ? moment(dateTime) : dateTime;

    if (day) finalDateTime = finalDateTime.subtract(day, "days");
    if (month) finalDateTime = finalDateTime.subtract(month, "months");
    if (year) finalDateTime = finalDateTime.subtract(year, "years");

    if (hour) finalDateTime = finalDateTime.subtract(hour, "hours");
    if (min) finalDateTime = finalDateTime.subtract(min, "minutes");
    if (sec) finalDateTime = finalDateTime.subtract(sec, "seconds");


    output[step.testParameters.Output] = finalDateTime;
    if (finalDateTime == "Invalid date") throw new Error("Invalid Date");
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
   return await handleActionEventError({...args,err});
  }
};

module.exports = {
  enterDateTime,
  getCurrentDateTime,
  getDateTime,
  addDateTime,
  subtractDateTime,
};
