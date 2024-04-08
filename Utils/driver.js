const chrome = require("selenium-webdriver/chrome");
const firefox = require("selenium-webdriver/firefox");
const safari = require("selenium-webdriver/safari");
const edge = require("selenium-webdriver/edge");
const { Builder } = require('selenium-webdriver');
const chalk = require("chalk")

const createDriver = async (req, res) => {
  try {
    return createLocalDriver(req, res);
  } catch (e) {
    getDriverError(e, res);
  }
};

const createLocalDriver = (req, res) => {
  try {
    let browser = req.body.browser || "chrome";
    let options;
    if (browser == "chrome") options = new chrome.Options()
    else if (browser == "firefox") options = new firefox.Options()
    else if (browser == "safari") options = new safari.Options()
    else if (browser == "MicrosoftEdge") options = new edge.Options()

    console.log(chalk.cyanBright(`USER INFO: FIND DRIVER MODE => ${process.env.MANUAL_DRIVER_PATH !== "false" ? "MANUAL" : "AUTO"}  \n`))

    if (process.env.MANUAL_DRIVER_PATH !== "false") {
      let driverName;
      if (browser == "chrome") driverName = "chromedriver"
      else if (browser == "firefox") driverName = "geckodriver"
      else if (browser == "MicrosoftEdge") driverName = "msedgedriver"

      //append .exe if OS is windows
      let OS = null;
      if (process.platform === "win32") OS = "Windows"
      else if (process.platform === "darwin") OS = "MacOs"
      else if (process.platform === "linux") OS = "Linux"


      console.log(chalk.blueBright(`SYSTEM INFO: Locating ${OS} driver`))

      let tempPath;

      console.log(chalk.blueBright(`SYSTEM INFO: PACKAGE=${process.env.PACKAGE}`))
      //package cannot access env variables means
      if (process.env.PACKAGE == "true") {
        let executablePath = process.execPath.split("/");
        executablePath[executablePath.length - 1] = driverName;
        tempPath = executablePath.join("/");
      } else {
        if (OS) tempPath = process.cwd() + `/Resource/Drivers/${OS}/` + driverName
        else tempPath = process.cwd() + `/Resource/Drivers/` + driverName
      }

      let path = OS == "Windows" ? tempPath + ".exe" : tempPath
      console.log(chalk.blueBright(`DRIVER PATH ${path} \n`))

      var chromeService = new chrome.ServiceBuilder(path)
      var firefoxService = new firefox.ServiceBuilder(path)
      var edgeService = new edge.ServiceBuilder(path)
    }

    console.log(chalk.cyanBright(`USER INFO: GUI=${process.env.GUI} \n`))

    if (req.body.headless || process.env.GUI == "false") {
      console.log(chalk.cyanBright(`USER INFO: Executing in Headless mode \n`))
      if (browser != "safari") {
        options.addArguments("--window-size=1920,1080");
        options.addArguments("--headless");
      } else {
        throw new Error("Safari does not support headless mode")
      }
    } else {
      console.log(chalk.cyanBright(`USER INFO: Executing in GUI mode \n`))
    }
    if (browser != "safari") {
      options.addArguments("--disable-infobars");
      options.addArguments("--disable-extensions");
      options.addArguments("--no-sandbox");
      options.addArguments("--disable-application-cache");
      options.addArguments("--disable-gpu");
      options.addArguments("--disable-dev-shm-usage")
    }

    return new Builder()
      .forBrowser(browser)
      .setChromeOptions(options)
      .setChromeService(chromeService)
      .setFirefoxOptions(options)
      .setFirefoxService(firefoxService)
      .setEdgeOptions(options)
      .setEdgeService(edgeService)
      .setSafariOptions(options)
      .build()

  } catch (e) {
    getDriverError(e, res);
  }
};

const getDriverError = (e, res) => {
  console.log(e);
  let error = "";
  let stringError = String(e);
  if (stringError.includes("Server was killed with SIGKILL")) {
    error = "System permission issue!";
  } else if (
    stringError.includes("This version of ChromeDriver only supports")
  ) {
    error = "Invalid Driver version!";
  } else if (
    stringError.includes("The specified executable path does not exist: ")
  ) {
    error = "Driver not found!";
  }
  let formattedError = error || String(e)
  console.log("Error in creating driver" + "\n" + formattedError)
  return formattedError
};
module.exports = { createDriver };
