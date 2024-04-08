const express = require("express");
const { validateToken } = require("./Utils/Middlewares/jwt");
const helmet = require("helmet");
const cors = require("cors");
const parser = require("body-parser");
const { execute } = require("./Controllers/actionEventController");
const { checkVersion } = require("./Utils/chromeDriverCheck");
const chalk = require("chalk");
const app = express();
app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));
app.use(helmet());
app.use(
  cors({
    origin: "*",
  })
);
console.log(chalk.blueBright("\n" + `SYSTEM INFO: PLATFORM ${process.platform}`))

app.use(validateToken());

app.post("/execute", async (req, res) => {
  await execute(req, res);
});

app.get("/check-compatibility", async (req, res) => {
  await checkVersion(req, res);
});

app.use((req, res) => {
  return res.status(404).json({ error: "Endpoint Not Found" });
});

app.listen(process.env.PORT, () => {
  console.log(chalk.blueBright("\n" + `SYSTEM INFO: Sever Started on ${process.env.PORT}`))
});
