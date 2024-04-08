const chromeDriver = require("selenium-webdriver");
const { findByLocator, handleActionEventError, handleLog } = require("./utils");
const _ = require("lodash");
const { faker } = require('@faker-js/faker');
const {
  masterConvert,
} = require("./convert");
const {
  refreshPage,
  backPage,
  forwardPage,
  newTab,
  newWindow,
  closeBrowser,
  maximizeBrowser,
  switchToTab,
  switchToDefaultTab,
} = require("./browser");
const {
  enterDateTime,
  getCurrentDateTime,
  getDateTime,
  addDateTime,
  subtractDateTime,
} = require("./dateTime");
const {
  collectObjectText,
  collectObjectCSSProperty,
  collectObjectProperty,
  scrollToObject,
} = require("./object");
const {
  implicitWait,
  masterWait,
  waitUntilObjectClickable,
  waitForNetworkCalls
} = require("./wait");
const {
  acceptAlert,
  dismissAlert,
  enterTextInAlert,
  getAlertMessage,
} = require("./alert");
const {
  If,
  Else,
  EndCondition,
  IfObjectVisible,
  ifObjectEnabled,
  ifObjectSelected,
} = require("./ifElse");
const {
  click,
  clickByJs,
  clickLinkByPartialText,
  clickLinkByText,
  rightClick,
  doubleClick,
  clickElementByXpath,
} = require("./click");

const {
  updateStepResult,
} = require("../Controllers/executionHistoryController");

const chalk = require("chalk");
const { Key } = chromeDriver;

const handleStep = async (args) => {
  
  await handleLog(args)

  const { step } = args;
  switch (step.actionEvent) {

    case "Launch Website":
      return await launchWebsite(args);

    case "Click":
      return await click(args);

    case "Click Element By XPATH":
      return await clickElementByXpath(args);

    case "Double Click":
      return await doubleClick(args);

    case "Right Click":
      return await rightClick(args);

    case "Enter Text":
      return await enterText(args);

    case "Enter Text In Element By XPATH":
      return await enterTextInElementByXpath(args);

    case "Enter Date Time":
      return await enterDateTime(args);

    case "Clear Input":
      return await clearInput(args);

    case "Press Button":
      return await pressButton(args);

    case "Maximize Browser":
      return await await maximizeBrowser(args);

    case "Switch To Tab":
      return await switchToTab(args);

    case "Switch To Default Tab":
      return await switchToDefaultTab(args);

    case "Close Browser":
      return await closeBrowser(args);

    case "Wait Until":
      return await masterWait(args);

    case "Wait":
      return await implicitWait(args);

    case "Accept Alert":
      return await acceptAlert(args);

    case "Dismiss Alert":
      return await dismissAlert(args);

    case "Get Alert Message":
      return await getAlertMessage(args);

    case "Enter Text In Alert":
      return await enterTextInAlert(args);

    case "Refresh Page":
      return await refreshPage(args);

    case "Back Page":
      return await backPage(args);

    case "Forward Page":
      return await forwardPage(args);

    case "New Tab":
      return await newTab(args);

    case "New Window":
      return await newWindow(args);

    case "Generate Random Number":
      return await generateRandomNumber(args);

    case "Generate Random String":
      return await generateRandomString(args);

    case "Generate Random Details":
      return await generateRandomDetails(args);

    case "Get Page Title":
      return await getPageTitle(args);

    case "Get Page URL":
      return await getPageUrl(args);

    case "Console Log":
      return await printLog(args); //need fix

    case "Scroll To Object":
      return await scrollToObject(args);

    case "Scroll To End":
      return await scrollToEnd(args);

    case "Scroll To Top":
      return await scrollToTop(args);

    case "Click By Javascript":
      return await clickByJs(args);

    case "Click Link By Text":
      return await clickLinkByText(args);

    case "Click Link By Partial Text":
      return await clickLinkByPartialText(args);

    case "Hover Mouse":
      return await hoverMouse(args);

    case "Copy Text":
      return await copyText(args);

    case "Copy Substring":
      return await copySubstring(args);

    case "Combine String":
      return await combineString(args);

    case "Get Current Date Time":
      return await getCurrentDateTime(args);

    case "If":
      return await If(args);

    case "Else If":
      return await If(args);

    case "If Object Enabled":
      return await ifObjectEnabled(args);

    case "If Object Selected":
      return await ifObjectSelected(args);

    case "Else":
      return await Else(args);

    case "End Condition":
      return await EndCondition(args);

    case "Collect Object Text":
      return await collectObjectText(args);

    case "Collect Object CSS Property":
      return await collectObjectCSSProperty(args);

    case "Collect Object Property":
      return await collectObjectProperty(args);

    case "Convert To":
      return await masterConvert(args);

    case "Select Option By Value":
      return await selectOptionByValue(args);

    case "Select Option By Position":
      return await selectOptionByPosition(args);

    case "Switch To Frame":
      return await switchToFrame(args);

    case "Switch To Default Frame":
      return await switchToDefaultFrame(args);

    case "Collect Cell Value From Table":
      return await collectCellValueFromTable(args);

    case "Get Date Time":
      return await getDateTime(args);

    case "Add Date Time":
      return await addDateTime(args);

    case "Subtract Date Time":
      return await subtractDateTime(args);

    case "If Object Visible":
      return await IfObjectVisible(args);

    case "Calculate And Store":
      return await calculateAndStore(args);

    case "Throw Error":
      return await throwError(args);

    case "Store For Loop Variable":
      return await storeForLoopVariable(args);

    case "Change Dynamic Value":
      return await changeDynamicValue(args);

    case "Custom JS Action":
      return await customJSAction(args);

    case "Wait For Network Calls":
      return await waitForNetworkCalls(args)

    default:
      break;
  }
};

