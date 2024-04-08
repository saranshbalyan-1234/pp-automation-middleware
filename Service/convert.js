const {
  updateStepResult,
} = require("../Controllers/executionHistoryController");
const { handleActionEventError } = require("./utils");

const masterConvert = async (args) => {
  const { step } = args;
  try {
    const type = String(step.testParameters.ConvertType)

    switch (type) {

      case "String":
        return await convertToString(args);

      case "Date Time":
        return await convertToDateTime(args);

      case "HEX":
        return await convertToHex(args);

      case "JSON":
        return await convertToJSON(args);

      case "Boolean":
        return await convertToBoolean(args)

      case "Number":
        return await convertToNumber(args);
      case "Integer":
        return await convertToInteger(args);
      case "Float":
        return await convertToFloat(args);
      default:
        return;
    }
  }
  catch (err) {
    return await handleActionEventError({ ...args, err });
  }
}

const convertToString = async (args) => {
  const { step, req, stepHistoryId, output } = args;
  try {
    const value = String(step.testParameters.Value);
    output[step.testParameters.Output] = value;
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const convertToNumber = async (args) => {
  const { step, req, stepHistoryId, output } = args;
  try {
    const value = Number(step.testParameters.Value);
    output[step.testParameters.Output] = value;
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const convertToDateTime = async (args) => {
  const { step, req, stepHistoryId, output } = args
  try {
    const value = new Date(step.testParameters.Value);
    output[step.testParameters.Output] = value;
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const convertToInteger = async (args) => {
  const { step, req, stepHistoryId, output } = args;
  try {
    const value = parseInt(step.testParameters.Value);
    output[step.testParameters.Output] = value;
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const convertToFloat = async (args) => {
  const { step, req, stepHistoryId, output } = args;
  try {
    const value = parseFloat(step.testParameters.Value);
    output[step.testParameters.Output] = value;
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const convertToHex = async (args) => {
  const { step, req, stepHistoryId, output } = args;
  try {
    const value = step.testParameters.Value.toString(16);
    output[step.testParameters.Output] = value;
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const convertToJSON = async (args) => {
  const { step, req, stepHistoryId, output } = args;
  try {
    const value = step.testParameters.Value
    const json = typeof value == "object" ? value : JSON.parse(value)
    output[step.testParameters.Output] = json
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const convertToBoolean = async (args) => {
  const { step, req, stepHistoryId, output } = args;
  try {
    const value = Boolean(step.testParameters.Value);
    output[step.testParameters.Output] = value;
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
}

module.exports = {
  masterConvert
};
