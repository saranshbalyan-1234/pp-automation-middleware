const findChromeVersion = require("find-chrome-version");
const { findChromeDriverVersion } = require("find-chrome-driver-version");

const checkVersion = async (req, res) => {
  try {
    const chromeVersion = await findChromeVersion();
    const chromeDriverVersion = await findChromeDriverVersion();

    let compatible = false
    if (chromeVersion && chromeDriverVersion) {
      if (chromeVersion.split(".")[0] === chromeDriverVersion.split(".")[0]) { compatible = true }
    }
    res.status(200).json({ chromeVersion, chromeDriverVersion, compatible });

  } catch (error) {
    console.log(err)
    res.status(400).json(error);
  }

};

module.exports = { checkVersion }