const launchWebsite = async (args) => {
  const { step, driver, req, stepHistoryId } = args;
  try {
    if (step.testParameters.URL.includes("http"))
      await driver.get(step.testParameters.URL);
    else await driver.get("http://" + step.testParameters.URL);
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const hoverMouse = async (args) => {
  const { step, driver, req, stepHistoryId } = args;
  try {
    const el = await driver.findElement(
      await findByLocator(step.object.dataValues.locators)
    );
    await driver.actions().move({ origin: el, x: 0, y: 0 }).perform();
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const enterText = async (args) => {
  const { step, driver, processResult, req, stepHistoryId, executionHistory } = args
  const canExecute = await waitUntilObjectClickable(args);
  if (!canExecute) {
    if (executionHistory.continueOnError) return "CONTINUE";
    else return "STOP";
  }
  const text = step.testParameters.Text;
  if (!text) {
    console.log("No Text Found");
    if (processResult.result) {
      processResult.result = false;
    }
    return await updateStepResult(req, stepHistoryId, false);
  }
  try {
    await driver
      .findElement(await findByLocator(step.object.dataValues.locators))
      .sendKeys(text);
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const enterTextInElementByXpath = async (args) => {
  const { step, driver, req, stepHistoryId, executionHistory } = args;
  try {
    const xpath = step.testParameters.XPATH;

    const value = step.testParameters.Value;

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

    await driver.findElement(await findByLocator(locator)).sendKeys(value);

    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const pressButton = async (args) => {
  const { step, driver, req, stepHistoryId } = args;
  const Button = step.testParameters.Button;
  try {
    await driver
      .findElement(await findByLocator(step.object.dataValues.locators))
      .sendKeys(Key[Button]);
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const generateRandomNumber = async (args) => {
  const { step, output, req, stepHistoryId } = args;
  try {
    const min = Number(step.testParameters.Min)
    const max = Number(step.testParameters.Max)
    const decimal = Number(step.testParameters.Decimal) || 0
    let randomNumber = Math.random() * (max - min) + min
    output[step.testParameters.Output] = randomNumber.toFixed(decimal);
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const generateRandomString = async (args) => {
  const { step, output, req, stepHistoryId } = args;
  try {
    const characters = step.testParameters.Characters;
    const length = step.testParameters.Length;
    let randomString = "";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      randomString += characters.charAt(
        Math.floor(Math.random() * charactersLength)
      );
    }
    output[step.testParameters.Output] = randomString;
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};


const generateRandomDetails = async (args) => {
  console.log("Check")
  const { step, output, req, stepHistoryId } = args;
  try {
    const type = step.testParameters.RandomType;
    const count = step.testParameters.Count
    let data = ""
    switch (type) {
      case "Full Name":
        data = faker.person.fullName()
        break;
      case "First Name":
        data = faker.person.firstName()
        break;
      case "Last Name":
        data = faker.person.lastName()
        break;
      case "Middle Name":
        data = faker.person.middleName()
        break;
      case "Username":
        data = faker.internet.userName()
        break;
      case "Prefix":
        data = faker.person.prefix()
        break;
      case "Gender":
        data = faker.person.sexType()
        break;
      case "Street":
        data = faker.location.street()
        break;
      case "Address":
        data = faker.location.streetAddress({ useFullAddress: true })
        break;
      case "Email":
        data = faker.internet.email()
        break;
      case "Bio":
        data = faker.person.bio()
        break;
      case "Country":
        data = faker.location.country()
        break;
      case "State":
        data = faker.location.state()
        break;
      case "City":
        data = faker.location.city()
        break;
      case "Timezone":
        data = faker.location.timeZone()
        break;
      case "Paragraph":
        data = faker.lorem.paragraph(count)
        break;
      case "Paragraphs":
        data = faker.lorem.paragraphs(count)
        break;
      case "Slug":
        data = faker.lorem.slug(count)
        break;
      case "Sentence":
        data = faker.lorem.sentence(count)
        break;
      case "Sentences":
        data = faker.lorem.sentences(count)
        break;
      case "Line":
        data = faker.lorem.lines(count)
        break;
      case "Words":
        data = faker.lorem.words(count)
        break;
      case "Nanoid":
        data = faker.string.nanoid(count)
        break;
      case "UUID":
        data = faker.string.uuid()
        break;
      case "URL":
        data = faker.internet.url()
        break;
      case "Avatar":
        data = faker.internet.avatar()
        break;
      case "Color":
        data = faker.vehicle.color()
        break;
      case "IP Address":
        data = faker.internet.ip()
        break;
      case "MAC Address":
        data = faker.internet.mac()
        break;
      case "IPV4 Address":
        data = faker.internet.ipv4()
        break;
      case "IPV6 Address":
        data = faker.internet.ipv6()
        break;
      case "HTTP Method":
        data = faker.internet.httpMethod()
        break;
      case "HTTP Status Code":
        data = faker.internet.httpStatusCode()
        break;
      case "Protocol":
        data = faker.internet.protocol()
        break;
      case "User Agent":
        data = faker.internet.userAgent()
        break;
      case "Cardinal Direction":
        data = faker.location.cardinalDirection()
        break;
      case "Ordinal Direction":
        data = faker.location.ordinalDirection()
        break;
      case "Emoji":
        data = faker.internet.emoji()
        break;


      case "Mime Type":
        data = faker.system.mimeType()
        break;
      case "File Extension":
        data = faker.system.fileExt()
        break;
      case "File Name":
        data = faker.system.fileName()
        break;
      case "File Type":
        data = faker.system.fileType()
        break;
      case "Cron":
        data = faker.system.cron()
        break;
      case "Network Interface":
        data = faker.system.networkInterface()
        break;
      case "Mongo Object Id":
        data = faker.database.mongodbObjectId()
        break;
      case "IMEI":
        data = faker.phone.imei()
        break;
      case "Symbol":
        data = faker.string.symbol()
        break;
      case "Zodiac Sign":
        data = faker.person.zodiacSign()
        break;
      case "Designation":
        data = faker.person.jobType()
        break;

      default:
        data = ""
    }
    output[step.testParameters.Output] = data;
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};

const getPageTitle = async (args) => {
  const { step, driver, output, req, stepHistoryId } = args
  try {
    const title = await driver.getTitle();
    output[step.testParameters.Output] = title;
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const getPageUrl = async (args) => {
  const { step, driver, output, req, stepHistoryId } = args
  try {
    const title = await driver.getCurrentUrl();
    output[step.testParameters.Output] = title;
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const clearInput = async (args) => {
  const { step, driver, req, stepHistoryId, executionHistory } = args
  try {
    const canExecute = await waitUntilObjectClickable(args);
    if (!canExecute) {
      if (executionHistory.continueOnError) return "CONTINUE";
      else return "STOP";
    }
    await driver
      .findElement(await findByLocator(step.object.dataValues.locators))
      .clear();
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const scrollToEnd = async (args) => {
  const { driver, req, stepHistoryId } = args;
  try {
    await driver.executeScript("window.scrollBy(0,document.body.scrollHeight)");
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const scrollToTop = async (args) => {
  const { driver, req, stepHistoryId } = args;
  try {
    await driver.executeScript("window.scrollTo(0,0)");
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const copyText = async (args) => {
  const { step, output, req, stepHistoryId } = args;
  try {
    const value = step.testParameters.Value;
    output[step.testParameters.Output] = value;
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const copySubstring = async (args) => {
  const { step, output, req, stepHistoryId } = args
  try {
    const value = step.testParameters.Value;
    const start = parseInt(step.testParameters.StartIndex);
    const end = parseInt(step.testParameters.EndIndex);
    const newValue = value.substring(start, end);
    output[step.testParameters.Output] = newValue;
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const combineString = async (args) => {
  const { step, output, req, stepHistoryId } = args;
  try {
    const value1 = step.testParameters.Value1 || "";
    const value2 = step.testParameters.Value2 || "";
    const value3 = step.testParameters.Value3 || "";
    output[step.testParameters.Output] = value1 + value2 + value3;
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const printLog = async (args) => {
  const { step, req, stepHistoryId } = args;
  try {
    const value = step.testParameters.Value
    console.log(chalk.cyanBright("USER LOG: " + value + "\n"))
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const selectOptionByPosition = async (args) => {
  const { step, driver, processResult, req, stepHistoryId } = args;
  const optionElement = step.testParameters.Element
  let position = parseInt(step.testParameters.Position);
  if (!position) {
    console.log("Invalid Position Found");
    if (processResult.result) {
      processResult.result = false;
    }
    return await updateStepResult(req, stepHistoryId, false);
  }
  try {
    const select = await driver.findElement(
      await findByLocator(step.object.dataValues.locators)
    );
    const options = await select.findElements(
      await findByLocator([
        {
          dataValues: { type: "TagName", locator: optionElement },
        },
      ])
    );
    await options[position - 1].click();
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const selectOptionByValue = async (args) => {
  const { step, driver, processResult, req, stepHistoryId } = args;
  const value = step.testParameters.Value;
  if (!value) {
    console.log("No Value Found");
    if (processResult.result) {
      processResult.result = false;
    }
    return await updateStepResult(req, stepHistoryId, false);
  }

  try {
    // other possible solution => #select > option[value=value]
    await driver
      .findElement(await findByLocator(step.object.dataValues.locators))
      .sendKeys(value);
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const switchToFrame = async (args) => {
  const { step, driver, req, stepHistoryId } = args;
  try {
    const element = await driver.findElement(
      await findByLocator(step.object.dataValues.locators)
    );
    await driver.switchTo().frame(element);
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const switchToDefaultFrame = async (args) => {
  const { driver, req, stepHistoryId } = args;
  try {
    await driver.switchTo().defaultContent();
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const collectCellValueFromTable = async (args) => {
  const { step, driver, processResult, req, stepHistoryId, output } = args;
  let row = parseInt(step.testParameters.Row);
  let column = parseInt(step.testParameters.Column) - 1;
  if (isNaN(row) || isNaN(column)) {
    console.log("Invalid Position Found");
    if (processResult.result) {
      processResult.result = false;
    }
    return await updateStepResult(req, stepHistoryId, false);
  }
  try {
    const table = await driver.findElement(
      await findByLocator(step.object.dataValues.locators)
    );
    const rows = await table.findElements(
      await findByLocator([
        {
          dataValues: { type: "TagName", locator: "tr" },
        },
      ])
    );
    const col = await rows[row].findElements(
      await findByLocator([
        {
          dataValues: { type: "TagName", locator: "td" },
        },
      ])
    );
    const cell = await col[column].getText();
    output[step.testParameters.Output] = cell;
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const calculateAndStore = async (args) => {
  const { step, req, stepHistoryId, output } = args;
  try {
    const value1 = step.testParameters.Value1;
    const value2 = step.testParameters.Value2;
    const operand = step.testParameters.Operand;
    const result = eval(value1 + operand + value2);
    output[step.testParameters.Output] = result;
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const throwError = async (args) => {
  const { step } = args;
  try {
    const message = step.testParameters.Message;
    throw new Error(message);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const storeForLoopVariable = async (args) => {
  const { step, output, req, stepHistoryId, stepExtra } = args;
  try {
    output[step.testParameters.Output] = stepExtra.current;
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};
const changeDynamicValue = async (args) => {
  const { step, output, req, stepHistoryId } = args;
  try {
    const value = step.testParameters.NewValue;
    output[step.testParameters.DynamicKey] = value;
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};

const customJSAction = async (args) => {
  const { step, output, req, stepHistoryId } = args;
  try {
    const code = step.testParameters.Code;

    // const myFn = new Function("axios", code);
    // const result = await myFn(axios);

    // output[step.testParameters.Output] = result;
    return await updateStepResult(req, stepHistoryId, true);
  } catch (err) {
    return await handleActionEventError({ ...args, err });
  }
};

module.exports = { handleStep };
